import React, { useRef, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Activity, Users, Zap, HeartCrack, MessageSquare } from 'lucide-react';

const HouseFeed = () => {
    const { houseLog } = useGame();
    const endRef = useRef(null);

    // Auto-scroll
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [houseLog]);

    const getIcon = (type) => {
        switch (type) {
            case 'conflict': return <Zap size={14} className="text-red-400" />;
            case 'romance': return <HeartCrack size={14} className="text-pink-400" />;
            case 'alliance': return <Users size={14} className="text-purple-400" />;
            default: return <MessageSquare size={14} className="text-blue-400" />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-950 border-l border-gray-800 w-full md:w-80 shadow-2xl">
            <div className="p-3 border-b border-gray-800 bg-gray-900/90 backdrop-blur flex items-center gap-2 sticky top-0 z-10">
                <Activity size={16} className="text-green-400 animate-pulse" />
                <span className="font-bold text-xs uppercase tracking-widest text-gray-300">Tempo Real: A Casa</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar font-mono text-xs">
                {houseLog.length === 0 && (
                    <div className="text-center text-gray-700 italic mt-10">
                        A casa está silenciosa... por enquanto.
                    </div>
                )}

                {houseLog.map((log) => (
                    <div key={log.id} className="group flex gap-2 items-start p-2 rounded hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-gray-600">
                        <span className="text-gray-600 min-w-[35px]">{log.time}</span>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                {getIcon(log.type)}
                                <span className="font-bold text-gray-300">{log.text}</span>
                            </div>
                            {log.detail && (
                                <p className="text-gray-500 italic pl-5 border-l border-gray-800">
                                    "{log.detail}"
                                </p>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={endRef} />
            </div>
        </div>
    );
};

export default HouseFeed;
