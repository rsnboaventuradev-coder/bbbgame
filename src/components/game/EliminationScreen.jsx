import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Skull, AlertTriangle, ArrowRight, Crown, Phone, Users } from 'lucide-react';

const EliminationScreen = () => {
    const { nominees, npcs, player, setGameState, setNominees, setNpcs, setPlayer, addLog, setLeaderId, setAngelId } = useGame();
    const [step, setStep] = useState('intro'); // intro, speech, suspense, reveal
    const [typedSpeech, setTypedSpeech] = useState('');
    const [eliminatedId, setEliminatedId] = useState(null);

    // Get Nominee Objects
    const serverNominees = nominees.map(nom => {
        const char = nom.id === 'player' ? { ...player, id: 'player', name: 'Você' } : npcs.find(n => n.id === nom.id);
        return char ? { ...char, reason: nom.reason } : null;
    }).filter(Boolean);

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
    }, [step, serverNominees, addLog, setGameState]);

    const handleReveal = () => {
        setStep('suspense');
        setTimeout(() => setStep('reveal'), 3000); // 3s suspense
    };

    const handleFinish = () => {
        // Find victim object
        const elim = serverNominees.find(n => n.id === eliminatedId);
        if (elim) {
            if (elim.id === 'player') {
                setGameState('ELIMINATED');
            } else {
                // Remove NPC
                setNpcs(prev => prev.map(n => n.id === elim.id ? { ...n, status: 'eliminated' } : n));
                addLog(`ELIMINADO: ${elim.name} deixou a casa!`, 'bad');

                // Determine survivor
                const survivor = serverNominees.find(n => n.id !== elim.id);
                if (survivor && survivor.id === 'player') {
                    setPlayer(prev => ({ ...prev, paredoesCount: prev.paredoesCount + 1 }));
                    addLog("Você voltou do Paredão!", 'success');
                }

                setNominees([]);
                setLeaderId(null);
                setAngelId(null);
                setGameState('PLAYING'); // Back to game
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-center p-4 animate-fadeIn">
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

                                        {/* Reason Badge */}
                                        <div className="absolute -top-2 -right-2 bg-gray-900 rounded-full p-1.5 border border-gray-500 shadow-sm z-20"
                                            title={nom.reason === 'leader' ? "Indicado pelo Líder" : nom.reason === 'big_phone' ? "Pelo Big Fone" : "Pela Casa"}>
                                            {nom.reason === 'leader' && <Crown size={16} className="text-yellow-400" />}
                                            {nom.reason === 'house' && <Users size={16} className="text-blue-400" />}
                                            {nom.reason === 'big_phone' && <Phone size={16} className="text-green-400" />}
                                            {!['leader', 'house', 'big_phone'].includes(nom.reason) && <Skull size={16} className="text-white" />}
                                        </div>

                                        {/* X Overlay */}
                                        {step === 'reveal' && nom.id === eliminatedId && (
                                            <div className="absolute inset-0 flex items-center justify-center text-red-600 animate-ping">
                                                <Skull size={64} />
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-4 font-bold text-lg flex flex-col items-center">
                                        {nom.name}
                                        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-normal mt-1">
                                            {nom.reason === 'leader' ? 'Pelo Líder' : nom.reason === 'big_phone' ? 'Big Fone' : 'Pela Casa'}
                                        </span>
                                    </p>
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
                                className="mt-8 px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xl rounded-full shadow-[0_0_20px_red] animate-pulse transition-all hover:scale-105"
                            >
                                QUEM SAI?
                            </button>
                        )}

                        {step === 'reveal' && (
                            <button
                                onClick={handleFinish}
                                className="mt-8 px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg rounded-full border border-gray-500 transition-all"
                            >
                                Continuar
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EliminationScreen;
