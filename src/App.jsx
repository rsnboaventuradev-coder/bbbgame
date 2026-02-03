import React from 'react';
import WinnerScreen from './components/WinnerScreen';
import { GameProvider, useGame } from './context/GameContext';
import GameLayout from './components/layout/GameLayout';
import CharacterCreation from './components/game/MainMenu';

import Minigame from './components/game/Minigame';
import AngelPanel from './components/game/AngelPanel';
import VotingPanel from './components/game/VotingPanel';
import ActionPanel from './components/game/ActionPanel';
import EventModal from './components/game/EventModal';
import NPCGrid from './components/game/NPCGrid';
import InteractionModal from './components/game/InteractionModal';
import TutorialModal from './components/game/TutorialModal';
import VotingConfessional from './components/game/VotingConfessional';
import LeaderNominationPanel from './components/game/LeaderNominationPanel'; // [NEW]
import EliminationScreen from './components/game/EliminationScreen';
import BigPhoneModal from './components/game/BigPhoneModal'; // [NEW]
import RelationshipGrid from './components/game/RelationshipGrid'; // [NEW]
import LeaderPanel from './components/game/LeaderPanel'; // [NEW]
import { GAME_STATES } from './utils/constants';

const GameContent = () => {
  const { winner, gameState, activeEvent, resolveEvent, logs, feed, activeDialogue, setActiveDialogue, day, showTutorial, setShowTutorial, showLeaderPanel, setShowLeaderPanel, selectedTarget, setSelectedTarget } = useGame();
  const logsEndRef = React.useRef(null);
  // const [showTutorial, setShowTutorial] = React.useState(false); // Moved to context

  // Show tutorial on first day load
  React.useEffect(() => {
    if (day === 1 && gameState === GAME_STATES.PLAYING) {
      // Simple check: if logs are empty (new game essentially), show tutorial
      // Or specific state. For now, rely on Day 1.
      // Better: Check if localStorage has a flag, but for now simple state:
      const hasSeenTutorial = localStorage.getItem('bbb_tutorial_seen');
      if (!hasSeenTutorial) {
        setShowTutorial(true);
      }
    }
  }, [day, gameState]);

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('bbb_tutorial_seen', 'true');
  };

  // Auto-scroll logs
  React.useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (gameState === GAME_STATES.MENU) {
    return <CharacterCreation />;
  }

  if (gameState === GAME_STATES.WINNER) {
    return <WinnerScreen />;
  }

  if (gameState === GAME_STATES.ELIMINATED) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-4xl">VOCÊ FOI ELIMINADO!</h1>
      </div>
    );
  }

  // [NEW] Leader Nomination Panel
  if (gameState === GAME_STATES.LEADER_NOMINATION) {
    return <LeaderNominationPanel />;
  }

  if (gameState === GAME_STATES.VOTING_CONFESSIONAL) {
    return <VotingConfessional />;
  }

  if (gameState === GAME_STATES.ELIMINATION_CEREMONY) {
    return <EliminationScreen />;
  }

  if (gameState === GAME_STATES.MINIGAME) {
    return <Minigame />;
  }

  if (gameState === GAME_STATES.ANGEL_CEREMONY) {
    return <AngelPanel />;
  }

  if (gameState === GAME_STATES.VOTING_HOUSE) {
    return (
      <GameLayout>
        <VotingPanel />
        {activeEvent && <EventModal event={activeEvent} onResolve={resolveEvent} />}
      </GameLayout>
    );
  }

  // Common Layout for playing state
  return (
    <GameLayout>
      <div className="flex-1 flex flex-col h-full">
        {/* NPC Grid Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-4 relative">
          <NPCGrid onSelect={setSelectedTarget} selectedId={selectedTarget} />

          {/* Logs Area */}
          <div className="mt-4 bg-black/30 p-4 rounded-xl border border-gray-800 h-48 overflow-y-auto custom-scrollbar">
            {logs.map(log => (
              <div key={log.id} className={`p-1 text-xs md:text-sm border-l-2 pl-2 mb-1 ${log.type === 'alert' ? 'border-red-500 text-red-200' :
                log.type === 'system' ? 'border-blue-500 text-blue-200' : 'border-gray-500 text-gray-400'
                }`}>
                {log.text}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>

        {/* Actions */}
        <ActionPanel />
      </div>

      {/* Event Modal Overlay */}
      {activeEvent && <EventModal event={activeEvent} onResolve={resolveEvent} />}

      {/* Interaction Modal Overlay */}
      {activeDialogue && (
        <InteractionModal
          isOpen={true}
          onClose={() => setActiveDialogue(null)}
        />
      )}
      {/* Tutorial Modal */}
      {showTutorial && <TutorialModal onClose={closeTutorial} />}
      {showLeaderPanel && <LeaderPanel onClose={() => setShowLeaderPanel(false)} />} {/* [NEW] */}

      {/* Critical Overlays */}
      <RelationshipGrid />
      <BigPhoneModal />
    </GameLayout>
  );
};

const App = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default App;
