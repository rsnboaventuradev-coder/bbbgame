import React, { memo, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { Crown, Heart, Shield, Skull, Phone, Users } from 'lucide-react';

const NPCCard = memo(({ npc, isSelected, isLeader, isAngel, isRomance, nomineeData, onSelect }) => {
    return (
        <div
            onClick={() => npc.status === 'active' && onSelect(npc.id)}
            className={`
                relative w-28 h-36 p-2 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center justify-between
                ${npc.status === 'eliminated'
                    ? 'opacity-50 grayscale bg-gray-900 border-gray-800'
                    : 'bg-gray-800 hover:bg-gray-700 hover:-translate-y-1 shadow-md hover:shadow-xl'}
                ${isSelected
                    ? 'border-blue-500 ring-4 ring-blue-500/20 transform -translate-y-2 z-10'
                    : nomineeData
                        ? 'border-red-600 ring-2 ring-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.4)] animate-pulse'
                        : 'border-gray-700'}
                ${isLeader ? 'border-yellow-500/50 shadow-yellow-900/20' : ''}
            `}
        >
            {/* Badge Indicators */}
            <div className="relative">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-xl font-bold text-gray-300 border border-gray-600 shadow-inner">
                    {npc.name[0]}
                </div>
                {/* Status Badges */}
                {isLeader && (
                    <div className="absolute -top-3 -right-3 bg-gray-800 rounded-full p-1 border border-yellow-500 shadow-sm z-20" title="Líder">
                        <Crown className="text-yellow-400 w-5 h-5" fill="currentColor" />
                    </div>
                )}
                {isAngel && (
                    <div className="absolute -top-3 -left-3 bg-gray-800 rounded-full p-1 border border-blue-400 shadow-sm z-20" title="Anjo">
                        <Shield className="text-blue-300 w-5 h-5" fill="currentColor" />
                    </div>
                )}
                {isRomance && (
                    <div className="absolute -bottom-1 -right-1 bg-pink-900 rounded-full p-1 border border-pink-500 z-10" title="Romance">
                        <Heart className="text-pink-500 w-4 h-4" fill="currentColor" />
                    </div>
                )}

                {/* Nominee Indicator */}
                {nomineeData && (
                    <div className="absolute top-10 -right-4 bg-red-600 text-white rounded-full p-1.5 border-2 border-red-400 shadow-lg z-30 animate-bounce-slow" title="NO PAREDÃO">
                        {nomineeData.reason === 'leader' && <Crown size={14} className="text-yellow-300" />}
                        {nomineeData.reason === 'house' && <Users size={14} className="text-white" />}
                        {nomineeData.reason === 'big_phone' && <Phone size={14} className="text-green-300" />}
                        {!['leader', 'house', 'big_phone'].includes(nomineeData.reason) && <Skull size={14} className="text-white" />}
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

                <div className={`text-[9px] truncate uppercase tracking-wider font-bold flex items-center gap-1 ${npc.knownTrait ? 'text-purple-400' : 'text-gray-600'}`}>
                    {npc.knownTrait && (
                        <span className="text-[10px]">
                            {npc.trait.id === 'leader' && '👑'}
                            {npc.trait.id === 'emotional' && '😢'}
                            {npc.trait.id === 'competitive' && '🏆'}
                            {npc.trait.id === 'barraqueiro' && '🔥'}
                            {npc.trait.id === 'planta' && '🌱'}
                            {npc.trait.id === 'strategist' && '🧠'}
                            {npc.trait.id === 'sedutor' && '💋'}
                            {npc.trait.id === 'amigo' && '🤝'}
                            {npc.trait.id === 'manipulator' && '🎭'}
                            {npc.trait.id === 'peacemaker' && '☮️'}
                        </span>
                    )}
                    {npc.knownTrait ? npc.trait.label : 'Traço Oculto'}
                </div>
            </div>

            {/* Paredão Footer Label */}
            {nomineeData && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-20 border border-red-500">
                    NO PAREDÃO
                </div>
            )}

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
        </div>
    );
});

const NPCGrid = ({ onSelect, selectedId }) => {
    const { npcs, player, leaderId, angelId, nominees } = useGame(); // Get nominees

    const handleSelect = useCallback((id) => {
        onSelect(id);
    }, [onSelect]);

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 p-4 pb-24 overflow-y-auto max-h-[70vh] custom-scrollbar">
            {npcs.map(npc => {
                // Check if nominee
                const nomineeData = nominees.find(n => n.id === npc.id);

                return (
                    <NPCCard
                        key={npc.id}
                        npc={npc}
                        isSelected={selectedId === npc.id}
                        isLeader={leaderId === npc.id}
                        isAngel={angelId === npc.id}
                        isRomance={player.romanceId === npc.id}
                        nomineeData={nomineeData} // Pass validation object
                        onSelect={handleSelect}
                    />
                );
            })}
        </div>
    );
};

export default NPCGrid;
