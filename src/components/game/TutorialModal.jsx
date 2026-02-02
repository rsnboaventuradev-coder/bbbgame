import React from 'react';
import { useGame } from '../../context/GameContext';
import { Info, Battery, Heart, Star, CloudRain } from 'lucide-react';

const TutorialModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">

                <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-6 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Info className="text-blue-300" />
                        Guia de Sobrevivência
                    </h2>
                    <p className="text-blue-200 text-sm mt-1">Bem-vindo à casa mais vigiada! Aqui está o básico.</p>
                </div>

                <div className="p-6 space-y-8">

                    {/* Section 1: Energy & Stress */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                            <div className="flex items-center gap-2 mb-3">
                                <Battery className="text-yellow-400" />
                                <h3 className="text-lg font-bold text-white">Energia Diária</h3>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Você começa o dia com <strong>100% de Energia</strong>. Cada ação consome um pouco.
                                Se sua energia acabar, você será forçado a <strong>Dormir</strong> para passar o dia.
                            </p>
                        </div>

                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                            <div className="flex items-center gap-2 mb-3">
                                <CloudRain className="text-red-400" />
                                <h3 className="text-lg font-bold text-white">Estresse</h3>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Brigas e eventos ruins aumentam seu <strong>Estresse</strong>. Estresse alto tira sua clareza!
                                Dormir ou fazer atividades relaxantes ajuda a reduzir.
                            </p>
                        </div>
                    </div>

                    {/* Section 2: Social & Popularity */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Heart className="text-pink-500" />
                            <h3 className="text-lg font-bold text-white">Social & Popularidade</h3>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            O jogo é sobre relacionamentos! Converse com os outros participantes para aumentar a <strong>Afinidade</strong>.
                            Aliados podem te proteger no Paredão. Inimigos vão votar em você.
                        </p>
                        <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 ml-2">
                            <li><strong className="text-pink-300">Socializar:</strong> Aumenta afinidade e descobre segredos.</li>
                            <li><strong className="text-red-300">Conflito:</strong> Cria inimizades, mas gera entretenimento (público gosta de fogo no parquinho!).</li>
                        </ul>
                    </div>

                    {/* Section 3: The Game Cycle */}
                    <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30">
                        <div className="flex items-center gap-2 mb-3">
                            <Star className="text-yellow-300" />
                            <h3 className="text-lg font-bold text-white">O Jogo (Ciclo Semanal)</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
                            <div className="bg-gray-800 p-3 rounded-lg">
                                <div className="font-bold text-yellow-500 mb-1">👑 Líder</div>
                                <div className="text-gray-400">Ganha imunidade e indica alguém direto ao Paredão.</div>
                            </div>
                            <div className="bg-gray-800 p-3 rounded-lg">
                                <div className="font-bold text-green-500 mb-1">😇 Anjo</div>
                                <div className="text-gray-400">Pode imunizar um aliado (ou a si mesmo, se for autoimune).</div>
                            </div>
                            <div className="bg-gray-800 p-3 rounded-lg">
                                <div className="font-bold text-red-500 mb-1">🧱 Paredão</div>
                                <div className="text-gray-400">Quem tiver menos popularidade com o público é eliminado!</div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="p-6 border-t border-gray-800">
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg transform active:scale-95 transition-all"
                    >
                        Entendi! (Começar Jogo)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TutorialModal;
