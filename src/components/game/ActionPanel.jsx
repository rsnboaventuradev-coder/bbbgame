import React from 'react';
import { useGame } from '../../context/GameContext';
import { Home, Dumbbell, BookOpen, MessageCircle, Zap, Heart, Ear, Moon, Megaphone, Wine } from 'lucide-react';
import { ACTION_COSTS, MAX_DAILY_ACTIONS, TIMES_OF_DAY } from '../../utils/constants';

const ActionPanel = () => {
    const { player, selectedTarget, executeAction, nextDay, npcs, actionsLeft, isPartyMode, drinkAlcohol } = useGame();

    const currentPeriodIndex = Math.max(0, MAX_DAILY_ACTIONS - actionsLeft);
    const currentPeriod = TIMES_OF_DAY[currentPeriodIndex] || 'Madrugada';

    const ActionButton = ({ action, icon: Icon, label, color, cost, reqTarget = false, minAffinity = 0 }) => {
        const target = selectedTarget ? npcs.find(n => n.id === selectedTarget) : null;
        const disabled =
            actionsLeft <= 0 ||
            player.energy < cost ||
            (reqTarget && !selectedTarget) ||
            (minAffinity > 0 && target && target.affinity < minAffinity);

        return (
            <button
                onClick={() => executeAction(action)}
                disabled={disabled}
                className={`
                    relative group flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 shadow-lg overflow-hidden
                    ${disabled
                        ? 'bg-gray-800/50 border-gray-800 text-gray-600 cursor-not-allowed grayscale'
                        : `bg-gray-800 border-gray-700 hover:border-${color}-500 hover:bg-${color}-900/20 active:scale-95 text-gray-200 hover:text-white`
                    }
                `}
            >
                <div className={`
                    p-2 rounded-full mb-1 transition-colors
                    ${!disabled ? `bg-${color}-500/10 group-hover:bg-${color}-500 text-${color}-400 group-hover:text-white` : ''}
                `}>
                    <Icon size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
                <span className="text-[10px] text-gray-500 group-hover:text-gray-300">-{cost}% Energy</span>
            </button>
        );
    };

    return (
        <div className="mt-auto">
            {/* Time Status */}
            <div className="flex items-center justify-between mb-2 px-1">
                <div className="text-xs font-mono text-gray-400">
                    Período: <span className="text-yellow-400 font-bold uppercase">{currentPeriod}</span>
                </div>
                <div className="text-xs font-mono text-gray-500">
                    Ações: {actionsLeft}/{MAX_DAILY_ACTIONS}
                </div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                <ActionButton action="housework" icon={Home} label="Cuidar da Casa" color="emerald" cost={ACTION_COSTS.HOUSEWORK} />
                <ActionButton action="gym" icon={Dumbbell} label="Treinar" color="orange" cost={ACTION_COSTS.GYM} />
                <ActionButton action="read" icon={BookOpen} label="Ler/Estratégia" color="teal" cost={ACTION_COSTS.READ} />
                <ActionButton action="socialize" icon={MessageCircle} label="Social" color="blue" cost={ACTION_COSTS.SOCIALIZE} reqTarget={true} />
                <ActionButton action="conflict" icon={Zap} label="Treta" color="red" cost={ACTION_COSTS.CONFLICT} reqTarget={true} />
                <ActionButton action="romance" icon={Heart} label="Romance" color="pink" cost={ACTION_COSTS.ROMANCE} reqTarget={true} minAffinity={75} />
                <ActionButton action="eavesdrop" icon={Ear} label="Espionar" color="purple" cost={ACTION_COSTS.EAVESDROP} />
                <ActionButton action="spreadRumor" icon={Megaphone} label="Fofocar" color="yellow" cost={ACTION_COSTS.SPREAD_RUMOR} reqTarget={true} />

                {/* [NEW] Party Action */}
                {isPartyMode && (
                    <button
                        onClick={drinkAlcohol}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-pink-500 bg-pink-900/50 hover:bg-pink-800 text-pink-100 transition-all active:scale-95 shadow-lg shadow-pink-900/20 col-span-1 animate-pulse"
                    >
                        <div className="p-2 rounded-full mb-1 bg-pink-500 text-white">
                            <Wine size={20} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wide">Beber</span>
                        <span className="text-[10px] text-pink-300">+Intoxication</span>
                    </button>
                )}

                {/* Sleep / Next Day */}
                <button
                    onClick={nextDay}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-indigo-600 bg-indigo-900/50 hover:bg-indigo-800 text-indigo-100 transition-all active:scale-95 shadow-lg shadow-indigo-900/20 col-span-1"
                >
                    <div className="p-2 rounded-full mb-1 bg-indigo-500 text-white">
                        <Moon size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wide">Dormir</span>
                    <span className="text-[10px] text-indigo-300">Próximo Dia</span>
                </button>
            </div>

            {/* Hint */}
            {!selectedTarget && (
                <div className="text-center text-xs text-yellow-500/80 animate-pulse font-mono bg-yellow-900/10 py-1 rounded border border-yellow-500/20">
                    ⚠ Selecione um participante para interações sociais
                </div>
            )}
        </div>
    );
};

export default ActionPanel;
