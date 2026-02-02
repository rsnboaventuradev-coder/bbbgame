import React, { useState } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, UserMinus, ShieldAlert, Heart } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ACTION_COSTS } from '../../utils/constants';

const InteractionModal = () => {
    const { activeDialogue, setActiveDialogue, updateAffinity, addLog, player, setPlayer, addInteraction, npcs, executeRomanceAction, actionsLeft, setActionsLeft } = useGame();
    const [step, setStep] = useState('opening'); // opening, gossip, result
    const [gossipTarget, setGossipTarget] = useState(null);

    if (!activeDialogue) return null;

    const close = () => {
        setActiveDialogue(null);
        setStep('opening');
        setGossipTarget(null);
    };

    // --- Logic ---
    const memory = activeDialogue.memory || [];
    const lastInteraction = memory.length > 0 ? memory[0] : null;

    // Check Refusal
    const isRefusing = lastInteraction === 'conflict' || activeDialogue.affinity < 10;

    const handleNiceString = () => {
        const msgs = [
            "Você é demais!",
            "Tamo junto nessa!",
            "Adoro seu jogo.",
            "Conte comigo."
        ];
        return msgs[Math.floor(Math.random() * msgs.length)];
    };

    const handleTalk = (type) => {
        // Validation: Energy & Actions
        const cost = ACTION_COSTS.SOCIALIZE;
        if (player.energy < cost) {
            addLog("Você está muito cansado para conversar...", "alert");
            return;
        }
        if (actionsLeft <= 0) {
            addLog("O dia acabou! Você precisa dormir.", 'alert');
            return;
        }

        // Deduct Resources
        setPlayer(prev => ({ ...prev, energy: Math.max(0, prev.energy - cost) }));
        setActionsLeft(prev => prev - 1); // Deduct Action Point

        if (type === 'nice') {
            updateAffinity(activeDialogue.id, 5);
            addLog(`Você elogiou ${activeDialogue.name}.`);
            addInteraction(activeDialogue.id, 'socialize');
            close();
        } else if (type === 'gossip') {
            // Check if they want to share
            if (activeDialogue.affinity > 50) {
                // Find a target to gossip about
                const targets = npcs.filter(n => n.id !== activeDialogue.id && n.status === 'active' && n.id !== 'player');
                if (targets.length > 0) {
                    const randomTarget = targets[Math.floor(Math.random() * targets.length)];
                    setGossipTarget(randomTarget);
                    setStep('gossip');
                } else {
                    addLog(`${activeDialogue.name} não tem novidades.`);
                    close();
                }
            } else {
                addLog(`${activeDialogue.name} desconversou (afinidade baixa).`, 'alert');
                close();
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">

                {/* Header */}
                <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold border-2 border-blue-500">
                        {activeDialogue.name[0]}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{activeDialogue.name}</h2>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className={`px-2 py-0.5 rounded ${activeDialogue.affinity > 50 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                Afinidade: {activeDialogue.affinity}%
                            </span>
                            <span>{activeDialogue.job}</span>
                        </div>
                    </div>
                    <button onClick={close} className="ml-auto text-gray-500 hover:text-white">✕</button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 'opening' && (
                        <>
                            {isRefusing ? (
                                <div className="text-center space-y-4">
                                    <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-2" />
                                    <p className="text-gray-300 italic">"Não tô muito a fim de papo com você agora..."</p>
                                    <p className="text-xs text-red-400 uppercase tracking-widest">(Recusou conversar)</p>
                                    <button onClick={close} className="w-full bg-red-600/20 hover:bg-red-600/40 text-red-200 py-2 rounded-lg mt-4">
                                        Ok, sair.
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* NPC Dialogue */}
                                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 relative">
                                        <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-800 border-t border-l border-gray-700 transform rotate-45"></div>
                                        <p className="text-gray-200">
                                            {lastInteraction === 'romance' ? "Oi chuchuzinho! 😍" :
                                                lastInteraction === 'socialize' ? "E aí, o que manda?" :
                                                    "Olá! Tudo certo?"}
                                        </p>
                                    </div>

                                    {/* Options */}
                                    <div className="grid grid-cols-1 gap-3">
                                        <button
                                            onClick={() => handleTalk('nice')}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 transition-all text-left group"
                                        >
                                            <div className="p-2 bg-blue-500/20 rounded-full group-hover:bg-blue-500 group-hover:text-white text-blue-400">
                                                <ThumbsUp size={18} />
                                            </div>
                                            <div>
                                                <span className="block font-bold text-blue-100">Jogar conversa fora</span>
                                                <span className="text-xs text-blue-300/60">Aumenta afinidade levemente.</span>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => handleTalk('gossip')}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 transition-all text-left group"
                                        >
                                            <div className="p-2 bg-purple-500/20 rounded-full group-hover:bg-purple-500 group-hover:text-white text-purple-400">
                                                <MessageCircle size={18} />
                                            </div>
                                            <div>
                                                <span className="block font-bold text-purple-100">Fofocar</span>
                                                <span className="text-xs text-purple-300/60">Tenta descobrir um segredo.</span>
                                            </div>
                                        </button>

                                        <button
                                            onClick={close}
                                            className="text-center text-gray-500 hover:text-white text-sm mt-2"
                                        >
                                            Deixa pra lá (Sair)
                                        </button>
                                    </div>

                                    {/* Romance Section */}
                                    <div className="border-t border-gray-700 pt-4 mt-2">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-pink-400 font-bold text-sm uppercase flex items-center gap-1">
                                                <Heart size={14} /> Romance
                                            </h4>
                                            {/* Chemistry Badge */}
                                            {activeDialogue.relationships?.player?.chemistry && (
                                                <span className="text-xs bg-pink-900/50 text-pink-200 px-2 py-1 rounded border border-pink-500/30">
                                                    Química: {Math.round(activeDialogue.relationships.player.chemistry)}%
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                onClick={() => { executeRomanceAction(activeDialogue.id, 'FLIRT'); close(); }}
                                                className="bg-pink-600/20 hover:bg-pink-600/40 border border-pink-500/30 text-pink-200 p-2 rounded-lg text-xs font-bold transition-colors"
                                            >
                                                Flerter (10E)
                                            </button>
                                            <button
                                                onClick={() => { executeRomanceAction(activeDialogue.id, 'KISS'); close(); }}
                                                className="bg-pink-600/30 hover:bg-pink-600/50 border border-pink-500/50 text-white p-2 rounded-lg text-xs font-bold transition-colors"
                                            >
                                                Beijar (15E)
                                            </button>
                                            <button
                                                onClick={() => { executeRomanceAction(activeDialogue.id, 'EDREDOM'); close(); }}
                                                className="bg-red-600/40 hover:bg-red-600/60 border border-red-500/50 text-white p-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                                            >
                                                🔥 Edredom (40E)
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {step === 'gossip' && gossipTarget && (
                        <div className="text-center space-y-4 animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-purple-900/50 mx-auto flex items-center justify-center border border-purple-500 mb-2">
                                <span className="text-2xl">🤫</span>
                            </div>
                            <h3 className="text-lg font-bold text-purple-300">Segredo Revelado!</h3>
                            <p className="text-gray-300">
                                {activeDialogue.name} sussurrou:
                            </p>
                            <div className="bg-black/40 p-4 rounded-lg border border-purple-500/30 italic text-purple-100">
                                "Não conta pra ninguém, mas eu acho que o(a) <strong className="text-white">{gossipTarget.name}</strong> está jogando
                                muito errado. Vi ele(a) conversando sozinho(a) sobre a votação."
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                (Afinidade com {activeDialogue.name} aumentou por compartilhar segredo)
                            </p>
                            <button onClick={() => { updateAffinity(activeDialogue.id, 10); close(); }} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-lg shadow-lg mt-4">
                                Uau! (Fechar)
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InteractionModal;
