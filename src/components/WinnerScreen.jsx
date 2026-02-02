import React, { useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Star, Users, Skull, Target, Coins, RefreshCw } from 'lucide-react';

const WinnerScreen = () => {
    const { player, npcs, resetGame, day } = useGame();

    const stats = useMemo(() => {
        // Calculate Relationships
        const sortedNpcs = [...npcs].sort((a, b) => b.relationship - a.relationship);
        const bestFriend = sortedNpcs.find(n => n.relationship > 0) || { name: 'Ninguém (Forever Alone)' };
        const enemy = [...npcs].sort((a, b) => a.relationship - b.relationship)[0] || { name: 'Ninguém' };

        // Final Score Calculation
        // Money: 1 point per C$ 10
        // Paredões: 100 points each
        // Weeks Survived: 50 points each
        // Relationships: + points for friends

        const moneyScore = Math.floor(player.totalMoneyEarned / 10);
        const paredaoScore = player.paredoesCount * 100;
        const weeksScore = Math.floor(day / 7) * 50;
        const socialScore = npcs.reduce((acc, n) => acc + (n.relationship > 0 ? n.relationship : 0), 0);

        const totalScore = moneyScore + paredaoScore + weeksScore + socialScore;

        return {
            bestFriend,
            enemy,
            moneyScore,
            paredaoScore,
            weeksScore,
            socialScore,
            totalScore
        };
    }, [player, npcs, day]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-800 flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 max-w-2xl w-full text-gray-800 border-4 border-yellow-400">
                <div className="text-center mb-8">
                    <div className="inline-block p-4 rounded-full bg-yellow-100 mb-4 animate-bounce">
                        <Trophy size={64} className="text-yellow-600" />
                    </div>
                    <h1 className="text-5xl font-bold text-yellow-800 mb-2">GRANDE CAMPEÃO!</h1>
                    <p className="text-xl text-gray-600">Você sobreviveu a todos os desafios e conquistou o público!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Main Stats Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-inner">
                        <h3 className="text-lg font-bold text-blue-800 mb-4 border-b border-blue-200 pb-2 flex items-center">
                            <Star className="mr-2" size={20} /> Retrospectiva
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex justify-between items-center text-sm">
                                <span className="flex items-center text-gray-700"><Target className="mr-2" size={16} /> Paredões Enfrentados:</span>
                                <span className="font-bold text-lg">{player.paredoesCount}</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                                <span className="flex items-center text-gray-700"><Coins className="mr-2" size={16} /> Estalecas Totais:</span>
                                <span className="font-bold text-lg text-green-600">C$ {player.totalMoneyEarned}</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                                <span className="flex items-center text-gray-700"><Users className="mr-2" size={16} /> Melhor Aliado:</span>
                                <span className="font-bold text-blue-600 truncate max-w-[120px]">{stats.bestFriend.name}</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                                <span className="flex items-center text-gray-700"><Skull className="mr-2" size={16} /> Maior Rival:</span>
                                <span className="font-bold text-red-600 truncate max-w-[120px]">{stats.enemy.name}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Score Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-inner flex flex-col justify-center">
                        <h3 className="text-lg font-bold text-purple-800 mb-4 border-b border-purple-200 pb-2 text-center">
                            Pontuação Final
                        </h3>
                        <div className="text-center">
                            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 drop-shadow-sm">
                                {stats.totalScore}
                            </span>
                            <p className="text-xs text-purple-600 mt-2 uppercase tracking-widest font-semibold">Pontos de Lenda</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={resetGame}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center text-lg"
                >
                    <RefreshCw className="mr-2 animate-spin-slow" size={24} /> Jogar Novamente
                </button>
            </div>
        </div>
    );
};

export default WinnerScreen;
