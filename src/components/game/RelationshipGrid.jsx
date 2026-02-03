import React from 'react';
import { useGame } from '../../context/GameContext';
import { Heart, Bomb, Meh, X, Smile } from 'lucide-react';

const RelationshipGrid = () => {
    const { npcs, player, showRelationshipGrid, setShowRelationshipGrid } = useGame();

    if (!showRelationshipGrid) return null;

    const activeNpcs = npcs.filter(n => n.status === 'active');
    // Sort logic: Player checks others (cols), Others check Player (col 1)
    const allChars = [
        { ...player, id: 'player', name: 'Você' },
        ...activeNpcs
    ];

    const getIcon = (value) => {
        if (value >= 80) return <Heart size={18} className="text-red-500 fill-red-500 animate-pulse-slow" />;
        if (value < 10) return <span className="text-xl inline-block animate-snake">🐍</span>;
        if (value < 30) return <Bomb size={18} className="text-gray-400" />;
        if (value > 60) return <Smile size={18} className="text-green-400" />;
        return <Meh size={18} className="text-gray-600" />;
    };

    return (
        <div className="fixed inset-0 z-[40] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden max-w-6xl w-full max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-950">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-500 p-2 rounded-lg text-black font-bold">
                            <Heart size={20} className="fill-black" />
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            Queridômetro
                        </h2>
                    </div>
                    <button onClick={() => setShowRelationshipGrid(false)} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="overflow-auto custom-scrollbar p-4 relative bg-gray-900/50">
                    {/* Legend */}
                    <div className="flex gap-4 mb-4 text-xs text-gray-400 justify-center">
                        <span className="flex items-center gap-1"><Heart size={12} className="text-red-500" /> Aliado (&gt;80)</span>
                        <span className="flex items-center gap-1"><Smile size={12} className="text-green-400" /> Amigo (&gt;60)</span>
                        <span className="flex items-center gap-1"><Meh size={12} className="text-gray-600" /> Neutro</span>
                        <span className="flex items-center gap-1"><Bomb size={12} className="text-gray-400" /> Rival (&lt;30)</span>
                        <span className="flex items-center gap-1">🐍 Inimigo (&lt;10)</span>
                    </div>

                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="p-2 sticky left-0 z-20 bg-gray-900 border-b border-gray-800 min-w-[100px] text-right pr-4 text-gray-500 font-normal italic text-xs">
                                    Quem sente <br /> &darr;
                                </th>
                                {allChars.map(char => (
                                    <th key={char.id} className="p-2 min-w-[50px] text-center border-b border-gray-800 bg-gray-900 sticky top-0 z-10" title={char.name}>
                                        <div className="text-xs font-bold text-gray-300 truncate w-16 mx-auto bg-gray-800 rounded px-1 py-0.5 border border-gray-700">
                                            {char.name.split(' ')[0]}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {allChars.map(rowChar => (
                                <tr key={rowChar.id} className="hover:bg-gray-800/30 transition-colors">
                                    {/* Row Header (Subject) */}
                                    <td className="p-2 sticky left-0 z-10 bg-gray-900 border-r border-gray-800 text-right font-bold text-sm text-gray-200 shadow-[2px_0_5px_rgba(0,0,0,0.5)]">
                                        {rowChar.name.split(' ')[0]}
                                    </td>

                                    {/* Cells */}
                                    {allChars.map(colChar => {
                                        const isSelf = rowChar.id === colChar.id;

                                        if (isSelf) {
                                            return <td key={colChar.id} className="p-2 bg-gray-800/20 border border-gray-800/20"></td>;
                                        }

                                        // Retrieve Value
                                        let value = 50;
                                        let isPlayerRow = rowChar.id === 'player';

                                        if (isPlayerRow) {
                                            return <td key={colChar.id} className="p-2 text-center border border-gray-800/30 text-gray-700">-</td>;
                                        } else {
                                            // NPC Logic
                                            value = rowChar.relationships?.[colChar.id] ?? 50;
                                        }

                                        return (
                                            <td key={colChar.id} className="p-2 text-center border border-gray-800/30 relative group cursor-help">
                                                <div className="flex justify-center transition-transform group-hover:scale-125">
                                                    {getIcon(value)}
                                                </div>
                                                {/* Tooltip */}
                                                <div className="absolute hidden group-hover:block z-50 bottom-full left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded whitespace-nowrap mb-1 border border-gray-700 shadow-xl">
                                                    {rowChar.name} vê {colChar.name}: {value}%
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RelationshipGrid;
