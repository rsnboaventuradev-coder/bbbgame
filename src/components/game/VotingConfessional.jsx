import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { UserX, Shield, Skull, HeartCrack, Brain } from 'lucide-react';

const VotingConfessional = () => {
    const { npcs, player, leaderId, immunes, submitVote } = useGame();
    const [selectedTarget, setSelectedTarget] = useState(null);
    const [justification, setJustification] = useState(null); // 'strategy', 'affinity', 'revenge'

    // Filter valid targets (Active, Not Leader, Not Immune, Not Self)
    const validTargets = npcs.filter(n =>
        n.status === 'active' &&
        n.id !== leaderId &&
        !immunes.includes(n.id) &&
        n.id !== 'player'
    );

    const handleConfirm = () => {
        if (selectedTarget && justification) {
            submitVote(selectedTarget, justification);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center p-4 animate-fadeIn">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-90"></div>

            <div className="relative z-10 w-full max-w-2xl text-center">
                <h2 className="text-3xl font-bold mb-2 tracking-widest uppercase text-red-600 drop-shadow-lg">Confessionário</h2>
                <p className="text-gray-400 mb-8 font-mono">Ninguém pode te ouvir. Escolha com sabedoria.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Target Selection */}
                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                        <h3 className="text-xl font-semibold mb-4 text-gray-200">Quem você indica?</h3>
                        <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {validTargets.map(npc => (
                                <button
                                    key={npc.id}
                                    onClick={() => setSelectedTarget(npc.id)}
                                    className={`
                                        flex flex-col items-center p-3 rounded-lg border transition-all duration-300
                                        ${selectedTarget === npc.id
                                            ? 'bg-red-900/40 border-red-500 scale-105 shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                                            : 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-500 opacity-60 hover:opacity-100'}
                                    `}
                                >
                                    <div className="w-12 h-12 bg-gray-700 rounded-full mb-2 flex items-center justify-center text-lg font-bold text-gray-300 border border-gray-600">
                                        {npc.name.charAt(0)}
                                    </div>
                                    <span className="text-xs font-medium truncate w-full">{npc.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Justification */}
                    <div className={`transition-all duration-500 ${selectedTarget ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4 pointer-events-none'}`}>
                        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 h-full flex flex-col justify-center">
                            <h3 className="text-xl font-semibold mb-4 text-gray-200">Qual o motivo?</h3>

                            <div className="space-y-3">
                                <button
                                    onClick={() => setJustification('strategy')}
                                    className={`w-full flex items-center p-4 rounded-lg border text-left transition-all hover:translate-x-1
                                        ${justification === 'strategy' ? 'bg-blue-900/30 border-blue-500 text-blue-200 shadow-lg' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}
                                    `}
                                >
                                    <Brain className="mr-3" size={24} />
                                    <div>
                                        <div className="font-bold">Estratégia</div>
                                        <div className="text-xs opacity-70">Ameaça ao meu jogo.</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setJustification('affinity')}
                                    className={`w-full flex items-center p-4 rounded-lg border text-left transition-all hover:translate-x-1
                                        ${justification === 'affinity' ? 'bg-yellow-900/30 border-yellow-500 text-yellow-200 shadow-lg' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}
                                    `}
                                >
                                    <HeartCrack className="mr-3" size={24} />
                                    <div>
                                        <div className="font-bold">Afinidade</div>
                                        <div className="text-xs opacity-70">Não somos próximos.</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setJustification('revenge')}
                                    className={`w-full flex items-center p-4 rounded-lg border text-left transition-all hover:translate-x-1
                                        ${justification === 'revenge' ? 'bg-red-900/30 border-red-500 text-red-200 shadow-lg' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}
                                    `}
                                >
                                    <Skull className="mr-3" size={24} />
                                    <div>
                                        <div className="font-bold">Vingança</div>
                                        <div className="text-xs opacity-70">Ele(a) me prejudicou.</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Confirm */}
                <div className="mt-10 h-16">
                    {selectedTarget && justification && (
                        <button
                            onClick={handleConfirm}
                            className="group relative px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all animate-bounce-short hover:scale-105"
                        >
                            <span className="flex items-center gap-2">
                                <UserX size={20} />
                                Confirmar Voto
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VotingConfessional;
