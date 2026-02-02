import React from 'react';
import { useGame } from '../../context/GameContext';
import { Crown, Heart, Shield, Skull } from 'lucide-react';

const NPCGrid = () => {
    const { npcs, selectedTarget, setSelectedTarget, leaderId, angelId, player } = useGame();

    return (
        <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-start content-start">
            {npcs.map(npc => (
                <div
                    key={npc.id}
                    onClick={() => npc.status === 'active' && setSelectedTarget(npc.id === selectedTarget ? null : npc.id)}
                    className={`
                        relative w-28 h-36 p-2 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center justify-between
                        ${npc.status === 'eliminated'
                            ? 'opacity-50 grayscale bg-gray-900 border-gray-800'
                            : 'bg-gray-800 hover:bg-gray-700 hover:-translate-y-1 shadow-md hover:shadow-xl'}
                        ${selectedTarget === npc.id
                            ? 'border-blue-500 ring-4 ring-blue-500/20 transform -translate-y-2 z-10'
                            : 'border-gray-700'}
                        ${leaderId === npc.id ? 'border-yellow-500/50 shadow-yellow-900/20' : ''}
                    `}
                >
                    {/* Badge Indicators */}
                    <div className="relative">
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-xl font-bold text-gray-300 border border-gray-600 shadow-inner">
                            {npc.name[0]}
                        </div>
                        {leaderId === npc.id && (
                            <div className="absolute -top-3 -right-3 bg-gray-800 rounded-full p-1 border border-yellow-500 shadow-sm" title="Líder">
                                <Crown className="text-yellow-400 w-5 h-5" fill="currentColor" />
                            </div>
                        )}
                        {angelId === npc.id && (
                            <div className="absolute -top-3 -left-3 bg-gray-800 rounded-full p-1 border border-blue-400 shadow-sm" title="Anjo">
                                <Shield className="text-blue-300 w-5 h-5" fill="currentColor" />
                            </div>
                        )}
                        {player.romanceId === npc.id && (
                            <div className="absolute -bottom-1 -right-1 bg-pink-900 rounded-full p-1 border border-pink-500" title="Romance">
                                <Heart className="text-pink-500 w-4 h-4" fill="currentColor" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="w-full text-center">
                        <div className="font-bold text-sm truncate text-white">
                            {npc.name}
                            <span className="ml-1 text-[10px] text-gray-500 font-normal">{npc.age}y</span>
                        </div>

                        <div className="text-[9px] text-gray-400 truncate uppercase tracking-wider mt-0.5">
                            {npc.knownJob ? npc.job : '???'}
                        </div>

                        <div className={`text-[9px] truncate uppercase tracking-wider font-bold ${npc.knownTrait ? 'text-purple-400' : 'text-gray-600'}`}>
                            {npc.knownTrait ? npc.trait.name : '???'}
                        </div>
                    </div>

                    {/* Affinity Bar */}
                    {npc.status === 'active' && (
                        <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden mt-1">
                            <div
                                className={`h-full transition-all duration-500 ${npc.affinity > 75 ? 'bg-pink-500' :
                                    npc.affinity > 40 ? 'bg-blue-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${npc.affinity}%` }}
                            />
                        </div>
                    )}

                    {/* Elimination Overlay */}
                    {npc.status === 'eliminated' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl backdrop-blur-[1px]">
                            <Skull className="text-red-500 mb-1" size={24} />
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest border border-red-500 px-2 py-0.5 rounded rotate-12">Eliminado</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default NPCGrid;
