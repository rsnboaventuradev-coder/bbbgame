import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { JOBS, STATES, TRAITS } from '../../utils/constants';
import { Trophy, Clock, DollarSign, X } from 'lucide-react';

const MainMenu = () => {
    const { startGame, checkSave, getHallOfFame, clearSave } = useGame();
    const [view, setView] = useState('menu'); // 'menu', 'create', 'hall'
    const [hasSave, setHasSave] = useState(false);
    const [hallOfFameData, setHallOfFameData] = useState([]);

    React.useEffect(() => {
        setHasSave(checkSave());
    }, [checkSave]);

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        job: '', // Stores the full job object or ID
        state: '', // Stores the full state object or ID
        trait: '' // Stores the full trait object or ID
    });

    const handleNewGame = () => {
        if (hasSave && !confirm("Iniciar um novo jogo apagará o progresso atual. Tem certeza?")) return;
        clearSave();
        setView('create');
    };

    const handleOpenHall = () => {
        setHallOfFameData(getHallOfFame());
        setView('hall');
    };

    const handleContinue = () => {
        startGame({ load: true });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Find full objects based on IDs/Values if necessary, or just pass directly if values are IDs.
        // Here we assumed values are IDs in the select, so let's find the objects.
        const selectedJob = JOBS.find(j => j.id === formData.job);
        const selectedState = STATES.find(s => s.code === formData.state);
        const selectedTrait = TRAITS.find(t => t.id === formData.trait);

        if (!formData.name || !selectedJob || !selectedState || !selectedTrait) {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        startGame({
            name: formData.name,
            age: formData.age,
            job: selectedJob,
            state: selectedState,
            trait: selectedTrait,
            load: false
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (view === 'menu') {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 font-sans">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
                </div>

                <div className="relative z-10 bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-md text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                        BBB SIMULATOR
                    </h1>
                    <p className="text-gray-400 text-sm mb-8">Just for fun</p>

                    <div className="space-y-4">
                        {hasSave && (
                            <button
                                onClick={handleContinue}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all text-lg"
                            >
                                Continuar Jogo
                            </button>
                        )}

                        <button
                            onClick={handleNewGame}
                            className={`w-full bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-black font-bold py-4 rounded-xl shadow-lg transform active:scale-95 transition-all text-lg ${!hasSave ? 'animate-pulse' : ''}`}
                        >
                            Novo Jogo
                        </button>

                        <button
                            onClick={handleOpenHall}
                            className="w-full bg-gray-800 border border-gray-700 hover:bg-gray-700 text-yellow-500 font-bold py-3 rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Trophy size={20} /> Hall da Fama
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'hall') {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 font-sans relative">
                <div className="absolute inset-0 bg-yellow-900/10 pointer-events-none"></div>

                <div className="relative z-10 bg-gray-900 border-2 border-yellow-600/50 p-6 rounded-2xl shadow-2xl max-w-lg w-full backdrop-blur-md">
                    <button
                        onClick={() => setView('menu')}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>

                    <div className="text-center mb-6">
                        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-2 animate-bounce" />
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
                            HALL DA FAMA
                        </h1>
                        <p className="text-yellow-500/60 text-sm">Lendas do Reality</p>
                    </div>

                    <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                        {hallOfFameData.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">
                                Nenhuma lenda registrada ainda. Seja o primeiro!
                            </div>
                        ) : (
                            hallOfFameData.map((record, idx) => (
                                <div key={record.id} className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 flex justify-between items-center group hover:border-yellow-500/50 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl font-bold text-gray-600 group-hover:text-yellow-500 transition-colors">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-lg">{record.name}</div>
                                            <div className="text-xs text-gray-400">{record.job}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-1 text-green-400 font-bold">
                                            <DollarSign size={14} /> {record.money}
                                        </div>
                                        <div className="flex items-center justify-end gap-1 text-gray-500 text-xs">
                                            <Clock size={12} /> {record.days} dias • {record.date}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        onClick={() => setView('menu')}
                        className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="relative z-10 bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-md">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-center mb-2">
                    BBB SIMULATOR
                </h1>
                <p className="text-center text-gray-400 text-sm mb-8">Just for fun</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Digite seu nome"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        />
                    </div>

                    {/* Age */}
                    <div>
                        <input
                            type="number"
                            name="age"
                            placeholder="Idade"
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        />
                    </div>

                    {/* Job */}
                    <div className="relative">
                        <select
                            name="job"
                            value={formData.job}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white appearance-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
                        >
                            <option value="" disabled>Selecione sua profissão</option>
                            {JOBS.map(job => (
                                <option key={job.id} value={job.id}>{job.name}</option>
                            ))}
                        </select>
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
                    </div>

                    {/* State */}
                    <div className="relative">
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white appearance-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
                        >
                            <option value="" disabled>Selecione seu estado</option>
                            {STATES.map(state => (
                                <option key={state.code} value={state.code}>{state.name}</option>
                            ))}
                        </select>
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
                    </div>

                    {/* Trait */}
                    <div className="relative">
                        <select
                            name="trait"
                            value={formData.trait}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white appearance-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
                        >
                            <option value="" disabled>Selecione uma característica</option>
                            {TRAITS.map(trait => (
                                <option key={trait.id} value={trait.id}>{trait.name}</option>
                            ))}
                        </select>
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
                    </div>

                    {/* Info Box (Dynamic) */}
                    {(formData.job || formData.trait) && (
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-sm space-y-2 animate-fade-in">
                            {formData.job && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Bônus de Profissão:</span>
                                    <span className="text-purple-300">
                                        {JOBS.find(j => j.id === formData.job)?.desc}
                                    </span>
                                </div>
                            )}
                            {formData.trait && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Característica:</span>
                                    <span className="text-pink-300">
                                        {TRAITS.find(t => t.id === formData.trait)?.desc}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-black font-bold py-3 rounded-lg shadow-lg transform active:scale-95 transition-all mt-4"
                    >
                        Entrar na Casa
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MainMenu;
