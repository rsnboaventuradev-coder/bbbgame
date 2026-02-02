import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Skull, AlertTriangle } from 'lucide-react';

const VotingPanel = () => {
    const { npcs, submitVote, leaderId, immunes } = useGame();
    const [selectedId, setSelectedId] = useState(null);

    const handleVote = () => {
        if (selectedId) {
            submitVote(selectedId);
        }
    };

    // Filter out eliminated, leader (usually immune from voting unless rule changes), and immune players
    const candidates = npcs.filter(n =>
        n.status === 'active' &&
        n.id !== leaderId &&
        !immunes.includes(n.id)
    );

    return (
        <div className="flex flex-col items-center justify-center p-6 text-white h-full bg-red-900/20 backdrop-blur-sm rounded-xl border border-red-900/50">
            <div className="text-center mb-6">
                <Skull className="w-16 h-16 text-red-500 mx-auto mb-2 animate-pulse" />
                <h2 className="text-3xl font-bold uppercase tracking-widest text-red-100">Paredão</h2>
                <p className="text-red-300">Vote em quem você quer que saia da casa.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mb-8 overflow-y-auto max-h-[60vh] custom-scrollbar p-2">
                {candidates.map(npc => (
                    <div
                        key={npc.id}
                        onClick={() => setSelectedId(npc.id)}
                        className={`
                            relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 group
                            ${selectedId === npc.id
                                ? 'bg-red-600 border-red-400 scale-105 shadow-[0_0_20px_rgba(220,38,38,0.5)]'
                                : 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-red-900/50'}
                        `}
                    >
                        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold border border-gray-600">
                            {npc.name[0]}
                        </div>
                        <div className="text-center">
                            <span className="font-bold block">{npc.name}</span>
                            <span className="text-xs text-gray-400 bg-gray-900/50 px-2 py-0.5 rounded-full">{npc.job}</span>
                        </div>

                        {/* Affinity Hint */}
                        <div className={`text-[10px] uppercase font-bold mt-1 ${npc.affinity < 30 ? 'text-red-400' :
                            npc.affinity > 70 ? 'text-green-400' : 'text-gray-500'
                            }`}>
                            {npc.affinity < 30 ? 'Inimigo' : npc.affinity > 70 ? 'Aliado' : 'Neutro'}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleVote}
                disabled={!selectedId}
                className={`
                    px-8 py-4 rounded-xl font-bold text-xl uppercase tracking-wider transition-all
                    ${selectedId
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/50 hover:scale-105'
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'}
                `}
            >
                Confirmar Voto
            </button>
        </div>
    );
};

export default VotingPanel;
