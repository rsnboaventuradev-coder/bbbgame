import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Crown, Eye, Film, AlertTriangle, X } from 'lucide-react';

const LeaderPanel = ({ onClose }) => {
    const { player, leaderId, npcs, resolveLeaderPerk, gameState } = useGame();
    const [selectedPerk, setSelectedPerk] = useState(null); // 'cinema', 'spy'
    const [selectedCinemaGuests, setSelectedCinemaGuests] = useState([]);
    const [spyData, setSpyData] = useState(null);

    if (leaderId !== 'player') return null;

    const handleInvite = (npcId) => {
        if (selectedCinemaGuests.includes(npcId)) {
            setSelectedCinemaGuests(prev => prev.filter(id => id !== npcId));
        } else {
            if (selectedCinemaGuests.length < 2) {
                setSelectedCinemaGuests(prev => [...prev, npcId]);
            }
        }
    };

    const confirmCinema = () => {
        resolveLeaderPerk('cinema', { guests: selectedCinemaGuests });
        onClose();
    };

    const confirmSpy = () => {
        const result = resolveLeaderPerk('spy');
        setSpyData(result);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-gradient-to-br from-yellow-900 via-gray-900 to-black border-2 border-yellow-500 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative overflow-hidden">
                {/* Decorative Background */}
                <Crown className="absolute -top-10 -right-10 text-yellow-500/10 w-64 h-64 rotate-12" />

                <div className="flex justify-between items-center mb-6 relative">
                    <h2 className="text-3xl font-bold text-yellow-400 flex items-center gap-3">
                        <Crown className="w-8 h-8" />
                        Aposentos do Líder
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="text-gray-400 font-bold" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    {/* --- ACTIONS MENU --- */}
                    <div className="space-y-4">
                        <button
                            onClick={() => setSelectedPerk('cinema')}
                            className="w-full p-4 bg-gray-800/80 hover:bg-yellow-900/40 border border-gray-600 hover:border-yellow-500 rounded-xl flex items-center gap-4 transition-all group"
                        >
                            <div className="p-3 bg-red-900/50 rounded-lg group-hover:bg-red-500/20">
                                <Film className="text-red-400 w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-gray-100">Cinema do Líder</h4>
                                <p className="text-xs text-gray-400">Convide 2 amigos para ver um filme (Afinidade ++)</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setSelectedPerk('spy')}
                            className="w-full p-4 bg-gray-800/80 hover:bg-blue-900/40 border border-gray-600 hover:border-blue-500 rounded-xl flex items-center gap-4 transition-all group"
                        >
                            <div className="p-3 bg-blue-900/50 rounded-lg group-hover:bg-blue-500/20">
                                <Eye className="text-blue-400 w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-gray-100">Espiar Câmeras</h4>
                                <p className="text-xs text-gray-400">Descubra votos ou conversas recentes.</p>
                            </div>
                        </button>

                        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700 opacity-75">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle className="text-orange-500" />
                                <span className="font-bold text-gray-300">Deveres do Líder</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                A indicação ao Paredão acontece automaticamente na noite de Domingo.
                            </p>
                        </div>
                    </div>

                    {/* --- DETAILS PANEL --- */}
                    <div className="bg-black/40 rounded-xl p-4 min-h-[300px] flex flex-col">
                        {!selectedPerk && (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-center">
                                <Crown className="w-12 h-12 mb-2 opacity-20" />
                                <p>Selecione uma ação real ao lado.</p>
                            </div>
                        )}

                        {selectedPerk === 'cinema' && (
                            <div className="animate-fade-in flex flex-col h-full">
                                <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                                    <Film size={20} /> Cinema VIP
                                </h3>
                                <p className="text-sm text-gray-300 mb-4">Escolha 2 participantes para levar:</p>
                                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                    {npcs.filter(n => n.status === 'active').map(npc => (
                                        <button
                                            key={npc.id}
                                            onClick={() => handleInvite(npc.id)}
                                            className={`
                                                w-full p-3 rounded-lg flex justify-between items-center transition-all border
                                                ${selectedCinemaGuests.includes(npc.id)
                                                    ? 'bg-red-900/40 border-red-500 text-white'
                                                    : 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-400'}
                                            `}
                                        >
                                            <span className="font-medium">{npc.name}</span>
                                            {selectedCinemaGuests.includes(npc.id) && <Film size={16} />}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={confirmCinema}
                                    disabled={selectedCinemaGuests.length !== 2}
                                    className="mt-4 w-full py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white shadow-lg transition-colors"
                                >
                                    Confirmar Convidados
                                </button>
                            </div>
                        )}

                        {selectedPerk === 'spy' && !spyData && (
                            <div className="animate-fade-in flex flex-col h-full justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                                        <Eye size={20} /> Central de Monitoramento
                                    </h3>
                                    <p className="text-gray-300">
                                        Você terá acesso a um áudio ou informação aleatória da casa.
                                        Esta ação custa <strong>50 Estalecas</strong> do seu prêmio.
                                    </p>
                                </div>
                                <button
                                    onClick={confirmSpy}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-white shadow-lg transition-colors"
                                >
                                    Ativar Escuta (-50$)
                                </button>
                            </div>
                        )}

                        {selectedPerk === 'spy' && spyData && (
                            <div className="animate-fade-in h-full bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                                <Eye className="text-blue-400 w-12 h-12 mb-4 animate-pulse" />
                                <h4 className="text-lg font-bold text-blue-300 mb-2">Interceptação Sucesso</h4>
                                <p className="text-white italic text-lg">"{spyData.text}"</p>
                                <p className="text-xs text-gray-400 mt-4">- Capturado agora há pouco.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderPanel;
