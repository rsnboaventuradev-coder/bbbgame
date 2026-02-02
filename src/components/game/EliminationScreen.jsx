import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Skull, AlertTriangle, ArrowRight } from 'lucide-react';

const EliminationScreen = () => {
    const { nominees, npcs, player, setGameState, setNominees, setNpcs, setPlayer, addLog, setLeaderId, setAngelId } = useGame();
    const [step, setStep] = useState('intro'); // intro, speech, suspense, reveal
    const [typedSpeech, setTypedSpeech] = useState('');
    const [eliminatedId, setEliminatedId] = useState(null);

    // Get Nominee Objects
    const serverNominees = nominees.map(id =>
        id === 'player' ? { ...player, id: 'player', name: 'Você' } : npcs.find(n => n.id === id)
    ).filter(Boolean);

    // Procedural Speech Logic
    const generateSpeech = (victim) => {
        const trait = victim.trait?.name || 'Comum';
        const speeches = {
            'Líder Nato': "Quem quer comandar tudo, às vezes esquece de ouvir. A liderança isola, e hoje o isolamento é definitivo.",
            'Emotivo': "O jogo é razão, mas você foi pura emoção. Sentir demais, às vezes, é o que nos torna vulneráveis.",
            'Competitivo': "Venceu provas, mas perdeu a convivência. Não adianta correr se a direção for para fora da casa.",
            'Barraqueiro': "O fogo que você ateou no parquinho acabou queimando sua própria ponte. O público cansou do barulho.",
            'Planta': "Quem não se mostra, se esconde. E quem se esconde demais, o público esquece. Faltou jogo, faltou vida.",
            'Estrategista': "Calculou tudo, menos o fator humano. O xadrez acabou, e o xeque-mate foi em você.",
            'Sedutor': "Encantou a casa, mas não convenceu o Brasil. O charme tem prazo de validade.",
            'Amigo Leal': "A lealdade é linda, mas no jogo individual, ela cobra um preço alto demais.",
            'Comum': "Faltou tempero, faltou sal. Em meio a tantos sabores, você passou despercebido."
        };
        return speeches[trait] || "O público decidiu, e a vontade da maioria é soberana. Seu tempo acabou.";
    };

    // Calculate Result Effect
    useEffect(() => {
        if (step === 'intro') {
            setTimeout(() => setStep('speech'), 2000);
        } else if (step === 'speech') {
            // Logic to determine eliminated
            if (serverNominees.length === 0) {
                // Fallback if no nominees (should not happen in normal flow)
                addLog("Erro: Sem emparedados para eliminar.", "error");
                setGameState('PLAYING');
                return;
            }
            const victim = serverNominees.sort((a, b) => (a.popularity || 50) - (b.popularity || 50))[0]; // Lowest pop leaves
            if (victim) {
                setEliminatedId(victim.id);
            } else {
                return;
            }

            const speechText = generateSpeech(victim);
            let i = 0;
            const typing = setInterval(() => {
                setTypedSpeech(prev => speechText.slice(0, i + 1));
                i++;
                if (i >= speechText.length) clearInterval(typing);
            }, 40);
        }
    }, [step]);

    const handleReveal = () => {
        setStep('suspense');
        setTimeout(() => {
            setStep('reveal');
            finalizeElimination(eliminatedId);
        }, 3000); // 3s Suspense
    };

    const finalizeElimination = (id) => {
        // Apply backend logic (copied/adapted from GameContext resolveElimination)
        if (id === 'player') {
            // Player Eliminated
            // Handled by return to Menu or Game Over screen usually, but locally here:
            // setGameState('ELIMINATED'); // handled by button
        } else {
            setNpcs(prev => prev.map(n => n.id === id ? { ...n, status: 'eliminated' } : n));
            // Reset week roles
            setLeaderId(null);
            setAngelId(null);
            setNominees([]);
            addLog(`Um participante deixou a casa...`, 'system');
        }
    };

    const finishCeremony = () => {
        if (eliminatedId === 'player') {
            setGameState('MENU'); // Or Game Over
            alert("VOCÊ FOI ELIMINADO!");
        } else {
            setGameState('PLAYING');
        }
    };

    const victimName = eliminatedId === 'player' ? 'Você' : npcs.find(n => n.id === eliminatedId)?.name;

    return (
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center p-6 prose-invert">
            {/* Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black"></div>

            <div className="relative z-10 w-full max-w-3xl text-center">

                {step === 'intro' && (
                    <h1 className="text-4xl font-bold animate-pulse text-gray-300 tracking-widest">
                        A DECISÃO
                    </h1>
                )}

                {(step === 'speech' || step === 'suspense' || step === 'reveal') && (
                    <div className="space-y-8">
                        {/* Nominees Showcase */}
                        <div className="flex justify-center gap-8 mb-12">
                            {serverNominees.map(nom => (
                                <div key={nom.id} className={`transition-all duration-700 ${step === 'reveal' && nom.id !== eliminatedId ? 'opacity-20 blur-sm grayscale' : 'opacity-100'}`}>
                                    <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 flex items-center justify-center text-3xl font-bold bg-gray-800 relative
                                        ${step === 'reveal' && nom.id === eliminatedId ? 'border-red-600 shadow-[0_0_30px_red] scale-110' : 'border-gray-600'}
                                    `}>
                                        {nom.name?.charAt(0)}
                                        {/* X Overlay */}
                                        {step === 'reveal' && nom.id === eliminatedId && (
                                            <div className="absolute inset-0 flex items-center justify-center text-red-600 animate-ping">
                                                <Skull size={64} />
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-4 font-bold text-lg">{nom.name}</p>
                                </div>
                            ))}
                        </div>

                        {/* Speech Box */}
                        <div className="bg-gray-900/80 p-8 rounded-lg border-l-4 border-indigo-500 min-h-[150px] flex items-center justify-center shadow-lg">
                            <p className="text-xl md:text-2xl font-serif italic text-gray-300 leading-relaxed">
                                "{typedSpeech}"
                            </p>
                        </div>

                        {/* Button or Suspense */}
                        {step === 'speech' && typedSpeech.length > 10 && (
                            <button
                                onClick={handleReveal}
                                className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold tracking-widest uppercase transition-all hover:scale-105 animate-bounce-short"
                            >
                                Revelar Resultado
                            </button>
                        )}

                        {step === 'suspense' && (
                            <div className="text-6xl font-black text-red-600 animate-pulse">
                                ...
                            </div>
                        )}

                        {step === 'reveal' && (
                            <div className="animate-fadeInUp">
                                <h2 className="text-4xl font-bold text-white mb-2">
                                    <span className="text-red-500">{victimName}</span>, acabou para você.
                                </h2>
                                <p className="text-gray-500 mb-8">Vem pra cá!</p>

                                <button
                                    onClick={finishCeremony}
                                    className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Continuar Jogo <ArrowRight className="inline ml-2" size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EliminationScreen;
