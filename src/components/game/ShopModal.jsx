import React, { useState } from 'react';
import { ShoppingCart, Skull, Check, X, Shield, Lock, Eye } from 'lucide-react';
import { useGame } from '../../context/GameContext';

const ShopModal = ({ onClose }) => {
    const { player, buyItem, npcs, setNpcs } = useGame();
    const [activeTab, setActiveTab] = useState('market'); // 'market', 'black_market'

    const handleBuy = (item) => {
        const success = buyItem(item.cost, item.effect);
        if (success) {
            // Optional: Close modal or just show feedback (already handled by addLog in buyItem)
        }
    };

    const marketItems = [
        {
            id: 'food',
            name: 'Marmita da Xepa',
            cost: 50,
            desc: 'Reduz a Fome em 30',
            icon: '🍲',
            effect: (p, setP, n, setN, log) => {
                setP(prev => ({ ...prev, hunger: Math.max(0, prev.hunger - 30) }));
                log("Você comeu uma marmita. A fome diminuiu.", "success");
            }
        },
        {
            id: 'soap',
            name: 'Kit Higiene',
            cost: 30,
            desc: 'Aumenta Higiene em 50',
            icon: '🧼',
            effect: (p, setP, n, setN, log) => {
                setP(prev => ({ ...prev, hygiene: Math.min(100, prev.hygiene + 50) }));
                log("Banho tomado! Você está cheiroso.", "success");
            }
        },
        {
            id: 'coffee',
            name: 'Cafézinho',
            cost: 20,
            desc: '+10 Energia',
            icon: '☕',
            effect: (p, setP, n, setN, log) => {
                setP(prev => ({ ...prev, energy: Math.min(100, prev.energy + 10) }));
                log("Cafézinho renovador!", "success");
            }
        }
    ];

    const blackMarketItems = [
        {
            id: 'spy',
            name: 'Espião',
            cost: 300,
            desc: 'Descubra a afinidade de um participante com você.',
            icon: <Eye size={20} />,
            effect: (p, setP, n, setN, log) => {
                const target = n.find(x => x.status === 'active' && x.id !== p.id); // Just a random active for now to demo, or simplified logic implies "next interaction reveals"
                // For simplicity, let's reveal ALL traits or jobs of a random person
                const unknown = n.filter(x => x.status === 'active' && (!x.knownJob || !x.knownTrait));
                if (unknown.length > 0) {
                    const revealed = unknown[Math.floor(Math.random() * unknown.length)];
                    setN(prev => prev.map(npc => npc.id === revealed.id ? { ...npc, knownJob: true, knownTrait: true } : npc));
                    log(`Espião revelou os segredos de ${revealed.name}!`, "system");
                } else {
                    log("O espião não encontrou novos segredos.", "info");
                }
            }
        },
        {
            id: 'vote_buying',
            name: 'Compra de Votos',
            cost: 500,
            desc: 'Adiciona 1 voto extra contra um rival aleatório no próximo Paredão.',
            icon: <Skull size={20} />,
            effect: (p, setP, n, setN, log) => {
                // Determine a rival (lowest affinity)
                const rivals = [...n].sort((a, b) => a.affinity - b.affinity);
                const target = rivals[0];
                log(`Você comprou votos contra ${target.name}!`, "system");
                // Simplified: Just log it, logic would need deeper hook into Vote system "externalVotes"
            }
        },
        {
            id: 'secret_immunity',
            name: 'Imunidade Secreta',
            cost: 1000,
            desc: 'Imunidade garantida nesta semana (apenas você sabe).',
            icon: <Shield size={20} />,
            effect: (p, setP, n, setN, log) => {
                // Need to set immune
                // We need to use setImmunes from context, but buyItem signature only exposes basic setters.
                // We can hack it if logic allows, or we pass setImmunes to buyItem?
                // For now, let's assume we can't easily access setImmunes here without changing signature.
                // Let's change buyItem signature in next step or use setPlayer to flag "secretImmunity"
                setP(prev => ({ ...prev, secretImmunity: true })); // Logic needs to handle this flag in submitVote
                log("Você comprou uma Imunidade Secreta!", "success");
            }
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 p-4">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="p-6 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <ShoppingCart className="text-yellow-500" /> Loja da Casa
                        </h2>
                        <p className="text-gray-400 text-sm">Estalecas Disponíveis: <span className="text-green-400 font-bold">C$ {player.estalecas}</span></p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-950">
                    <button
                        onClick={() => setActiveTab('market')}
                        className={`flex-1 py-4 text-center font-bold uppercase tracking-wider transition-colors ${activeTab === 'market' ? 'bg-gray-800 text-white border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <ShoppingMarketIcon size={16} className="inline mr-2" /> Mercado
                    </button>
                    <button
                        onClick={() => setActiveTab('black_market')}
                        className={`flex-1 py-4 text-center font-bold uppercase tracking-wider transition-colors ${activeTab === 'black_market' ? 'bg-gray-900 text-red-500 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-400'}`}
                    >
                        <Lock size={16} className="inline mr-2" /> Mercado Negro
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-gray-900">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(activeTab === 'market' ? marketItems : blackMarketItems).map(item => (
                            <div key={item.id} className={`p-4 rounded-xl border ${activeTab === 'market' ? 'bg-gray-800 border-gray-700' : 'bg-red-950/20 border-red-900/50'} flex items-center gap-4 hover:scale-[1.02] transition-transform`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${activeTab === 'market' ? 'bg-gray-700' : 'bg-red-900/30 text-red-500'}`}>
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white">{item.name}</h3>
                                    <p className="text-xs text-gray-400">{item.desc}</p>
                                </div>
                                <button
                                    onClick={() => handleBuy(item)}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm ${player.estalecas >= item.cost ? (activeTab === 'market' ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-red-600 text-white hover:bg-red-500') : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                                >
                                    C$ {item.cost}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Icon
const ShoppingMarketIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
        <path d="M2 7h20" />
        <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
)

export default ShopModal;
