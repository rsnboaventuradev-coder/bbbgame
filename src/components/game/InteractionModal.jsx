import React, { useState } from 'react';
import { MessageCircle, Heart, Zap, Shield, ArrowLeft, X, Trophy, Smile, Frown } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ACTION_COSTS } from '../../utils/constants';

const InteractionModal = () => {
    const { activeDialogue, setActiveDialogue, executeAction, player } = useGame();
    const [category, setCategory] = useState(null); // null = main menu

    if (!activeDialogue) return null;

    const close = () => {
        setActiveDialogue(null);
        setCategory(null);
    };

    const categories = [
        { id: 'social', label: 'Amigável', icon: Smile, color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-500/50', desc: 'Conversar, Elogiar, Piadas' },
        { id: 'hostile', label: 'Hostil', icon: Zap, color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-500/50', desc: 'Discutir, Provocar, Expor' },
        { id: 'romance', label: 'Romântico', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-900/30', border: 'border-pink-500/50', desc: 'Flerte, Xaveco, Beijo' },
        { id: 'strat', label: 'Estratégia', icon: Trophy, color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-500/50', desc: 'Alianças, Mentiras, Votos' }
    ];

    const actions = {
        social: [
            { key: 'social_chat', label: 'Jogar papo fora', desc: 'Afinidade leve, baixo custo', cost: 10 },
            { key: 'social_compliment', label: 'Elogiar', desc: 'Garante aumento de afinidade', cost: 10 },
            { key: 'social_joke', label: 'Contar Piada', desc: 'Alivia estresse de ambos', cost: 10 }
        ],
        hostile: [
            { key: 'hostile_argue', label: 'Discutir Relação', desc: 'Cria rivalidade moderada', cost: 15 },
            { key: 'hostile_insult', label: 'Ofender', desc: 'Dano massivo na afinidade', cost: 15 },
            { key: 'hostile_expose', label: 'Expor Jogo', desc: 'Gera drama na casa', cost: 15 }
        ],
        romance: [
            { key: 'romance_flirt', label: 'Flerter', desc: 'Sondar interesse', cost: 10 },
            { key: 'romance_pickup', label: 'Mandar Xaveco', desc: 'Mais direto', cost: 10 },
            { key: 'romance_kiss', label: 'Beijar', desc: 'Requer alta afinidade', cost: 15 }
        ],
        strat: [
            { key: 'strat_probe', label: 'Sondar Voto', desc: 'Descobre intenção de voto', cost: 15 },
            { key: 'strat_alliance', label: 'Propor Aliança', desc: 'Tenta firmar parceria', cost: 15 },
            { key: 'strat_lie', label: 'Mentir', desc: 'Manipula a percepção', cost: 15 }
        ]
    };

    const handleAction = (key) => {
        executeAction(key, activeDialogue.id);
        // Modal closes automatically inside executeAction if successful? 
        // No, current implementation of executeAction sets ActiveDialogue(null) on success.
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-gray-800/80 p-4 border-b border-gray-700 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        {category ? (
                            <button onClick={() => setCategory(null)} className="p-1 hover:bg-gray-700 rounded-full transition-colors">
                                <ArrowLeft size={20} className="text-gray-300" />
                            </button>
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white border-2 border-indigo-400">
                                {activeDialogue.name[0]}
                            </div>
                        )}
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">{activeDialogue.name}</h2>
                            <p className="text-xs text-indigo-300">{activeDialogue.job}</p>
                        </div>
                    </div>
                    <button onClick={close} className="p-1 hover:bg-red-500/20 rounded-full group transition-colors">
                        <X size={24} className="text-gray-500 group-hover:text-red-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 overflow-y-auto custom-scrollbar flex-1">

                    {/* Afinidade Bar */}
                    <div className="mb-6 px-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1 uppercase font-bold tracking-wider">
                            <span>Afinidade</span>
                            <span>{Math.round(activeDialogue.affinity || 50)}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${(activeDialogue.affinity || 50) > 60 ? 'bg-green-500' :
                                        (activeDialogue.affinity || 50) < 30 ? 'bg-red-500' : 'bg-yellow-500'
                                    }`}
                                style={{ width: `${activeDialogue.affinity || 50}%` }}
                            />
                        </div>
                    </div>

                    {!category ? (
                        <div className="grid grid-cols-2 gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategory(cat.id)}
                                    className={`
                                        flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
                                        ${cat.bg} ${cat.border} hover:scale-[1.02] active:scale-95
                                        group h-32
                                    `}
                                >
                                    <div className={`p-3 rounded-full bg-black/20 mb-2 group-hover:bg-black/40 transition-colors ${cat.color}`}>
                                        <cat.icon size={28} />
                                    </div>
                                    <span className={`font-bold uppercase tracking-wider text-sm ${cat.color}`}>
                                        {cat.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2 animate-slideInRight">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 pl-1">
                                Interações — {categories.find(c => c.id === category)?.label}
                            </h3>
                            {actions[category].map(act => (
                                <button
                                    key={act.key}
                                    onClick={() => handleAction(act.key)}
                                    disabled={player.energy < act.cost}
                                    className={`
                                        w-full p-3 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-700/80 
                                        transition-all text-left flex items-center justify-between group
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                    `}
                                >
                                    <div>
                                        <span className="block font-bold text-gray-200 group-hover:text-white transition-colors">
                                            {act.label}
                                        </span>
                                        <span className="text-xs text-gray-500 group-hover:text-gray-400">
                                            {act.desc}
                                        </span>
                                    </div>
                                    <div className="text-xs font-mono text-yellow-500/80 bg-black/30 px-2 py-1 rounded border border-yellow-900/30">
                                        -{act.cost} E
                                    </div>
                                </button>
                            ))}

                            {actions[category].length === 0 && (
                                <p className="text-center text-gray-500 text-sm py-4">Nenhuma ação disponível.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InteractionModal;
