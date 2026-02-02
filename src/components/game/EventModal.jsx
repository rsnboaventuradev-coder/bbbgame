import React from 'react';
import { AlertTriangle, Heart, User, Shield, Phone } from 'lucide-react';

const EventModal = ({ event, onResolve }) => {
    if (!event) return null;

    const getIcon = () => {
        if (event.id.includes('big_phone')) return <Phone className="text-black w-12 h-12 animate-pulse" />;
        if (event.id.includes('gossip') || event.id.includes('food')) return <AlertTriangle className="text-yellow-500 w-12 h-12" />;
        if (event.id.includes('crush')) return <Heart className="text-pink-500 w-12 h-12" />;
        if (event.id.includes('alliance')) return <Shield className="text-blue-500 w-12 h-12" />;
        return <User className="text-purple-500 w-12 h-12" />;
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
            <div className="bg-white text-gray-900 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl transform scale-100 transition-all">
                {/* Header Image/Icon Area */}
                <div className="bg-gray-100 p-6 flex justify-center border-b border-gray-200">
                    <div className="p-4 bg-white rounded-full shadow-md">
                        {getIcon()}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-purple-900">
                        Evento Surpresa!
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed mb-8">
                        {event.text}
                    </p>

                    {/* Choices */}
                    <div className="space-y-3">
                        {event.choices.map((choice, index) => (
                            <button
                                key={index}
                                onClick={() => onResolve(choice)}
                                className={`
                                    w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-md flex items-center justify-between group
                                    ${choice.sentiment === 'drama' ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
                                    ${choice.sentiment === 'positive' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
                                    ${choice.sentiment === 'negative' ? 'bg-gray-800 hover:bg-gray-900 text-white' : ''}
                                    ${choice.sentiment === 'neutral' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
                                `}
                            >
                                <span>{choice.text}</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    ➜
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
