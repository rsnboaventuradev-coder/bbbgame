import React from 'react';
import { useGame } from '../../context/GameContext';
import { MessageCircle } from 'lucide-react';

const Feed = () => {
    const { feed } = useGame();

    return (
        <div className="w-full md:w-72 bg-gray-900 border-l border-gray-800 flex flex-col h-full hidden md:flex shadow-2xl z-10">
            <div className="p-4 border-b border-gray-800 font-bold text-sm text-gray-400 flex items-center gap-2 bg-gray-900/95 backdrop-blur sticky top-0 z-10 uppercase tracking-widest">
                <MessageCircle size={14} /> Redes Sociais
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {feed.length === 0 && (
                    <div className="text-center text-gray-600 text-xs mt-10">
                        Nenhum comentário ainda...
                    </div>
                )}

                {feed.map(post => (
                    <div key={post.id} className="bg-gray-800 p-3 rounded-xl text-xs border border-gray-700/50 shadow-sm animate-fade-in hover:bg-gray-750 transition-colors">
                        <div className="font-bold text-blue-400 mb-1 flex items-center justify-between">
                            <span className="truncate">{post.user}</span>
                            <span className="text-[8px] bg-blue-500/10 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/20">fã</span>
                        </div>
                        <div className="text-gray-300 leading-relaxed">{post.text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Feed;
