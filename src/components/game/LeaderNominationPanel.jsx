import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { UserX, Shield, Crown, Brain, Skull } from 'lucide-react';

const LeaderNominationPanel = () => {
    const { npcs, player, immunes, submitLeaderNomination } = useGame();
    const [selectedTarget, setSelectedTarget] = useState(null);

    // Filter valid targets (Active, Not Immune, Not Self)
    // Leader can nominate anyone except Immunes (Angel + Big Phone)
    const validTargets = npcs.filter(n =>
        n.status === 'active' &&
        !immunes.includes(n.id) &&
        n.id !== 'player'
    );

    const handleConfirm = () => {
        if (selectedTarget) {
            submitLeaderNomination(selectedTarget);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center p-4 animate-fadeIn">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900 via-black to-black opacity-90"></div>

            {/* Crown Decoration */}
            <div className="absolute top-10 animate-bounce-slow">
                <Crown size={80} className="text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]" />
            </div>

            <div className="relative z-10 w-full max-w-2xl text-center mt-20">
                <h2 className="text-4xl font-black mb-2 tracking-widest uppercase text-yellow-500 drop-shadow-lg">Indicação do Líder</h2>
                <p className="text-yellow-200/80 mb-8 font-mono text-lg">Com grandes poderes vêm grandes responsabilidades. Quem você manda para o Paredão?</p>

                <div className="bg-gray-900/80 p-6 rounded-xl border border-yellow-700/50 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto px-2 custom-scrollbar">
                        {validTargets.map(npc => (
                            <button
                                key={npc.id}
                                onClick={() => setSelectedTarget(npc.id)}
                                className={`
                                    flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group
                                    ${selectedTarget === npc.id
                                        ? 'bg-yellow-900/60 border-yellow-500 scale-105 shadow-[0_0_20px_rgba(234,179,8,0.6)]'
                                        : 'bg-gray-800 border-gray-700 hover:border-yellow-500/50 hover:bg-gray-700'}
                                `}
                            >
                                <div className="w-20 h-20 bg-gray-600 rounded-full mb-3 flex items-center justify-center text-3xl font-bold text-gray-300 border-2 border-gray-500 group-hover:border-yellow-400 transition-colors">
                                    {npc.name.charAt(0)}
                                </div>
                                <span className="font-bold text-sm truncate w-full group-hover:text-yellow-300">{npc.name}</span>

                                {selectedTarget === npc.id && (
                                    <div className="absolute top-2 right-2 text-yellow-500 animate-ping">
                                        <Skull size={12} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer / Confirm */}
                <div className="mt-10 h-20 flex justify-center items-center">
                    {selectedTarget && (
                        <button
                            onClick={handleConfirm}
                            className="group relative px-10 py-5 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-black text-xl rounded-full uppercase tracking-widest shadow-[0_0_30px_rgba(234,179,8,0.6)] transition-all transform hover:scale-105 active:scale-95"
                        >
                            <span className="flex items-center gap-3">
                                <Crown size={24} />
                                Confirmar Indicação
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderNominationPanel;
