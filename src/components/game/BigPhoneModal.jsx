import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Phone, AlertTriangle, XCircle, CheckCircle, Skull } from 'lucide-react';

const BigPhoneModal = () => {
    const { bigFone, resolveBigFone, npcs } = useGame();
    const [step, setStep] = useState('ringing'); // ringing, outcome, selection
    const [outcomeText, setOutcomeText] = useState('');
    const [outcomeType, setOutcomeType] = useState(null); // 'immunity', 'wall', 'power'

    if (!bigFone.active) return null;

    const handleAnswer = () => {
        // Determine outcome immediately upon answering
        const outcomes = ['immunity', 'wall', 'pawn']; // pawn implies nominating someone
        const result = outcomes[Math.floor(Math.random() * outcomes.length)];

        let text = "";
        if (result === 'immunity') {
            text = "VOCÊ ESTÁ IMUNE! Nesta semana ninguém toca em você.";
            setOutcomeType('immunity');
            resolveBigFone('immunity'); // Apply effect immediately or after confirm? User asked for confirmation modal.
            // Actually user said: "Exiba o resultado em um novo modal de confirmação antes de fechar"
            // So we just set state here and call resolve on close?
            // "Me dê o efeito" -> resolveBigFone handles logic.
        } else if (result === 'wall') {
            text = "VOCÊ ESTÁ NO PAREDÃO! A casa caiu.";
            setOutcomeType('wall');
            resolveBigFone('wall');
        } else if (result === 'pawn') {
            text = "VOCÊ GANHOU O PODER SUPREMO! Indique alguém ao Paredão AGORA.";
            setOutcomeType('power');
            setStep('selection');
            return;
        }

        setOutcomeText(text);
        setStep('outcome');
    };

    const handleIgnore = () => {
        resolveBigFone('ignore');
    };

    const handleSelectTimed = (targetId) => {
        resolveBigFone('nominate', targetId);
        setOutcomeText(`Você indicou ${npcs.find(n => n.id === targetId)?.name} ao Paredão!`);
        setStep('outcome');
    };

    const handleClose = () => {
        resolveBigFone('close'); // Just to close modal state
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fadeIn">
            <div className="absolute inset-0 border-[20px] border-red-600 animate-pulse pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl w-full p-8 text-center text-white">

                {step === 'ringing' && (
                    <div className="space-y-12">
                        <div className="flex justify-center">
                            <Phone size={120} className="text-white animate-vibrate" />
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]">
                            ATENÇÃO!
                        </h1>
                        <p className="text-2xl font-bold uppercase tracking-widest text-red-500 animate-pulse">
                            Preste muita atenção!
                        </p>

                        <div className="flex flex-col gap-6 items-center pt-8">
                            <button
                                onClick={handleAnswer}
                                className="w-full max-w-md bg-green-600 hover:bg-green-500 text-white text-3xl font-black py-8 rounded-2xl shadow-[0_0_50px_rgba(0,255,0,0.4)] animate-pulse hover:scale-105 transition-transform uppercase"
                            >
                                ATENDER
                            </button>

                            <button
                                onClick={handleIgnore}
                                className="text-gray-500 text-sm hover:text-gray-300 underline uppercase tracking-widest"
                            >
                                Deixar Tocar (Ignorar)
                            </button>
                        </div>
                    </div>
                )}

                {step === 'selection' && (
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold text-yellow-400">INDIQUE ALGUÉM AGORA!</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh] p-4">
                            {npcs.filter(n => n.status === 'active').map(npc => (
                                <button
                                    key={npc.id}
                                    onClick={() => handleSelectTimed(npc.id)}
                                    className="p-4 bg-gray-800 border-2 border-gray-700 hover:border-red-500 rounded-xl flex flex-col items-center gap-2 transition-all hover:bg-gray-700"
                                >
                                    <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-2xl font-bold">
                                        {npc.name.charAt(0)}
                                    </div>
                                    <span className="font-bold">{npc.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'outcome' && (
                    <div className="space-y-8 animate-zoomIn">
                        <div className="flex justify-center text-6xl">
                            {outcomeType === 'immunity' && <CheckCircle className="text-green-500" />}
                            {outcomeType === 'wall' && <Skull className="text-red-500" />}
                            {outcomeType === 'power' && <AlertTriangle className="text-yellow-500" />}
                        </div>

                        <h2 className="text-4xl font-black uppercase leading-tight">
                            {outcomeText}
                        </h2>

                        <button
                            onClick={handleClose}
                            className="bg-white text-black font-bold px-12 py-4 rounded-full hover:bg-gray-200 transition-colors uppercase tracking-widest text-xl"
                        >
                            Entendido
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default BigPhoneModal;
