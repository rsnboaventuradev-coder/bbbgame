import React from 'react';
import Sidebar from './Sidebar';
import Feed from './Feed';
import HouseFeed from '../game/HouseFeed'; // Import HouseFeed
import { useGame } from '../../context/GameContext';
import { LogOut } from 'lucide-react';

const GameLayout = ({ children }) => {
    const { gameState, setGameState, isPartyMode } = useGame(); // [NEW] Consume isPartyMode

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar */}
            <div className="md:h-screen md:flex-shrink-0">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative h-screen overflow-hidden">
                {/* Top Bar for Mobile/General */}
                <div className="bg-gray-900 border-b border-gray-800 p-2 flex justify-between items-center md:hidden">
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">BBB Game</span>
                    <button onClick={() => setGameState('menu')}><LogOut size={16} /></button>
                </div>

                {/* Canvas */}
                <main className={`
                    flex-1 relative overflow-hidden flex flex-col p-4 transition-all duration-1000
                    ${isPartyMode
                        ? 'bg-gradient-to-br from-purple-900 via-indigo-900 to-black animate-pulse'
                        : 'bg-gradient-to-br from-gray-900 to-gray-950'}
                `}>
                    {children}
                    {/* Party Lights Overlay */}
                    {isPartyMode && (
                        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_50%_50%,_rgba(255,0,0,0.5),transparent_50%)] animate-spin-slow"></div>
                    )}
                </main>
            </div>

            {/* Feed (Right Side) */}
            <div className="hidden lg:flex flex-col md:h-screen md:flex-shrink-0 w-72 border-l border-gray-800 bg-gray-900">
                <div className="h-1/2 border-b border-gray-800">
                    <HouseFeed />
                </div>
                <div className="h-1/2">
                    <Feed />
                </div>
            </div>
        </div>
    );
};

export default GameLayout;
