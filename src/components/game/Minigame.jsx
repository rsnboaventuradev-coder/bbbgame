import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { Target, Brain, Timer, HelpCircle, Package, Lock } from 'lucide-react';

const Minigame = () => {
    const { minigameState, finishMinigame } = useGame();
    const [gameState, setGameState] = useState('ready'); // ready, playing, finished
    const [localScore, setLocalScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(minigameState.timeLeft || 10);

    // --- MODE: REFLEX (Leader-style) ---
    const [activeReflexTarget, setActiveReflexTarget] = useState(null);

    // --- MODE: MEMORY (Simon Says) ---
    const [sequence, setSequence] = useState([]);
    const [playerSequence, setPlayerSequence] = useState([]);
    const [isShowingSequence, setIsShowingSequence] = useState(false);
    const [activeMemoryBtn, setActiveMemoryBtn] = useState(null);
    const colors = ['red', 'green', 'blue', 'yellow'];

    // --- MODE: LUCK (Box Choice) ---
    const [selectedBox, setSelectedBox] = useState(null);
    const [luckRound, setLuckRound] = useState(1);
    const [luckMessage, setLuckMessage] = useState("");
    const [boxes, setBoxes] = useState([0, 1, 2]); // Just indices

    const gameEnded = useRef(false); // Prevent double triggers

    // --- EFFECT: Timer (Only for Reflex/Timed modes) ---
    useEffect(() => {
        let timer;
        if (gameState === 'playing' && minigameState.mode === 'reflex') {
            timer = setInterval(() => {
                setTimeLeft((prev) => Math.max(0, prev - 1));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState, minigameState.mode]);

    // --- EFFECT: Check Game Over (Time) ---
    useEffect(() => {
        if (gameState === 'playing' && minigameState.mode === 'reflex' && timeLeft === 0) {
            endGame();
        }
    }, [timeLeft, gameState, minigameState.mode]);

    // --- START GAME ---
    const startGame = () => {
        setGameState('playing');
        setLocalScore(0);
        gameEnded.current = false; // Reset lock

        if (minigameState.mode === 'reflex') {
            spawnReflexTarget();
        } else if (minigameState.mode === 'memory') {
            setTimeout(() => nextMemoryRound([]), 500);
        } else if (minigameState.mode === 'luck') {
            setLuckRound(1);
            setLuckMessage("Escolha uma caixa!");
        }
    };

    const endGame = (finalScore = null) => {
        if (gameEnded.current) return;
        gameEnded.current = true;

        setGameState('finished');
        setTimeout(() => {
            finishMinigame(finalScore !== null ? finalScore : localScore);
        }, 1500);
    };

    // ================== REFLEX LOGIC ==================
    const spawnReflexTarget = () => {
        const slots = 9;
        const randomSlot = Math.floor(Math.random() * slots);
        setActiveReflexTarget(randomSlot);
    };

    const handleReflexClick = (index) => {
        if (index === activeReflexTarget) {
            setLocalScore(prev => prev + 1);
            spawnReflexTarget();
        }
    };

    // ================== MEMORY LOGIC ==================
    const nextMemoryRound = (currentSeq) => {
        setIsShowingSequence(true);
        setPlayerSequence([]);

        const nextColor = colors[Math.floor(Math.random() * colors.length)];
        const newSequence = [...currentSeq, nextColor];
        setSequence(newSequence);

        let i = 0;
        const interval = setInterval(() => {
            if (i >= newSequence.length) {
                clearInterval(interval);
                setIsShowingSequence(false);
                setActiveMemoryBtn(null);
                return;
            }
            setActiveMemoryBtn(newSequence[i]);
            setTimeout(() => setActiveMemoryBtn(null), 400);
            i++;
        }, 800);
    };

    const handleMemoryClick = (color) => {
        if (isShowingSequence) return;

        const newPlayerSeq = [...playerSequence, color];
        setPlayerSequence(newPlayerSeq);

        // Visual Feedback
        setActiveMemoryBtn(color);
        setTimeout(() => setActiveMemoryBtn(null), 200);

        // Verify
        const expectedColor = sequence[newPlayerSeq.length - 1];
        if (color !== expectedColor) {
            // Wrong!
            setLuckMessage("Errou a sequência!");
            setTimeout(() => endGame(localScore), 1000); // End with current score (rounds completed)
            return;
        }

        if (newPlayerSeq.length === sequence.length) {
            // Round Complete
            setLocalScore(sequence.length); // Score = levels beaten
            if (sequence.length >= 8) { // Max level cap to prevent boredom/infinite
                setTimeout(() => endGame(sequence.length), 500);
            } else {
                setTimeout(() => nextMemoryRound(sequence), 1000);
            }
        }
    };

    // ================== LUCK LOGIC ==================
    const handleBoxClick = (index) => {
        if (selectedBox !== null) return;
        setSelectedBox(index);

        // Logic: 
        // Round 1: 3 Boxes. 1 Bad, 2 Good.
        // Round 2: 3 Boxes. 1 Bad, 2 Good. (Or keep it simple: Just accumulate points)
        // User asked: "o jogador deve escolher entre 3 caixas, uma elimina, uma avança"
        // Let's implement: 3 boxes. 
        // 1 = Eliminate (Game Over, Score 0)
        // 1 = Advance (Next Round)
        // 1 = Win (Instant Bonus? Or just another Advance? Prompt says "uma elimina, uma avança". The third might be neutral or also advance?)
        // Let's go with: 2 Advance, 1 Eliminate. If you survive X rounds, you get high score.

        const outcome = Math.random(); // 0-1
        // 33% Eliminate, 66% Advance
        const isEliminated = outcome < 0.33;

        setTimeout(() => {
            if (isEliminated) {
                setLuckMessage("ELIMINADO! A caixa tinha um X.");
                setTimeout(() => endGame(0), 1000);
            } else {
                setLuckMessage("AVANÇOU! Próxima fase...");
                setLocalScore(prev => prev + 1); // Point per round
                if (luckRound >= 5) {
                    setLuckMessage("VOCÊ VENCEU A PROVA DA SORTE!");
                    setTimeout(() => endGame(10), 1000); // Max score equivalent
                } else {
                    setTimeout(() => {
                        setSelectedBox(null);
                        setLuckRound(prev => prev + 1);
                        setLuckMessage(`Rodada ${luckRound + 1}`);
                    }, 1000);
                }
            }
        }, 1000); // Suspense delay
    };

    // --- RENDER HELPERS ---
    const getTitle = () => {
        if (minigameState.type === 'leader') return 'Prova do Líder';
        if (minigameState.type === 'angel') return 'Prova do Anjo';
        return 'Minigame';
    };

    const getInstruction = () => {
        if (minigameState.mode === 'reflex') return 'Clique nos alvos verdes rapidamente!';
        if (minigameState.mode === 'memory') return 'Decore e repita a sequência de cores.';
        if (minigameState.mode === 'luck') return 'Escolha a caixa certa para avançar. Cuidado com o X!';
        return '';
    };

    const getIcon = () => {
        if (minigameState.mode === 'reflex') return <Target className="text-yellow-400" size={32} />;
        if (minigameState.mode === 'memory') return <Brain className="text-blue-400" size={32} />;
        if (minigameState.mode === 'luck') return <HelpCircle className="text-purple-400" size={32} />;
        return <Package size={32} />;
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-white bg-gray-900 min-h-screen">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                {getIcon()}
                {getTitle()}
            </h2>

            {gameState === 'ready' && (
                <div className="text-center animate-fade-in">
                    <p className="mb-6 text-xl text-gray-300 max-w-md mx-auto">{getInstruction()}</p>
                    <button
                        onClick={startGame}
                        className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 rounded-xl font-bold text-2xl shadow-lg transition-transform"
                    >
                        INICIAR DESAFIO
                    </button>
                </div>
            )}

            {gameState === 'playing' && (
                <div className="w-full max-w-md flex flex-col items-center">
                    {/* HUD */}
                    <div className="flex justify-between w-full mb-6 px-4 bg-gray-800/80 p-4 rounded-xl shadow-lg border border-gray-700">
                        {minigameState.mode === 'reflex' && (
                            <div className="flex items-center gap-2 text-red-400">
                                <Timer size={24} />
                                <span className="font-mono text-2xl font-bold">{timeLeft}s</span>
                            </div>
                        )}
                        {minigameState.mode === 'luck' && (
                            <div className="flex items-center gap-2 text-purple-400">
                                <span className="font-bold text-xl">Rodada {luckRound}</span>
                            </div>
                        )}
                        {minigameState.mode === 'memory' && (
                            <div className="flex items-center gap-2 text-blue-400">
                                <span className="font-bold text-xl">Nível {sequence.length}</span>
                            </div>
                        )}
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-400 uppercase tracking-widest">Score</span>
                            <span className="text-2xl font-bold text-yellow-500 font-mono">{localScore}</span>
                        </div>
                    </div>

                    {/* --- REFLEX BOARD --- */}
                    {minigameState.mode === 'reflex' && (
                        <div className="grid grid-cols-3 gap-3 w-72 h-72">
                            {[...Array(9)].map((_, i) => (
                                <button
                                    key={i}
                                    onMouseDown={() => handleReflexClick(i)} // MouseDown for faster response
                                    className={`
                                        rounded-xl transition-all duration-75 border-2 shadow-lg relative overflow-hidden
                                        ${i === activeReflexTarget
                                            ? 'bg-green-500 border-green-300 scale-105 z-10'
                                            : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}
                                    `}
                                >
                                    {i === activeReflexTarget && (
                                        <div className="absolute inset-0 bg-white opacity-20 animate-ping" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* --- MEMORY BOARD --- */}
                    {minigameState.mode === 'memory' && (
                        <div className="flex flex-col items-center">
                            {isShowingSequence && (
                                <p className="mb-4 text-blue-300 font-bold animate-pulse tracking-widest uppercase">Memorize...</p>
                            )}
                            {!isShowingSequence && (
                                <p className="mb-4 text-green-400 font-bold tracking-widest uppercase">Sua Vez!</p>
                            )}
                            <div className="grid grid-cols-2 gap-4 w-64 h-64">
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => handleMemoryClick(color)}
                                        disabled={isShowingSequence}
                                        className={`
                                            rounded-2xl transition-all duration-150 border-4 shadow-xl
                                            ${color === 'red' ? 'bg-red-600 border-red-800' : ''}
                                            ${color === 'green' ? 'bg-green-600 border-green-800' : ''}
                                            ${color === 'blue' ? 'bg-blue-600 border-blue-800' : ''}
                                            ${color === 'yellow' ? 'bg-yellow-500 border-yellow-700' : ''}
                                            ${activeMemoryBtn === color
                                                ? 'brightness-150 scale-95 shadow-inner ring-4 ring-white/50'
                                                : 'hover:brightness-110 active:scale-95'}
                                            ${isShowingSequence ? 'cursor-default' : 'cursor-pointer'}
                                        `}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- LUCK BOARD --- */}
                    {minigameState.mode === 'luck' && (
                        <div className="flex flex-col items-center w-full">
                            <p className="mb-8 text-xl text-center font-bold text-purple-200 min-h-[2rem] animate-pulse">
                                {luckMessage || "Escolha com sabedoria..."}
                            </p>
                            <div className="flex justify-center gap-4 w-full">
                                {boxes.map((i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleBoxClick(i)}
                                        disabled={selectedBox !== null}
                                        className={`
                                            w-24 h-24 bg-gradient-to-br from-purple-700 to-indigo-900 
                                            rounded-xl border-t-4 border-purple-500 shadow-xl
                                            flex items-center justify-center text-3xl transition-all
                                            ${selectedBox === null ? 'hover:-translate-y-2 hover:shadow-2xl cursor-pointer' : ''}
                                            ${selectedBox === i ? 'scale-110 ring-4 ring-yellow-400 z-10' : 'opacity-50 scale-90'}
                                        `}
                                    >
                                        {selectedBox === i ? <Package size={40} className="animate-bounce" /> : <Lock size={32} className="text-purple-300" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {gameState === 'finished' && (
                <div className="text-center animate-fade-in bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl max-w-sm">
                    <h3 className="text-3xl font-bold mb-4 text-white">Fim de Prova!</h3>
                    <div className="mb-6">
                        <span className="text-gray-400 text-sm uppercase tracking-wider">Resultado Final</span>
                        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                            {localScore}
                        </div>
                    </div>
                    <p className="text-gray-400 animate-pulse">Calculando vencedores...</p>
                </div>
            )}
        </div>
    );
};

export default Minigame;
