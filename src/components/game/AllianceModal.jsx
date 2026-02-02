import React, { useState } from 'react';
import { Users, Target, Shield, AlertTriangle, Crown, UserPlus, Heart, Handshake } from 'lucide-react';
import { useGame } from '../../context/GameContext';

const AllianceModal = ({ onClose }) => {
    const { npcs, player, inviteToAlliance, callAllianceMeeting, allianceTarget } = useGame();
    const [selectedTarget, setSelectedTarget] = useState(null);

    const allianceMembers = npcs.filter(n => (player.alliance || []).includes(n.id));
    const potentialMembers = npcs.filter(n => n.status === 'active' && !(player.alliance || []).includes(n.id) && n.affinity >= 70);

    const handleInvite = (id) => {
        inviteToAlliance(id);
    };

    const handleSuggest = () => {
        if (selectedTarget) {
            callAllianceMeeting(selectedTarget);
        }
    };

    const validTargets = npcs.filter(n => n.status === 'active' && !(player.alliance || []).includes(n.id) && n.id !== player.id);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-purple-500/50 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-purple-900 to-gray-900 border-b border-purple-500/30 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Crown className="text-yellow-400" /> Sua Aliança
                        </h2>
                        <p className="text-purple-300 text-sm">Defina estratégias e combine votos.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-2">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Members List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                <Users size={18} /> Membros ({allianceMembers.length})
                            </h3>
                            {allianceMembers.length > 0 ? (
                                <div className="space-y-2">
                                    {allianceMembers.map(member => (
                                        <div key={member.id} className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold text-xs">{member.name[0]}</div>
                                                <div>
                                                    <span className="block text-sm font-bold text-white">{member.name}</span>
                                                    <span className="text-xs text-gray-400">Lealdade: {member.loyalty || '?'}%</span>
                                                </div>
                                            </div>
                                            <Heart size={14} className="text-red-500" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm italic">Você joga sozinho por enquanto.</p>
                            )}
                        </div>

                        {/* Invite Panel */}
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                <UserPlus size={18} /> Recrutamento (Afinidade {'>'} 70)
                            </h3>
                            {potentialMembers.length > 0 ? (
                                <div className="space-y-2">
                                    {potentialMembers.map(npc => (
                                        <div key={npc.id} className="flex items-center justify-between p-2 bg-gray-800 rounded border border-gray-700">
                                            <span className="text-sm text-gray-300">{npc.name}</span>
                                            <button
                                                onClick={() => handleInvite(npc.id)}
                                                className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded font-bold transition-colors"
                                            >
                                                Convidar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm italic">Ninguém próximo o suficiente.</p>
                            )}
                        </div>
                    </div>

                    {/* Strategy Section */}
                    <div className="bg-purple-900/20 p-5 rounded-xl border border-purple-500/30">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Target className="text-red-400" /> Reunião de Condomínio
                        </h3>

                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <label className="block text-xs uppercase text-gray-400 font-bold mb-1">Alvo do Voto</label>
                                <select
                                    className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-purple-500"
                                    onChange={(e) => setSelectedTarget(parseInt(e.target.value))}
                                >
                                    <option value="">Selecione um alvo...</option>
                                    {validTargets.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} (Pop: {t.publicPop})</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleSuggest}
                                disabled={!selectedTarget}
                                className="w-full md:w-auto bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2"
                            >
                                <Handshake size={18} /> Combinar Votos
                            </button>
                        </div>

                        {allianceTarget && (
                            <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded flex items-center gap-3">
                                <AlertTriangle className="text-red-500" />
                                <span className="text-red-200 text-sm">
                                    Alvo atual da Aliança: <strong className="text-white">{npcs.find(n => n.id === allianceTarget)?.name}</strong>
                                </span>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AllianceModal;
