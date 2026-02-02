import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Shield, Skull, Check } from 'lucide-react';

const AngelPanel = () => {
    const { npcs, player, resolveAngelChoice, logs } = useGame();
    // Construct participants list
    const participants = [...npcs, { ...player, id: 'player' }];
    const activeParticipants = participants.filter(p => !p.eliminated && (p.status === 'active' || p.id === 'player'));

    // State
    const [selectedImmune, setSelectedImmune] = useState(null);
    const [selectedMonsters, setSelectedMonsters] = useState([]);

    const handleMonsterToggle = (id) => {
        if (selectedMonsters.includes(id)) {
            setSelectedMonsters(prev => prev.filter(mid => mid !== id));
        } else {
            if (selectedMonsters.length < 2) {
                setSelectedMonsters(prev => [...prev, id]);
            }
        }
    };

    const handleConfirm = () => {
        if (selectedImmune && selectedMonsters.length === 2) {
            resolveAngelChoice(selectedImmune, selectedMonsters);
        }
    };

    const isReady = selectedImmune && selectedMonsters.length === 2;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <Shield className="text-blue-400" /> Cerimônia do Anjo
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Immunity Selection */}
                <div className="bg-gray-800 p-6 rounded-xl border border-blue-500/30">
                    <h2 className="text-xl font-bold mb-4 text-blue-300 flex items-center gap-2">
                        <Shield size={20} /> Escolha o Imune
                    </h2>
                    <p className="text-sm text-gray-400 mb-4">Quem você quer proteger do Paredão?</p>

                    <div className="grid grid-cols-2 gap-2 h-64 overflow-y-auto custom-scrollbar pr-2">
                        {activeParticipants.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedImmune(p.id)}
                                className={`
                                    p-3 rounded-lg flex items-center gap-2 transition-all text-left
                                    ${selectedImmune === p.id
                                        ? 'bg-blue-600 border border-blue-400 shadow-lg scale-105'
                                        : 'bg-gray-700 hover:bg-gray-600 border border-transparent opacity-80 hover:opacity-100'}
                                `}
                            >
                                <img
                                    src={p.avatar}
                                    alt={p.name}
                                    className="w-8 h-8 rounded-full bg-gray-500 object-cover"
                                />
                                <span className="font-semibold">{p.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Monster Selection */}
                <div className="bg-gray-800 p-6 rounded-xl border border-red-500/30">
                    <h2 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">
                        <Skull size={20} /> Escolha o Monstro (2)
                    </h2>
                    <p className="text-sm text-gray-400 mb-4">Quem vai perder estalecas e energia?</p>

                    <div className="grid grid-cols-2 gap-2 h-64 overflow-y-auto custom-scrollbar pr-2">
                        {activeParticipants.map(p => {
                            const isSelected = selectedMonsters.includes(p.id);
                            const isDisabled = !isSelected && selectedMonsters.length >= 2;

                            return (
                                <button
                                    key={p.id}
                                    onClick={() => handleMonsterToggle(p.id)}
                                    disabled={isDisabled && !isSelected}
                                    className={`
                                        p-3 rounded-lg flex items-center gap-2 transition-all text-left relative
                                        ${isSelected
                                            ? 'bg-red-900/80 border border-red-500 shadow-inner'
                                            : isDisabled
                                                ? 'bg-gray-800 opacity-40 cursor-not-allowed'
                                                : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'}
                                    `}
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-red-500 border-red-500' : 'border-gray-500'}`}>
                                        {isSelected && <Check size={12} className="text-white" />}
                                    </div>
                                    <span className="font-semibold truncate">{p.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <button
                onClick={handleConfirm}
                disabled={!isReady}
                className={`
                    mt-8 px-8 py-4 rounded-xl font-bold text-xl transition-all flex items-center gap-3
                    ${isReady
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 shadow-xl cursor-pointer'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
                `}
            >
                Confirmar Decisões <Check />
            </button>
        </div>
    );
};

export default AngelPanel;
