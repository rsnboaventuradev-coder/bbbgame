import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Heart, Battery, Activity, Sparkles, Shield, Crown, Brain, Trophy, Smile, ShoppingCart, Droplets, Utensils, Handshake } from 'lucide-react';
import ShopModal from '../game/ShopModal';
import AllianceModal from '../game/AllianceModal';

const Sidebar = () => {
    const { player, houseCleanliness } = useGame();
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [isAllianceOpen, setIsAllianceOpen] = useState(false);

    const StatBar = ({ icon: Icon, label, value, colorClass, max = 100 }) => (
        <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1 text-gray-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1"><Icon size={12} /> {label}</span>
                <span>{value}/{max}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <div
                    className={`h-full transition-all duration-500 ${colorClass}`}
                    style={{ width: `${(value / max) * 100}%` }}
                />
            </div>
        </div>
    );

    return (
        <>
            <div className="w-full md:w-72 bg-gray-900 p-6 border-r border-gray-800 flex flex-col gap-6 shadow-2xl z-10 overflow-y-auto">
                {/* Player Header */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold shadow-lg ring-2 ring-purple-500/30">
                        {player.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white leading-tight">{player.name}</h2>
                        <p className="text-xs text-purple-400 font-medium uppercase tracking-wide">{player.job}</p>
                        <div className="flex items-center gap-1 mt-1 text-green-400 font-bold text-sm">
                            <span className="text-xs text-gray-500">C$</span> {player.estalecas || 0}
                        </div>
                    </div>
                </div>

                {/* Core Stats */}
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                    <StatBar
                        icon={Heart}
                        label="Popularidade"
                        value={Math.round(player.popularity)}
                        colorClass={player.popularity < 40 ? 'text-red-500' : 'text-green-500'}
                    />
                    <StatBar
                        icon={Battery}
                        label="Energia"
                        value={player.energy}
                        colorClass="text-yellow-400"
                    />
                    <StatBar
                        icon={Activity}
                        label="Estresse"
                        value={player.stress}
                        colorClass={player.stress > 70 ? 'text-red-500' : 'text-blue-400'}
                    />
                    <StatBar
                        icon={Utensils}
                        label="Fome"
                        value={player.hunger || 0}
                        colorClass={player.hunger > 80 ? 'text-red-600 animate-pulse' : 'text-orange-400'}
                    />
                    <StatBar
                        icon={Droplets}
                        label="Higiene"
                        value={player.hygiene || 0}
                        colorClass={player.hygiene < 30 ? 'text-red-500' : 'text-cyan-400'}
                    />
                </div>

                {/* Status Extra */}
                {player.romanceId && (
                    <div className="bg-pink-900/20 border border-pink-500/30 p-3 rounded-lg flex items-center gap-3 animate-pulse">
                        <Heart className="text-pink-500" size={18} fill="currentColor" />
                        <div>
                            <span className="block text-pink-200 text-xs font-bold">Romance no Ar</span>
                            <span className="text-[10px] text-pink-400">O público está amando!</span>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setIsShopOpen(true)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    <ShoppingCart size={18} /> Acessar Loja
                </button>
            </div>

            {isShopOpen && <ShopModal onClose={() => setIsShopOpen(false)} />}
        </>
    );
};

export default Sidebar;
