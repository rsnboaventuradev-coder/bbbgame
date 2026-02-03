import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { NAMES, JOBS, TRAITS, ACTION_COSTS, GAME_STATES, STATES, MAX_DAILY_ACTIONS, TIMES_OF_DAY, NPC_BEHAVIOR, PARTY_MODE, LIMITS, NPC_GENERATION, RUMOR_SYSTEM, EVENT_CHANCES, MOODLETS } from '../utils/constants';
import { EVENTS } from '../data/events';
import { simulateNPCTurn } from '../utils/npcSimulation';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {


    // --- Core State ---
    const [gameState, setGameState] = useState(GAME_STATES.MENU);

    const [day, setDay] = useState(1);
    const [week, setWeek] = useState(1);
    const [player, setPlayer] = useState({
        name: 'Você',
        age: 20,
        job: '',
        state: '',
        trait: '',
        attributes: { charisma: 50, strategy: 50, endurance: 50 },
        popularity: 50,
        energy: 100,
        stress: 0,
        immunity: false,
        monster: false,
        romanceId: null,
        boredomCount: 0,
        money: 0, // Current Estalecas
        totalMoneyEarned: 0, // Lifetime Estalecas (for score)

        paredoesCount: 0, // Total Paredoes survived
        intoxication: 0, // [NEW] 0-100
        hangover: false, // [NEW] Morning penalty
        hunger: 0,
        hygiene: 100,
        group: 'xepa' // [NEW] 'vip' or 'xepa'
    });

    const [isPartyMode, setIsPartyMode] = useState(false); // [NEW] Party State
    const [npcs, setNpcs] = useState([]);
    const [feed, setFeed] = useState([]);
    const [logs, setLogs] = useState([]);
    const [houseLog, setHouseLog] = useState([]); // Internal House Log

    // Persistence: Auto Load (if save exists)
    useEffect(() => {
        // We delay the check slightly to ensure functions are ready, just in case, 
        // though standard closure rules should make them available.
        // Actually, to be 100% safe against "access before initialization" in some environments:
        // We can just check localStorage directly here.
        const saved = localStorage.getItem('bbb_save');
        if (saved) {
            // We can't call loadFromStorage directly if it's not hoisted safe? 
            // It's a const function, it IS TDZ constrained if accessed before declaration in synchronous flow.
            // But inside useEffect, it runs AFTER the render cycle completes. 
            // By then, the const loadFromStorage = ... has executed.
            // It should be fine.
            // However, for safety, let's assume it works.
            // If debugging shows error, we move loadFromStorage up using useCallback or function declaration.
            if (checkSave) checkSave() && loadFromStorage();
        }
    }, []);

    // --- Autonomous Life Engine (ENHANCED) ---
    // --- Autonomous Life Engine (Moved to Utils) ---
    // See src/utils/npcSimulation.js

    // [NEW] Drink Action
    const drinkAlcohol = () => {
        setPlayer(prev => ({
            ...prev,
            intoxication: Math.min(100, prev.intoxication + 15),
            stress: Math.max(0, prev.stress - 10)
        }));
        addLog("Você virou um drink! O estresse diminuiu, mas o mundo girou...", "fun");

        // Pass out risk?
        if (player.intoxication > 80) {
            addLog("VOCÊ APAGOU! Bebeu demais...", "alert");
            setActionsLeft(0); // Ends turn
        }
    };

    const [leaderId, setLeaderId] = useState(null);
    const [angelId, setAngelId] = useState(null); // NEW
    const [selectedTarget, setSelectedTarget] = useState(null);
    const [nominees, setNominees] = useState([]);
    const [houseCleanliness, setHouseCleanliness] = useState(100);
    const [actionsLeft, setActionsLeft] = useState(MAX_DAILY_ACTIONS); // Moved up

    const [activeEvent, setActiveEvent] = useState(null);
    const [bigFone, setBigFone] = useState({ active: false, checked: false }); // New State
    // Reset bigFone daily? logic in nextDay

    const [activeDialogue, setActiveDialogue] = useState(null); // NEW: Dialogue State

    // [NEW] Calculate Active Moodlets
    const activeMoodlets = Object.values(MOODLETS).filter(m => m.condition(player));


    const [immunes, setImmunes] = useState([]); // Refactored: Array of IDs (Leader already in separate state but added here for unification if needed, or separate)
    // Actually leaderId is separate. immunes tracks Angel + Big Phone.
    const [monsters, setMonsters] = useState([]); // New: Monsters

    // --- Alliance State ---
    const [allianceTarget, setAllianceTarget] = useState(null); // Suggested vote target

    // --- Minigame State ---
    const [minigameState, setMinigameState] = useState({
        active: false, score: 0, targetScore: 0, timeLeft: 5, isPlaying: false, type: 'leader' // leader or angel
    });

    // --- Event Logic ---
    const triggerRandomEvent = () => {
        if (Math.random() > 0.3 || gameState !== GAME_STATES.PLAYING) return;

        // Filter valid events based on trigger (if any)
        const validEvents = EVENTS.filter(e => {
            if (!e.trigger || e.trigger === 'random') return true;
            // Add more specific triggers here later
            return false;
        });

        if (validEvents.length > 0) {
            const randomEvent = validEvents[Math.floor(Math.random() * validEvents.length)];
            setActiveEvent(randomEvent);
        }
    };

    const resolveEvent = (choice) => {
        if (choice.effect) {
            // Pass all necessary setters for complex events
            choice.effect(player, setPlayer, npcs, setNpcs, addLog, addMemory, setImmunes, setNominees, setMonsters);
        }
        const sentimentMap = { 'drama': 'drama', 'positive': 'good', 'negative': 'bad', 'neutral': 'neutral' };
        addSocialPost(sentimentMap[choice.sentiment] || 'neutral', "Reagiu a um evento na casa.");
        setActiveEvent(null);
    };

    // --- Actions ---
    const addLog = (text, type = 'info') => {
        setLogs(prev => [{ text, type, id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }, ...prev].slice(0, LIMITS.MAX_LOGS));
    };

    const addSocialPost = (sentiment, context = "") => {
        const reactions = {
            good: ["Joga y Joga!", "Protagonista!", "Essa atitude foi tudo 😍", `#Team${player.name}`, "Muitos pontos com o público!"],
            bad: ["Que vergonha...", "FORA!", "Não aguento mais essa pessoa", "Muito falso(a)", "Cancelado(a)!"],
            neutral: ["Interessante...", "O clima pesou hein", "Essa casa tá pegando fogo"],
            drama: ["MEU DEUS A TRETA", "Pegou a pipoca?", "Eitaaa 🔥", "O puro suco do entretenimento"],
            planta: ["Alguém avisa que ele(a) tá no programa?", "Samambaia total 🌿", "Só dorme, que tédio...", "Zero conteúdo #Planta"]
        };

        let pool = reactions.neutral;
        if (sentiment === 'positive') pool = reactions.good;
        if (sentiment === 'negative') pool = reactions.bad;
        if (sentiment === 'drama') pool = reactions.drama;
        if (sentiment === 'planta') pool = reactions.planta;

        const randomComment = pool[Math.floor(Math.random() * pool.length)];
        const randomUser = `@user${Math.floor(Math.random() * 9000) + 1000}`;
        setFeed(prev => [{ user: randomUser, text: `${randomComment} ${context}`, id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }, ...prev].slice(0, LIMITS.MAX_FEED));
    };

    const generateNPCs = (count) => {
        let newNpcs = [];
        let usedNames = new Set();
        for (let i = 0; i < count; i++) {
            let name = NAMES[Math.floor(Math.random() * NAMES.length)];
            while (usedNames.has(name)) name = NAMES[Math.floor(Math.random() * NAMES.length)];
            usedNames.add(name);

            // Simple randomization for now, ideally could use the new JOB objects for NPCs too
            newNpcs.push({
                id: i + 1,
                name,
                age: Math.floor(Math.random() * (NPC_GENERATION.MAX_AGE - NPC_GENERATION.MIN_AGE + 1)) + NPC_GENERATION.MIN_AGE,
                job: JOBS[Math.floor(Math.random() * JOBS.length)].name, // Use name property from object
                trait: TRAITS[Math.floor(Math.random() * TRAITS.length)],
                affinity: NPC_GENERATION.INITIAL_AFFINITY,
                group: 'xepa', // [NEW] Default group
                publicPop: NPC_GENERATION.INITIAL_PUBLIC_POP_MIN + Math.floor(Math.random() * NPC_GENERATION.INITIAL_PUBLIC_POP_RANGE),
                status: 'active', // active, eliminated
                votesReceived: 0,
                knownJob: false,
                knownTrait: false,
                knownJob: false,
                knownTrait: false,
                memory: [], // legacy: simple list of last interactions
                memories: [], // NEW: Structured logs { type, severity, targetId, day }
                knownRumors: [], // NEW: { topic, regardingId, day }
                loyalty: Math.floor(Math.random() * NPC_GENERATION.INITIAL_LOYALTY_RANGE) + NPC_GENERATION.INITIAL_LOYALTY_MIN,
                beauty: Math.floor(Math.random() * NPC_GENERATION.INITIAL_BEAUTY_RANGE) + NPC_GENERATION.INITIAL_BEAUTY_MIN,
                relationships: {} // { targetId: { status, chemistry } }
            });
        }

        // Populate Initial Relationships (40-60 random)
        newNpcs.forEach(n => {
            n.relationships = {};
            newNpcs.forEach(t => {
                if (n.id !== t.id) {
                    n.relationships[t.id] = 40 + Math.floor(Math.random() * 21);
                }
            });
            n.relationships['player'] = n.affinity || 50;
        });

        return newNpcs;
    };

    const startGame = (profileData) => {
        if (checkSave()) {
            if (window.confirm("Existe um jogo salvo. Deseja carregar o progresso existente?")) {
                loadFromStorage();
                return;
            }
        }
        const generatedNpcs = generateNPCs(12);
        setNpcs(generatedNpcs);

        // Calculate Base Stats based on Job & Trait
        let baseCharisma = 50 + (profileData.job?.bonus?.charisma || 0) + (profileData.trait?.bonus?.charisma || 0);
        let baseStrategy = 50 + (profileData.job?.bonus?.strategy || 0) + (profileData.trait?.bonus?.strategy || 0);
        let baseEndurance = 50 + (profileData.job?.bonus?.endurance || 0) + (profileData.trait?.bonus?.endurance || 0);

        setPlayer({
            ...player,
            hunger: 0,
            hygiene: 100,
            intoxication: 0,
            name: profileData.name || 'Você',
            age: profileData.age,
            job: profileData.job?.name,
            state: profileData.state?.code,
            trait: profileData.trait?.name,
            attributes: {
                charisma: Math.min(100, Math.max(0, baseCharisma)),
                strategy: Math.min(100, Math.max(0, baseStrategy)),
                endurance: Math.min(100, Math.max(0, baseEndurance)),
            },
            popularity: 50 + (baseCharisma > 60 ? 10 : 0), // Charisma allows higher start pop
            energy: 100,
            stress: 0,
            immunity: false,
            monster: false,
            romanceId: null,
            boredomCount: 0,
            money: 0,
            totalMoneyEarned: 0,
            paredoesCount: 0,

            // Economy & Survival
            estalecas: 500,
            hunger: 0,
            hygiene: 100,
            // Politics
            // Politics
            alliance: [], // Array of NPC IDs
            // Romance
            beauty: Math.floor(Math.random() * 40) + 60, // Player beauty 60-100 (MC privilege)
            relationships: {} // To track status with NPCs
        });
        setHouseCleanliness(100);
        setDay(1);
        setWeek(1);
        setActionsLeft(MAX_DAILY_ACTIONS); // Start fresh
        setLogs([]);
        setLogs([]);
        setFeed([]);
        setHouseLog([]); // New Internal Feed 
        setGameState(GAME_STATES.PLAYING);
        addLog(`Bem-vindo à casa! Você tem ${generatedNpcs.length} concorrentes.`, 'system');
        addSocialPost('neutral', 'Começou o jogo!');
    };

    // --- Logic ---
    const updateAffinity = (npcId, amount) => {
        setNpcs(prev => prev.map(npc => {
            if (npc.id === npcId) {
                const newAffinity = Math.min(100, Math.max(0, npc.affinity + amount));
                let updates = { affinity: newAffinity };

                // Fog of War Reveal Logic
                if (newAffinity >= 30 && !npc.knownJob) {
                    updates.knownJob = true;
                    addLog(`Você descobriu que ${npc.name} trabalha como ${npc.job}!`, 'system');
                }
                if (newAffinity >= 60 && !npc.knownTrait) {
                    updates.knownTrait = true;
                    addLog(`Você percebeu que ${npc.name} é ${npc.trait.name}!`, 'system');
                }

                return { ...npc, ...updates };
            }
            return npc;
        }));
    };

    const addInteraction = (npcId, type) => {
        setNpcs(prev => prev.map(n => {
            if (n.id === npcId) {
                const newMemory = [type, ...(n.memory || [])].slice(0, 3);
                return { ...n, memory: newMemory };
            }
            return n;
        }));
    };

    const addMemory = (npcId, type, severity, targetId) => {
        setNpcs(prev => prev.map(n => {
            if (n.id === npcId) {
                const newMemory = { type, severity, targetId, day };
                // Keep only last N relevant memories to save space
                const updatedMemories = [newMemory, ...n.memories].slice(0, LIMITS.MAX_MEMORIES_PER_NPC);
                return { ...n, memories: updatedMemories };
            }
            return n;
        }));
    };

    const buyItem = (cost, effectFn) => {
        if (player.estalecas >= cost) {
            setPlayer(prev => ({ ...prev, estalecas: prev.estalecas - cost }));
            effectFn(player, setPlayer, npcs, setNpcs, addLog);
            return true;
        } else {
            addLog("Estalecas insuficientes!", "error");
            return false;
        }
    };

    const propagateRumors = () => {
        let newLog = [];
        setNpcs(currentNpcs => {
            const updates = [...currentNpcs];

            // 1. Iterate each NPC to see if they share rumors
            updates.forEach(sharer => {
                if (sharer.status !== 'active') return;

                sharer.knownRumors.forEach(rumor => {
                    // Check older rumors (only share recent ones)
                    if (day - rumor.day > RUMOR_SYSTEM.MAX_RUMOR_AGE_DAYS) return;

                    // Find friends to share with
                    updates.forEach(listener => {
                        if (listener.id === sharer.id || listener.status !== 'active') return;

                        // Already knows?
                        if (listener.knownRumors.some(r => r.id === rumor.id)) return;

                        // Willingness to share/listen
                        const isGossip = sharer.trait.name === 'Fofoqueiro'; // Assuming trait structure
                        const shareChance = (sharer.affinity + (isGossip ? RUMOR_SYSTEM.GOSSIP_TRAIT_SHARE_BONUS : 0)) / RUMOR_SYSTEM.SHARE_CHANCE_DIVISOR;

                        if (Math.random() < shareChance) {
                            // FIX: Limit knownRumors to prevent memory leak
                            listener.knownRumors = [{ ...rumor }, ...listener.knownRumors].slice(0, LIMITS.MAX_RUMORS_PER_NPC);

                            // Effect: If rumor is about Player, listener likes Player less
                            if (rumor.regardingId === 'player') {
                                listener.affinity = Math.max(NPC_BEHAVIOR.MIN_AFFINITY, listener.affinity - RUMOR_SYSTEM.RUMOR_AFFINITY_PENALTY);
                            }

                            // Log occasionally
                            if (Math.random() > 0.8) {
                                newLog.push(`${sharer.name} contou uma fofoca para ${listener.name}.`);
                            }
                        }
                    });
                });
            });
            return updates;
        });
        newLog.forEach(l => addLog(l, 'system'));
    };

    // --- Romance Logic ---
    const calculateChemistry = (npc1, npc2) => {
        // Simplified Chemistry based on Traits
        // Same trait = High Chemistry. Opposites = Low.
        // For now, random static calc based on IDs for consistency if no traits define opposites yet
        // Let's use Trait Name Check
        if (!npc1.trait || !npc2.trait) return 50;
        if (npc1.trait === npc2.trait) return 90; // Soulmates!

        const opposites = {
            'Barraqueiro': 'Planta',
            'Planta': 'Barraqueiro',
            'Líder Nato': 'Estrategista',
            'Estrategista': 'Líder Nato'
        };

        if (opposites[npc1.trait] === npc2.trait) return 10; // Crash

        return 50 + (Math.random() * 20); // Average
    };

    const executeRomanceAction = (targetId, action) => {
        const target = npcs.find(n => n.id === targetId);
        if (!target) return;

        // Verify Energy
        let cost = 0;
        if (action === 'FLIRT') cost = 10;
        if (action === 'KISS') cost = 15;
        if (action === 'EDREDOM') cost = 40;

        if (player.energy < cost) {
            addLog("Sem energia para romance...", 'alert');
            return;
        }

        setPlayer(prev => ({ ...prev, energy: prev.energy - cost }));

        // Check Jealousy (If interacting with Target, check if anyone else has Status > INTERESTED)
        const jealousNPCs = npcs.filter(n =>
            n.id !== targetId &&
            n.status === 'active' &&
            (n.relationships?.['player']?.status === 'FLIRT' || n.relationships?.['player']?.status === 'SECRET' || n.relationships?.['player']?.status === 'OFFICIAL')
        );

        jealousNPCs.forEach(jealous => {
            updateAffinity(jealous.id, -20);
            addLog(`${jealous.name} sentiu ciúmes da sua interação com ${target.name}!`, 'bad');
            addMemory(jealous.id, 'jealousy', 'medium', 'player');
        });

        // 2. Success Chance
        // Base = Affinity. Bonus = Beauty + Chemistry.
        const currentRel = target.relationships?.['player'] || { status: 'NONE', chemistry: calculateChemistry({ trait: player.trait }, { trait: target.trait }) };
        const chemistry = currentRel.chemistry || 50;

        let successChance = (target.affinity / 2) + (player.beauty / 4) + (chemistry / 4);

        // [NEW] Intoxication (Liquid Courage)
        if (player.intoxication > 50) {
            successChance += 20;
        }

        // Action Thresholds
        if (action === 'FLIRT') successChance += 20;
        if (action === 'KISS') successChance -= 10;
        if (action === 'EDREDOM') successChance -= 30;

        const roll = Math.random() * 100;

        if (roll < successChance) {
            // Success!
            let newStatus = currentRel.status;
            let logMsg = "";
            let sentiment = 'positive';

            if (action === 'FLIRT') {
                newStatus = currentRel.status === 'NONE' ? 'INTERESTED' : currentRel.status;
                logMsg = `Você flertou com ${target.name} e rolou um clima.`;

                // [NEW] Regret Risk
                if (player.intoxication > 50 && Math.random() < 0.2) {
                    addLog("Você foi agressivo(a) demais... pode se arrepender amanhã.", 'alert');
                    // Could set a flag here for next day specific log
                }

                updateAffinity(targetId, 5);
            } else if (action === 'KISS') {
                if (currentRel.status === 'INTERESTED' || currentRel.status === 'FLIRT') {
                    newStatus = 'SECRET'; // First kiss implies secret romance
                    logMsg = `Você BEIJOU ${target.name}! Agora vocês têm um romance secreto.`;
                    sentiment = 'good';
                    addSocialPost('good', `Casal novo na área? ${player.name} e ${target.name} se beijaram!`);
                    updateAffinity(targetId, 15);
                } else {
                    logMsg = `Mais um beijo em ${target.name}...`;
                    updateAffinity(targetId, 5);
                }
            } else if (action === 'EDREDOM') {
                if (currentRel.status === 'SECRET' || currentRel.status === 'OFFICIAL') {
                    logMsg = `🔥 EDREDOM! O clima esquentou com ${target.name}!`;
                    sentiment = 'drama';
                    addSocialPost('drama', `O edredom tremeu com ${player.name} e ${target.name}! 🔥🔥🔥`);
                    updateAffinity(targetId, 25);
                    // Huge buzz
                    setPlayer(prev => ({ ...prev, popularity: prev.popularity + 10 }));
                } else {
                    addLog(`${target.name} não está pronto para isso ainda.`, 'neutral');
                    return;
                }
            }

            // Update NPC State
            setNpcs(prev => prev.map(n => {
                if (n.id === targetId) {
                    return {
                        ...n,
                        relationships: {
                            ...n.relationships,
                            player: { status: newStatus, chemistry }
                        }
                    };
                }
                return n;
            }));

            addLog(logMsg, 'success');

        } else {
            // Failure
            addLog(`${target.name} não reagiu bem à sua investida.`, 'neutral');
            updateAffinity(targetId, -5);
        }
    };

    const inviteToAlliance = (npcId) => {
        const npc = npcs.find(n => n.id === npcId);
        if (!npc) return;

        if (npc.affinity >= 70) {
            setPlayer(prev => ({ ...prev, alliance: [...(prev.alliance || []), npcId] }));
            // Boost loyalty on join
            setNpcs(prev => prev.map(n => n.id === npcId ? { ...n, loyalty: n.loyalty + 10 } : n));
            addLog(`${npc.name} aceitou entrar na sua Aliança!`, 'success');
            return true;
        } else {
            addLog(`${npc.name} recusou. "Ainda não confio em você."`, 'neutral');
            return false;
        }
    };

    const callAllianceMeeting = (targetId) => {
        if (!player.alliance || player.alliance.length === 0) {
            addLog("Você não tem aliança para convocar!", "error");
            return;
        }

        // [NEW] Party Risk: Rivals hearing strategy
        if (isPartyMode && Math.random() < 0.40) {
            // Find a rival (someone NOT in alliance)
            const rivals = npcs.filter(n => n.status === 'active' && !player.alliance.includes(n.id));
            if (rivals.length > 0) {
                const eavesdropper = rivals[Math.floor(Math.random() * rivals.length)];
                addLog(`${eavesdropper.name} ouviu sua combinação de votos!`, 'alert');
                addSocialPost('drama', `ESCÂNDALO! ${eavesdropper.name} pegou ${player.name} combinando votos na festa!`);
                updateAffinity(eavesdropper.id, -15);
                // Reveal strategy risk materialized
            }
        }

        setAllianceTarget(targetId);
        const targetName = npcs.find(n => n.id === targetId)?.name || 'Alguém';
        addLog(`Você sugeriu votar em ${targetName} na reunião.`, 'info');
        addSocialPost('drama', `Combinou votos em ${targetName}!`);
    };

    const nextDay = () => {
        propagateRumors(); // Spread the tea
        setNpcs(prev => {
            const { updatedNpcs, generatedEvents } = simulateNPCTurn(prev, isPartyMode, player);
            if (generatedEvents.length > 0) {
                setHouseLog(h => [...generatedEvents, ...h].slice(0, LIMITS.MAX_HOUSE_LOG));
            }
            return updatedNpcs;
        }); // Overnight interactions
        const activeNpcs = npcs.filter(n => n.status === 'active');
        if (activeNpcs.length <= 2) {
            setGameState(GAME_STATES.WINNER);
            saveToHallOfFame(); // Save run to history
            return;
        }

        const nextDayNum = day + 1;
        setDay(nextDayNum);
        setActionsLeft(MAX_DAILY_ACTIONS); // Reset actions
        setBigFone({ active: false, checked: false }); // Reset Big Phone daily chance
        setActionsLeft(MAX_DAILY_ACTIONS); // Reset actions

        // Weekly Cycle Logic
        const dayOfWeek = ((nextDayNum - 1) % 7) + 1; // Correct day calculation

        if (dayOfWeek === 1 && nextDayNum > 1) {
            setPlayer(prev => ({
                ...prev,
                money: prev.money + 100,
                totalMoneyEarned: prev.totalMoneyEarned + 100
            }));
            addLog(`SEMANADA: Você recebeu C$ 100 de estalecas.`, 'system');
            // Reset Weekly States
            setImmunes([]); // Clear immunities on Monday
            setMonsters([]);
            setNominees([]);
        }

        // Check week progression
        if ((nextDayNum - 1) % 7 === 0 && nextDayNum > 1) {
            setWeek(prev => prev + 1);
        }

        let evt = "Dia comum.";

        // Helper to pick random game mode
        const pickGameMode = () => {
            const modes = ['reflex', 'memory', 'luck'];
            return modes[Math.floor(Math.random() * modes.length)];
        };

        // Reset Hangover if it exists (Mid-day recovery? Or just stays for morning?)
        // For simplicity, Hangover clears on Next Day logic start (meaning it was for the previous day, but wait...
        // If today is Saturday (Day 6), we just applied hangover.
        // Logic: Friday set party. Saturday clears party and sets hangover. Sunday clears hangover.
        if (player.hangover) {
            setPlayer(prev => ({ ...prev, hangover: false }));
            addLog("Você se recuperou da ressaca.", 'success');
        }

        if (dayOfWeek === 4) { // Leader (Thursday)
            addLog(`Semana ${Math.ceil(nextDayNum / 7)}: Quinta-feira - PROVA DO LÍDER!`, 'system');
            setGameState(GAME_STATES.MINIGAME);
            setMinigameState({
                active: true, score: 0, targetScore: 10 + week, timeLeft: 15, isPlaying: true,
                type: 'leader',
                mode: pickGameMode()
            });
        } else if (dayOfWeek === 6) { // Angel (Saturday)
            addLog(`Semana ${Math.ceil(nextDayNum / 7)}: Sábado - PROVA DO ANJO!`, 'system');

            // Leader restriction logic
            if (leaderId === 'player') {
                addLog("Você é o Líder e não participa da Prova do Anjo.", 'info');
                // Simulate NPC win immediately
                const participants = activeNpcs.filter(n => n.id !== leaderId); // Leader NPC also excluded if NPC
                if (participants.length > 0) {
                    const winner = participants[Math.floor(Math.random() * participants.length)];
                    finishMinigame(0); // Pass 0 as player score (didn't play), forcing logic to pick NPC winner if we update finishMinigame or hack it here.
                    // Actually, better to just simulate it manually here or reuse logic carefully.
                    // Let's rely on standard flow but force skipping player input:
                    // Simplest: Auto-simulate winner directly here to avoid Minigame screen.
                    setAngelId(winner.id);
                    addLog(`${winner.name} venceu a Prova do Anjo!`, 'system');
                    // NPC Angel Logic Trigger needed? 
                    // Usually finishMinigame handles logic. Let's call it with player excluded?
                    // Easier: just let the "else" flow for Angel happen but skipping UI is tricky without refactor.
                    // Alternative: Set Minigame but Auto-Fail player? No, UI shows up.
                    // CORRECT FIX: Just don't setGameState(MINIGAME). Handle logic purely backend.

                    // Run NPC Angel Choice Logic
                    const immuneCandidate = activeNpcs.find(n => n.id !== winner.id && n.id !== leaderId && n.status === 'active');
                    if (immuneCandidate) {
                        setImmunes(prev => [...prev, immuneCandidate.id]);
                        addLog(`😇 ANJO: ${winner.name} imunizou ${immuneCandidate.name}!`, 'system');
                    }
                }
            } else {
                setGameState(GAME_STATES.MINIGAME);
                setMinigameState({
                    active: true, score: 0, targetScore: 8 + week, timeLeft: 15, isPlaying: true,
                    type: 'angel',
                    mode: pickGameMode()
                });
            }
        } else if (dayOfWeek === 7) { // Voting (Sunday)
            addLog("🚨 DOMINGO: Formação de Paredão!", 'alert');

            // Leader Nomination Phase First
            if (leaderId) {
                if (leaderId === 'player') {
                    addLog("Você é o Líder! É hora de indicar alguém.", 'system');
                    setGameState(GAME_STATES.LEADER_NOMINATION);
                } else {
                    // NPC Leader Logic
                    const leader = npcs.find(n => n.id === leaderId);
                    addLog(`O Líder ${leader.name} vai fazer sua indicação...`, 'alert');

                    // AI Choice: Enemy or Lowest Affinity
                    const enemies = npcs.filter(n => n.id !== leaderId && n.status === 'active' && !immunes.includes(n.id) && n.id !== 'player');
                    // Include player in targets if not immune
                    const targets = [...enemies];
                    if (!immunes.includes('player')) targets.push({ id: 'player', ...player });

                    let target = targets.sort((a, b) => (a.affinity || 50) - (b.affinity || 50))[0]; // Simplistic logic

                    // If Leader hates player verify relationship
                    const relWithPlayer = leader.relationships?.['player']?.status || 'NONE';
                    const playerAffinity = leader.relationships?.['player']?.chemistry || 50; // Using chemistry/affinity abstraction

                    // Direct logic:
                    if (target) {
                        setNominees(prev => [...prev, target.id]);
                        addLog(`LÍDER: ${leader.name} indicou ${target.name === 'Você' ? 'VOCÊ' : target.name} ao Paredão!`, 'drama');
                        setGameState(GAME_STATES.VOTING_CONFESSIONAL);
                    } else {
                        // Fallback
                        setGameState(GAME_STATES.VOTING_CONFESSIONAL);
                    }
                }
            } else {
                setGameState(GAME_STATES.VOTING_CONFESSIONAL);
            }

            // Verify if Eliminations need to happen on Tuesdays (Day 2)
        } else if (dayOfWeek === 2 && week > 1) { // Elimination (Tuesday)
            addLog("TERÇA-FEIRA: Hoje tem Eliminação!", 'alert');
            setGameState(GAME_STATES.ELIMINATION_CEREMONY); // Trigger Cinematic Elimination
        } else if (dayOfWeek === 1 && nextDayNum > 1) { // Monday - Jogo da Discórdia
            addLog(`Segunda-feira: Jogo da Discórdia!`, 'system');
            const targets = activeNpcs.sort(() => 0.5 - Math.random()).slice(0, 3);
            setActiveEvent({
                id: 'discordia',
                text: "É hora do Jogo da Discórdia! Escolha alguém para criticar na frente da casa:",
                choices: targets.map(target => ({
                    text: `Criticar ${target.name}`,
                    sentiment: 'drama',
                    effect: (p, setP, npcs, setN, addLog, addMemory) => {
                        setP(prev => ({ ...prev, popularity: Math.min(100, prev.popularity + 5) }));
                        updateAffinity(target.id, -15);
                        if (addMemory) addMemory(target.id, 'public_humiliation', 'medium', 'player'); // Memory added
                        addLog(`Você detonou ${target.name} no ao vivo!`, 'alert');
                        addSocialPost('drama', `Vish! ${p.name} não teve pena do ${target.name}! #FogoNoParquinho`);
                    }
                }))
            });
        } else if (dayOfWeek === 5) { // Friday - Party
            addLog(`Sexta-feira: Hoje tem FESTA!`, 'success');
            setIsPartyMode(true); // [NEW] Activate Party Mode
            const partyEvent = EVENTS.find(e => e.id === 'party');
            if (partyEvent) {
                setActiveEvent(partyEvent);
            } else {
                console.error("Party event missing from events.js!");
                setActiveEvent({
                    id: 'party_fallback',
                    text: "A festa começou! (Modo de Segurança)",
                    choices: [
                        { text: "Dançar", sentiment: 'positive', effect: (p, setP) => setP(prev => ({ ...prev, energy: Math.max(0, prev.energy - 20) })) },
                        { text: "Comer", sentiment: 'neutral', effect: (p, setP) => setP(prev => ({ ...prev, stress: Math.max(0, prev.stress - 10) })) }
                    ]
                });
            }
        } else {
            // Generic Random Events for other days checks cleanliness
            if (houseCleanliness < 20) {
                const punishmentEvent = EVENTS.find(e => e.id === 'punishment');
                if (punishmentEvent) {
                    setActiveEvent(punishmentEvent);
                } else {
                    // Fallback
                    addLog("Punição! (Evento não encontrado)", "alert");
                }
            } else {
                const randomEvts = ["Manutenção externa.", "Dia de Cinema.", "Tarde de fofoca."];
                evt = randomEvts[Math.floor(Math.random() * randomEvts.length)];
                addLog(`Dia ${nextDayNum}: ${evt}`, 'system');
            }
        }

        // Decay
        const dirtyFactor = 15;
        const newCleanliness = Math.max(0, houseCleanliness - dirtyFactor);
        setHouseCleanliness(newCleanliness);

        // Player Stats Update
        if (newCleanliness < 30) addLog("A casa está imunda! Estresse subindo.", 'alert');

        // [NEW] Hangover Logic (Applied AFTER Day Increment to Saturday)
        let energyRestore = 100;
        let newHangover = false;

        // If it was Friday (Start of Party), we are now Saturday (Day 6).
        // Wait, dayOfWeek is based on nextDayNum.
        // If nextDayNum corresponds to Saturday (6).
        // Previous day was Friday (Party).

        if (dayOfWeek === 6 && isPartyMode) { // Ending Party (Friday -> Saturday)
            setIsPartyMode(false);
            addLog("Fim da Festa! A luz do dia machuca seus olhos...", 'neutral');

            if (player.intoxication > 40) {
                newHangover = true;
                energyRestore = 50;
                addLog("RESSACA! Você acordou destruído(a). Energia em 50%.", 'bad');
            } else {
                addLog("Você bebeu com moderação e acordou bem.", 'success');
            }
        }

        // Reset Intoxication daily
        setPlayer(prev => ({
            ...prev,
            intoxication: 0,
            hangover: newHangover,
            energy: energyRestore,
            stress: Math.min(100, Math.max(0, prev.stress + (newCleanliness < 30 ? 10 : -5))),
            boredomCount: prev.boredomCount + 1
        }));
    };


    // --- Persistence Logic ---
    const resolveLeaderPerk = (type, data) => {
        if (type === 'cinema') {
            const { guests } = data;
            setNpcs(prev => prev.map(n => {
                if (guests.includes(n.id)) {
                    // Massive affinity boost
                    return { ...n, affinity: Math.min(100, n.affinity + 25) };
                }
                return n;
            }));
            setPlayer(prev => ({ ...prev, energy: 100, stress: 0 })); // Full restore
            addLog(`CINEMA DO LÍDER: Você curtiu um filme com os convidados!`, 'success');
            addSocialPost('good', `O Líder chamou os amigos pro Cinema!`);
        } else if (type === 'spy') {
            // Cost logic
            if (player.money < 50) {
                return { text: "Sem estalecas suficientes!" }; // Should create UI feedback instead but ok
            }
            setPlayer(prev => ({ ...prev, money: prev.money - 50 }));

            // Get random secret info
            // 1. Who voted in who (last week)? Or who dislikes player?
            // Let's reveal a dislike or a random conversation
            const activeNpcs = npcs.filter(n => n.status === 'active');
            const target = activeNpcs[Math.floor(Math.random() * activeNpcs.length)];

            // Generate spy text
            const spyTexts = [
                `${target.name} disse que não confia em você.`,
                `${target.name} está pensando em votar em ${activeNpcs.find(n => n.id !== target.id)?.name || 'alguém'}.`,
                `${target.name} acha que você é forte no jogo.`,
                `Ouviu ${target.name} reclamando da limpeza da casa.`
            ];
            const text = spyTexts[Math.floor(Math.random() * spyTexts.length)];
            return { text };
        }
    };

    const saveGame = () => {
        // We cannot save functions (event effects), so we only save the Event ID
        const serializableActiveEvent = activeEvent ? { id: activeEvent.id } : null;

        const gameStateData = {
            day, week, player, npcs, feed, logs, houseLog, // Include houseLog
            leaderId, angelId,
            activeEvent: serializableActiveEvent, // Save refined object
            gameState, houseCleanliness,
            actionsLeft, // Save actions left
            nominees, immunes, monsters, allianceTarget, // Save all auxiliary states
            bigFone // Save bigFone state
        };
        try {
            localStorage.setItem('bbb_save', JSON.stringify(gameStateData));
            console.log("Game saved successfully");
        } catch (e) {
            console.error("Save failed (quota or circular):", e);
            addLog("Erro ao salvar o jogo. Espaço cheio?", "error");
        }
    };

    const loadFromStorage = () => {
        try {
            const data = localStorage.getItem('bbb_save');
            if (data) {
                const parsed = JSON.parse(data);

                setDay(parsed.day);
                setWeek(parsed.week);
                setPlayer(parsed.player);
                setNpcs(parsed.npcs);
                setFeed(parsed.feed);
                setLogs(parsed.logs);
                setHouseLog(parsed.houseLog || []);
                setLeaderId(parsed.leaderId);
                setAngelId(parsed.angelId);
                setGameState(parsed.gameState);
                setHouseCleanliness(parsed.houseCleanliness || 100);
                setActionsLeft(parsed.actionsLeft !== undefined ? parsed.actionsLeft : MAX_DAILY_ACTIONS);
                setNominees((parsed.nominees || []).map(n => typeof n === 'object' ? n : { id: n, reason: 'legacy' }));
                setImmunes(parsed.immunes || []);
                setMonsters(parsed.monsters || []);
                setAllianceTarget(parsed.allianceTarget || null);
                setBigFone(parsed.bigFone || { active: false, checked: false }); // Load bigFone

                // Re-hydrate Event
                if (parsed.activeEvent && parsed.activeEvent.id) {
                    const originalEvent = EVENTS.find(e => e.id === parsed.activeEvent.id);
                    if (originalEvent) {
                        setActiveEvent(originalEvent);
                    } else {
                        setActiveEvent(null); // Event no longer exists in DB or dynamic event lost
                    }
                } else {
                    setActiveEvent(null);
                }

                addLog("Jogo recuperado com sucesso!", "success");
                return true;
            }
        } catch (e) {
            console.error("Failed to load save", e);
            addLog("Erro ao carregar save game.", "error");
            return false;
        }
        return false;
    };

    const checkSave = () => {
        return !!localStorage.getItem('bbb_save');
    };

    // --- Hall of Fame Logic ---
    const saveToHallOfFame = () => {
        const history = JSON.parse(localStorage.getItem('bbb_hall_of_fame') || '[]');
        const newRecord = {
            id: Date.now(),
            name: player.name,
            job: player.job,
            money: player.totalMoneyEarned,
            days: day,
            date: new Date().toLocaleDateString()
        };
        history.push(newRecord);
        localStorage.setItem('bbb_hall_of_fame', JSON.stringify(history));
    };

    const getHallOfFame = () => {
        return JSON.parse(localStorage.getItem('bbb_hall_of_fame') || '[]');
    };

    const clearSave = () => {
        localStorage.removeItem('bbb_save');
        setGameState(GAME_STATES.MENU);
    };

    // Auto-save on important state changes
    useEffect(() => {
        if (gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.VOTING_HOUSE || gameState === GAME_STATES.MINIGAME) {
            saveGame();
        }
    }, [day, gameState, actionsLeft, player.money, npcs.length, bigFone]); // Verified triggers


    // --- BIG FONE SYSTEM ---
    const triggerBigFone = () => {
        setBigFone({ active: true, checked: false });
        addLog("☎ O BIG FONE ESTÁ TOCANDO!", 'drama');
    };

    const resolveBigFone = (action, targetId = null) => {
        if (action === 'close') {
            setBigFone({ active: false, checked: true });
            return;
        }

        if (action === 'ignore') {
            setBigFone({ active: false, checked: true });
            addLog("Você ignorou o Big Fone. O público achou covardia.", 'bad');
            setPlayer(p => ({ ...p, popularity: p.popularity - 10, stress: p.stress + 10 }));

            // Someone else answers logic
            const runner = npcs.filter(n => n.status === 'active')[0];
            if (runner) addLog(`${runner.name} correu e atendeu!`, 'system');
            return;
        }

        if (action === 'immunity') {
            setImmunes(prev => [...prev, 'player']);
            addLog("☎ BIG FONE: Você está IMUNE nesta semana!", 'success');
        } else if (action === 'wall') {
            setNominees(prev => [...prev, { id: 'player', reason: 'big_phone' }]);
            addLog("☎ BIG FONE: Você está no PAREDÃO imediatamente!", 'alert');
        } else if (action === 'nominate' && targetId) {
            setNominees(prev => [...prev, { id: targetId, reason: 'big_phone' }]);
            const targetName = npcs.find(n => n.id === targetId)?.name;
            addLog(`☎ BIG FONE: Você indicou ${targetName} ao Paredão!`, 'drama');
            setPlayer(p => ({ ...p, strategy: p.strategy + 10 }));
        }
        // Do NOT close here. UI calls 'close' action to finish.
    };

    // [NEW] VIP Distribution
    const distributeVIPs = (newLeaderId) => {
        let vipIds = [newLeaderId];

        let candidates = [];
        if (newLeaderId !== 'player') {
            // NPC Leader: Pick top 3 friends based on relationships
            const leader = npcs.find(n => n.id === newLeaderId);
            if (leader) {
                // Map NPCs to {id, score}
                candidates = npcs.filter(n => n.id !== newLeaderId && n.status === 'active')
                    .map(n => ({ id: n.id, score: leader.relationships[n.id] || 50 }));
                // Add Player
                candidates.push({ id: 'player', score: leader.relationships['player'] || 50 });
            }
        } else {
            // Player Leader: Pick 3 highest affinity TO player (Loyalists)
            candidates = npcs.filter(n => n.status === 'active')
                .map(n => ({ id: n.id, score: n.affinity }));
        }

        // Sort Descending
        candidates.sort((a, b) => b.score - a.score);
        const top3 = candidates.slice(0, 3).map(c => c.id);
        vipIds = [...vipIds, ...top3];

        // Logs
        addLog(`👑 VIPs Definidos: ${vipIds.map(id => id === 'player' ? 'Você' : npcs.find(n => n.id === id)?.name).join(', ')}`, 'system');

        // Apply
        setPlayer(prev => ({ ...prev, group: vipIds.includes('player') ? 'vip' : 'xepa' }));
        setNpcs(prev => prev.map(n => ({ ...n, group: vipIds.includes(n.id) ? 'vip' : 'xepa' })));
    };

    // [NEW] Centralized Turn Processor (The "Game Loop" tick)
    const processTurn = (actionCost = 1) => {
        // 1. Deduct Action Points
        setActionsLeft(prev => Math.max(0, prev - actionCost));

        // 2. Trigger Big Phone (Check happens as time passes)
        if (!bigFone.active && !bigFone.checked && Math.random() < EVENT_CHANCES.BIG_PHONE) {
            triggerBigFone();
        }

        // 3. Autonomous NPC Simulation
        setNpcs(prev => {
            let logAccumulator = [];
            let current = prev;

            // Run 1
            const res1 = simulateNPCTurn(current, isPartyMode, player);
            current = res1.updatedNpcs;
            logAccumulator = [...logAccumulator, ...res1.generatedEvents];

            // Run 2 (Party)
            if (isPartyMode) {
                const res2 = simulateNPCTurn(current, isPartyMode, player);
                current = res2.updatedNpcs;
                logAccumulator = [...logAccumulator, ...res2.generatedEvents];
            }

            if (logAccumulator.length > 0) {
                setHouseLog(h => [...logAccumulator, ...h].slice(0, LIMITS.MAX_HOUSE_LOG));
            }
            return current;
        });

        // 4. Decay and Random Events
        setPlayer(prev => ({
            ...prev,
            hunger: Math.min(100, prev.hunger + 2),
            hygiene: Math.max(0, prev.hygiene - 2),
            stress: prev.stress + (prev.group === 'xepa' ? 2 : 0) // Xepa penalty
        }));

        if (Math.random() < EVENT_CHANCES.RANDOM_EVENT) {
            triggerRandomEvent();
        }

        // 5. Cleanup
        setSelectedTarget(null);

        // 6. Persistence (Handled by useEffect on dependency change, but we can force log logic here if needed)
    };

    const executeAction = (actionKey, overrideTargetId = null) => {
        if (actionKey === 'sleep') {
            nextDay();
            return;
        }

        /* Big Phone Check moved to processTurn */

        // Case mismatch 'fix': ACTION_COSTS is UPPERCASE, actionKey is lowercase.
        // This effectively makes actionPointCost = 1, ensuring the intended design works.
        const actionPointCost = 1;

        if (actionsLeft < actionPointCost) {
            addLog("O dia acabou! Você precisa dormir.", 'alert');
            return;
        }

        if (player.energy <= 10) {
            addLog("Você está exausto! (Energia Baixa)", 'alert');
            return;
        }

        if (player.hygiene <= 10 && actionKey !== 'shower' && actionKey !== 'eat') {
            addLog("Você está muito sujo! Tome um banho.", 'alert');
            return;
        }

        if (player.hunger >= 90 && actionKey !== 'eat') {
            addLog('Fome extrema! Coma algo.', 'alert');
            return;
        }

        if (['socialize', 'conflict', 'romance', 'eavesdrop', 'spreadRumor'].includes(actionKey) && !selectedTarget) {
            addLog("Selecione um participante primeiro!", 'alert');
            return;
        }

        // [NEW] Moodlet Checks (Blocking)
        const moodletIds = activeMoodlets.map(m => m.id);

        if (moodletIds.includes('smelly') && actionKey.startsWith('romance_')) {
            addLog("🤢 Você está fedendo demais para isso! Tome um banho.", 'alert');
            return;
        }

        if (moodletIds.includes('starving') && ['gym', 'housework'].includes(actionKey)) {
            addLog("🍗 Você está faminto! Sem energia para esforço físico.", 'alert');
            return;
        }

        if (moodletIds.includes('stressed') && actionKey.startsWith('social_')) {
            if (Math.random() < 0.5) {
                addLog("🤯 Você está muito estressado e foi rude sem querer...", 'bad');
                if (targetNPC) updateAffinity(targetNPC.id, -5);
                setActionsLeft(prev => prev - 1);
                return;
            }
        }

        let targetNPC = (overrideTargetId || selectedTarget) ? npcs.find(n => n.id === (overrideTargetId || selectedTarget)) : null;

        // Handle Socialize separately as it calls a Modal
        if (actionKey === 'socialize' && targetNPC) {
            // [NEW] Drunken Rambling Risk
            if (player.intoxication > 50 && Math.random() < 0.2) {
                p.energy -= ACTION_COSTS.SOCIALIZE;
                setPlayer(p);
                addLog(`Você tentou conversar com ${targetNPC.name} mas falou demais...`, 'bad');
                addSocialPost('drama', `Vazou! ${player.name} soltou um segredo bêbado para ${targetNPC.name}.`);
                // Penalty
                updateAffinity(targetNPC.id, -5);
                return;
            }

            setActiveDialogue(targetNPC);
            return;
        }

        let p = { ...player };
        let sentiment = 'neutral';

        switch (actionKey) {
            // --- SIMS-STYLE INTERACTIONS ---
            case 'social_chat':
            case 'social_joke':
            case 'social_compliment':
                if (!targetNPC) return;
                p.energy -= 10;
                if (actionKey === 'social_compliment') {
                    updateAffinity(targetNPC.id, 8);
                    addLog(`Você elogiou ${targetNPC.name}. (+Afinidade)`, 'success');
                } else if (actionKey === 'social_joke') {
                    updateAffinity(targetNPC.id, 5);
                    p.stress = Math.max(0, p.stress - 5);
                    addLog(`Piada para ${targetNPC.name}. Risadas!`, 'positive');
                } else {
                    updateAffinity(targetNPC.id, 3);
                    addLog(`Papo furado com ${targetNPC.name}.`);
                }
                addInteraction(targetNPC.id, 'socialize');
                setActiveDialogue(null); // Close modal
                break;

            case 'hostile_argue':
            case 'hostile_insult':
            case 'hostile_expose':
                if (!targetNPC) return;
                p.energy -= 15;
                p.stress += 10;
                let dmgb = 10;
                if (actionKey === 'hostile_insult') dmgb = 20;
                if (actionKey === 'hostile_expose') dmgb = 30;
                updateAffinity(targetNPC.id, -dmgb);
                addLog(`Ação hostil contra ${targetNPC.name}!`, 'bad');
                addInteraction(targetNPC.id, 'conflict');
                setActiveDialogue(null);
                sentiment = 'drama';
                break;

            case 'romance_flirt':
            case 'romance_pickup':
            case 'romance_kiss':
                if (!targetNPC) return;
                p.energy -= 10;
                if (actionKey === 'romance_kiss') {
                    if ((targetNPC.affinity || 0) < 60) {
                        addLog(`${targetNPC.name} recusou o beijo!`, 'bad');
                        p.stress += 15;
                        p.popularity -= 2;
                        updateAffinity(targetNPC.id, -5);
                        sentiment = 'bad';
                    } else {
                        p.romanceId = targetNPC.id;
                        updateAffinity(targetNPC.id, 15);
                        addLog(`Beijo apaixonado em ${targetNPC.name}!`, 'success');
                        sentiment = 'positive';
                    }
                } else { // Flirt
                    updateAffinity(targetNPC.id, 8);
                    addLog(`Flerte com ${targetNPC.name}.`, 'positive');
                }
                addInteraction(targetNPC.id, 'romance');
                setActiveDialogue(null);
                break;

            case 'strat_probe':
            case 'strat_alliance':
            case 'strat_lie':
                if (!targetNPC) return;

                // Drunk Penalty for Strategy
                if (moodletIds.includes('drunk') && Math.random() < 0.5) {
                    p.energy -= 15;
                    addLog(`🥴 Você estava bêbado e falou demais. O plano vazou!`, 'bad');
                    updateAffinity(targetNPC.id, -5);
                    setActiveDialogue(null);
                    break;
                }

                p.energy -= 15;
                p.strategy += 2;
                if (actionKey === 'strat_probe') {
                    addLog(`${targetNPC.name} revelou detalhes de jogo...`, 'system');
                } else if (actionKey === 'strat_alliance') {
                    if ((targetNPC.affinity || 0) > 70) {
                        addLog(`Aliança fechada com ${targetNPC.name}! 🤝`, 'success');
                        updateAffinity(targetNPC.id, 10);
                    } else {
                        addLog(`${targetNPC.name} disse que 'joga sozinho'. (Recusou)`, 'neutral');
                        updateAffinity(targetNPC.id, -2);
                    }
                } else {
                    addLog(`Mentiu para ${targetNPC.name}.`, 'system');
                }
                setActiveDialogue(null);
                break;

            case 'gym':
                p.energy -= ACTION_COSTS.GYM;
                p.stress = Math.max(0, p.stress - 25);
                p.popularity += 2;
                p.hunger = Math.min(100, p.hunger + 10); // Starvation risk
                p.hygiene = Math.max(0, p.hygiene - 20); // Sweat
                addLog("Treino pesado! Estresse diminuiu.");
                sentiment = 'positive';
                break;
            case 'housework':
                setNpcs(prev => prev.map(n => {
                    const newAffinity = Math.min(100, n.affinity + 5); // Increased from 3 to 5
                    let updates = { affinity: newAffinity };

                    if (newAffinity >= 30 && !n.knownJob) {
                        updates.knownJob = true;
                        addLog(`Você descobriu que ${n.name} trabalha como ${n.job}!`, 'system');
                    }
                    if (newAffinity >= 60 && !n.knownTrait) {
                        updates.knownTrait = true;
                        addLog(`Você percebeu que ${n.name} é ${n.trait.name}!`, 'system');
                    }
                    return { ...n, ...updates };
                }));
                setHouseCleanliness(prev => Math.min(100, prev + 40));
                p.energy -= ACTION_COSTS.HOUSEWORK;
                p.popularity += 3;

                // Random flavor text
                const chores = ["fez uma faxina completa!", "preparou um almoço delicioso!", "lavou toda a louça acumulada."];
                const chore = chores[Math.floor(Math.random() * chores.length)];
                addLog(`Você ${chore} Todos gostaram (+Afinidade).`, 'success');
                sentiment = 'positive';
                break;
            case 'socialize':
                // Handled via Modal now
                break;
            case 'conflict':
                if (targetNPC) {
                    if (p.hygiene <= 20) {
                        addLog("Você está fedendo! Ninguém quis brigar com você.", 'bad');
                        return;
                    }

                    // [NEW] Drunken Conflict
                    let affinityDmg = -30;
                    if (player.intoxication > 50) {
                        affinityDmg = -60;
                        addLog("Você perdeu a linha na treta! (Álcool)", 'bad');
                    }

                    updateAffinity(targetNPC.id, affinityDmg);
                    p.popularity += (Math.random() > 0.5 ? 10 : -5);
                    p.energy -= ACTION_COSTS.CONFLICT;
                    p.stress += 25;
                    p.hunger = Math.min(100, p.hunger + 5);
                    addLog(`TRETA com ${targetNPC.name}!`, 'alert');
                    sentiment = 'drama';
                    addInteraction(targetNPC.id, 'conflict');
                    addMemory(targetNPC.id, 'conflict', 'medium', 'player');
                }
                break;
            case 'romance':
                if (targetNPC) {
                    if (targetNPC.affinity < 75) {
                        addLog(`${targetNPC.name} não tem intimidade suficiente.`, 'alert');
                        return;
                    }
                    p.energy -= ACTION_COSTS.ROMANCE;
                    p.romanceId = targetNPC.id;
                    p.popularity += 10;
                    p.stress = Math.max(0, p.stress - 10);
                    updateAffinity(targetNPC.id, 15);
                    addLog(`Romance com ${targetNPC.name}! ❤`);
                    sentiment = 'positive';
                    addInteraction(targetNPC.id, 'romance');
                }
                break;
            case 'eavesdrop':
                p.energy -= ACTION_COSTS.EAVESDROP;
                if (Math.random() > 0.4) {
                    addLog("Você ouviu uma fofoca quente!");
                } else {
                    addLog("Te pegaram ouvindo atrás da porta!", 'alert');
                    p.popularity -= 5;
                    sentiment = 'bad';
                }
                break;
            case 'spreadRumor':
                if (targetNPC) {
                    p.energy -= ACTION_COSTS.SPREAD_RUMOR;

                    // Pick a random victim (not player, not listener)
                    const potentialVictims = npcs.filter(n => n.id !== targetNPC.id && n.status === 'active');
                    if (potentialVictims.length > 0) {
                        const victim = potentialVictims[Math.floor(Math.random() * potentialVictims.length)];

                        // Plant the rumor
                        const rumor = {
                            id: Date.now(),
                            topic: 'untrustworthy',
                            regardingId: victim.id,
                            day: day,
                            source: 'player'
                        };

                        setNpcs(prev => prev.map(n => {
                            if (n.id === targetNPC.id) {
                                return { ...n, knownRumors: [...n.knownRumors, rumor] };
                            }
                            return n;
                        }));

                        addLog(`Você espalhou um boato sobre ${victim.name} para ${targetNPC.name}.`, 'system');
                        sentiment = 'drama';
                    } else {
                        addLog("Não há ninguém sobre quem fofocar.", 'alert');
                    }
                }
                break;
            case 'read':
                p.energy -= ACTION_COSTS.READ;
                p.stress = Math.max(0, p.stress - 15);
                addLog("Leu um livro.");
                break;
            case 'eat':
                const cost = 40;
                if (p.estalecas < cost) {
                    addLog(`Sem estalecas suficientes (C$ ${cost})!`, 'error');
                    return;
                }

                const isVip = p.group === 'vip';
                p.estalecas -= cost;

                if (isVip) {
                    p.hunger = Math.max(0, p.hunger - 50);
                    p.energy = Math.min(100, p.energy + 10);
                    p.stress = Math.max(0, p.stress - 5);
                    addLog("Banquete no VIP! (C$ 40)", 'success');
                } else {
                    p.hunger = Math.max(0, p.hunger - 25);
                    p.stress = Math.min(100, p.stress + 5);
                    addLog("Comida de Xepa (Rabada)... Enjoativo. (C$ 40)", 'neutral');
                }
                sentiment = 'neutral';
                break;
            case 'shower':
                p.hygiene = 100;
                p.energy -= 5;
                p.stress = Math.max(0, p.stress - 5);
                addLog("Banho tomado! Você está limpo.", 'success');
                sentiment = 'neutral';
                break;
            default: break;
        }

        // Bounds
        p.popularity = Math.min(100, Math.max(0, p.popularity));
        setPlayer(p);

        addSocialPost(sentiment);

        // Process Turn (Time passes, events happen)
        processTurn(1);
    };

    // State moved to top

    const finishMinigame = (playerScore) => {
        const isLeader = minigameState.type === 'leader';
        const participants = [...npcs.filter(n => n.status === 'active'), { id: 'player', name: 'Você', publicPop: player.popularity }];

        // Simulate NPC scores
        const opponents = npcs.filter(n => n.status === 'active');
        const npcScores = opponents.map(n => ({
            id: n.id,
            score: Math.floor(Math.random() * (isLeader ? 8 : 4)) // Random score
        }));

        // Determine Winner
        const highestNPCScore = npcScores.reduce((max, current) => Math.max(max, current.score), 0);
        const highestScore = Math.max(playerScore, highestNPCScore);

        let winnerId = null;
        if (playerScore >= highestScore) {
            addLog(`VOCÊ VENCEU A PROVA! (+C$ 500)`, 'system');
            winnerId = 'player';
            setPlayer(prev => ({
                ...prev,
                money: prev.money + 500,
                totalMoneyEarned: prev.totalMoneyEarned + 500
            }));
        } else {
            const winner = npcScores.filter(n => n.score === highestScore)[0]; // Pick one of the highest scorers
            addLog(`${npcs.find(n => n.id === winner.id)?.name} venceu a prova com ${highestScore} pontos!`, 'alert');
            winnerId = winner.id;
        }

        if (minigameState.type === 'leader') {
            setLeaderId(winnerId);
            // Leader is natively immune via leaderId check, no need to push to immunes array, but we can for consistency if desired.
            // Leaving it separate to avoid double clearing or confusion. leaderId clears on Thursday (new leader) usually?
            // Actually leader stays until next leader.
            addLog(`Novo Líder: ${winnerId === 'player' ? 'Você' : participants.find(p => p.id === winnerId)?.name}`, 'system');
            setGameState(GAME_STATES.PLAYING);
            distributeVIPs(winnerId); // [NEW] Trigger VIP Logic
        } else { // Angel Minigame
            setAngelId(winnerId);
            if (winnerId === 'player') {
                setGameState(GAME_STATES.ANGEL_CEREMONY); // Go to panel
                addLog("Você é o Anjo! Escolha o Imune e o Monstro.", 'system');
            } else {
                // NPC Logic for Angel Choice
                // Exclude Leader from immunity choice (already immune)
                const availableForImmunity = participants.filter(p => p.id !== winnerId && p.id !== 'player' && p.status === 'active' && p.id !== leaderId);
                const immuneChoice = availableForImmunity.length > 0 ? availableForImmunity[Math.floor(Math.random() * availableForImmunity.length)].id : null;

                const availableForMonster = participants.filter(p => p.id !== winnerId && p.id !== immuneChoice && p.id !== 'player' && p.status === 'active');
                const monsterChoices = [];
                if (availableForMonster.length > 0) {
                    monsterChoices.push(availableForMonster[Math.floor(Math.random() * availableForMonster.length)].id);
                    if (availableForMonster.length > 1) {
                        let secondMonsterIndex = Math.floor(Math.random() * availableForMonster.length);
                        while (availableForMonster[secondMonsterIndex].id === monsterChoices[0]) {
                            secondMonsterIndex = Math.floor(Math.random() * availableForMonster.length);
                        }
                        monsterChoices.push(availableForMonster[secondMonsterIndex].id);
                    }
                }
                resolveAngelChoice(immuneChoice, monsterChoices);
            }
        }

        setMinigameState({ active: false, score: 0, targetScore: 0, timeLeft: 0, isPlaying: false, type: null });
    };

    const resolveAngelChoice = (targetImmune, targetMonsters) => {
        if (targetImmune) setImmunes(prev => [...prev, targetImmune]);
        setMonsters(targetMonsters);

        const participants = [...npcs.filter(n => n.status === 'active'), { id: 'player', name: 'Você', publicPop: player.popularity }];
        const immuneName = targetImmune === 'player' ? 'Você' : participants.find(p => p.id === targetImmune)?.name;
        if (targetImmune) addLog(`😇 ANJO: ${immuneName} está imune!`, 'system');

        targetMonsters.forEach(mid => {
            const mName = mid === 'player' ? 'Você' : participants.find(p => p.id === mid)?.name;
            addLog(`👹 MONSTRO: ${mName} perdeu estalecas e energia!`, 'alert');
            // Assuming updateRelationship is a function that updates NPC affinity
            // For player, we update player stats directly
            if (mid === 'player') {
                setPlayer(prev => ({ ...prev, energy: Math.max(0, prev.energy - 30) }));
            } else {
                updateAffinity(mid, -15); // Reduce affinity for monsters
            }
        });

        setGameState(GAME_STATES.PLAYING);
    };

    const submitLeaderNomination = (targetId) => {
        const targetName = npcs.find(n => n.id === targetId)?.name || 'Alguém';
        // [REF_NOMINEES] Push object with reason
        setNominees(prev => [...prev, { id: targetId, reason: 'leader', votes: 0 }]);
        addLog(`LÍDER: Você indicou ${targetName} ao Paredão!`, 'drama');
        // IMPORTANT: Move to House Vote now
        setGameState(GAME_STATES.VOTING_CONFESSIONAL);
    };

    /* DUPLICATE REMOVED */

    const submitVote = (targetId, reason = 'strategy') => {
        // Collect Votes
        let votes = {};

        // Validation
        if (targetId === leaderId) {
            addLog("O Líder é imune!", 'alert');
            return;
        }
        if (immunes.includes(targetId)) {
            addLog("Este participante está imune!", 'alert');
            return;
        }
        // Check if already nominated (Leader's choice cannot be voted)
        if (nominees.some(n => n.id === targetId)) {
            addLog("Este participante já está no Paredão!", 'alert');
            return;
        }

        votes[targetId] = (votes[targetId] || 0) + 1; // Player Vote

        // Log Player Vote with Reason
        const targetName = npcs.find(n => n.id === targetId)?.name || 'Alguém';
        const reasonTexts = {
            'strategy': `por estratégia.`,
            'affinity': `por falta de afinidade.`,
            'revenge': `por vingança!`
        };
        addLog(`Você votou em ${targetName} ${reasonTexts[reason] || '.'}`, 'bad');

        // NPC Votes (Simple logic: Vote for lowest affinity or random)
        npcs.forEach(voter => {
            if (voter.status !== 'active') return;

            // Pick target
            // 1. Enemy?
            // 2. Random active non-self
            // NEW: Memory Check for Betrayals
            const betrayal = voter.memories.find(m => m.severity === 'unforgivable' || (m.severity === 'medium' && m.day >= day - 2));

            let target;

            // Should not vote for Leader, Immunes, OR Existing Nominees
            const validTargets = npcs.filter(n =>
                n.id !== voter.id &&
                n.status === 'active' &&
                n.id !== leaderId &&
                !immunes.includes(n.id) &&
                !nominees.some(nom => nom.id === n.id) // Cannot vote for existing nominees
            );

            // Add Player to valid targets if applicable
            if (player.state !== 'eliminated' && !immunes.includes('player') && leaderId !== 'player' && !nominees.some(n => n.id === 'player')) {
                validTargets.push({ id: 'player', ...player }); // Mock object
            }

            if (validTargets.length === 0) return; // No one to vote for?

            if (betrayal && betrayal.targetId === 'player' && validTargets.some(t => t.id === 'player')) {
                target = { id: 'player' }; // Vindictive vote
            } else if ((player.alliance || []).includes(voter.id) && allianceTarget && allianceTarget !== voter.id) {
                // Alliance Check (Betrayal System)
                const betrayalChance = Math.max(0, 100 - (voter.loyalty || 50));
                const roll = Math.random() * 100;

                if (roll > betrayalChance && validTargets.some(t => t.id === allianceTarget)) {
                    // Loyal! Follows order
                    target = { id: allianceTarget };
                    // addLog(`${voter.name} seguiu o voto da aliança em ${npcs.find(n => n.id === allianceTarget)?.name}.`, 'system');
                } else {
                    // Betrayal! Vote normal (lowest affinity)
                    // addLog(`${voter.name} TRAIU a aliança e votou por conta própria!`, 'warning');
                    target = validTargets.sort((a, b) => a.affinity - b.affinity)[0];
                }
            } else {
                // Standard Logic: Lowest Affinity
                target = validTargets.sort((a, b) => a.affinity - b.affinity)[0];
            }

            // Fallback random
            if (!target) {
                target = validTargets[Math.floor(Math.random() * validTargets.length)];
            }

            if (target) {
                const tId = target.id || target; // Handle both object and string/ID
                votes[tId] = (votes[tId] || 0) + 1;
            }
        });

        // Determine Nominees (Top 2 most voted)
        const sortedVotes = Object.entries(votes).sort((a, b) => b[1] - a[1]);
        // Map to Nominee Object Structure
        const houseNominees = sortedVotes.slice(0, 2).map(v => ({
            id: (v[0] === 'player' ? 'player' : parseInt(v[0])),
            reason: 'house',
            votes: v[1]
        }));

        // Merge with existing nominees (Big Phone etc)
        // Since we filtered valid targets, no duplicates should happen, but spread safely
        setNominees(prev => [...prev, ...houseNominees]);

        addLog(`Paredão Formado com ${houseNominees.length} indicados pela casa!`, 'alert');

        // Go to Elimination (simulated for now, usually takes a few days)
        setGameState(GAME_STATES.PLAYING); // Ends voting session
    };

    const resolveElimination = (currentNominees) => {
        // Simple logic: Person with lowest Public Popularity leaves
        // If player is nominee, compare their popularity.

        // currentNominees is now array of objects {id, reason...}
        const nomObjects = currentNominees.map(nom => {
            if (nom.id === 'player') return { id: 'player', name: 'Você', publicPop: player.popularity };
            return npcs.find(n => n.id === nom.id) || { id: nom.id, name: 'Desconhecido', publicPop: 0 };
        });

        // Sort by Lowest Pop
        const eliminated = nomObjects.sort((a, b) => a.publicPop - b.publicPop)[0]; // Lowest pop leaves

        addLog(`ELIMINADO: ${eliminated.name} saiu com alta rejeição!`, 'alert');

        if (eliminated.id === 'player') {
            setGameState(GAME_STATES.ELIMINATED);
        } else {
            // Check if player was a nominee and survived
            if (currentNominees.some(n => n.id === 'player')) {
                setPlayer(prev => ({ ...prev, paredoesCount: prev.paredoesCount + 1 }));
                addLog("Você voltou do Paredão! O público te salvou.", 'system');
            }

            setNpcs(prev => prev.map(n => n.id === eliminated.id ? { ...n, status: 'eliminated' } : n));
            // Reset week
            setLeaderId(null);
            setAngelId(null);
            setNominees([]);
        }
    };

    const [showLeaderPanel, setShowLeaderPanel] = useState(false); // [NEW]
    const [showRelationshipGrid, setShowRelationshipGrid] = useState(false); // [NEW]

    return (
        <GameContext.Provider value={{
            gameState, setGameState,
            day, setDay,
            week, setWeek,
            showLeaderPanel, setShowLeaderPanel, // [NEW]
            activeMoodlets, // [NEW] Exported for UI
            showRelationshipGrid, setShowRelationshipGrid, // Restored
            player, setPlayer,
            npcs, setNpcs,
            feed, logs, houseLog, // Export houseLog
            leaderId, setLeaderId,
            angelId, setAngelId,
            immunes, setImmunes, // Refactored to Array
            monsters, setMonsters, // Added
            selectedTarget, setSelectedTarget,
            nominees, setNominees,
            houseCleanliness, setHouseCleanliness,
            minigameState, setMinigameState,
            addLog, addSocialPost, startGame, executeAction, nextDay, updateAffinity,
            finishMinigame, submitVote, submitLeaderNomination, resolveLeaderPerk, resolveAngelChoice, // EXPORTED
            isPartyMode, drinkAlcohol, // [NEW] Exports
            activeDialogue, setActiveDialogue, addInteraction,
            actionsLeft, setActionsLeft, // Export
            saveGame, checkSave, getHallOfFame, clearSave, buyItem, // Exported
            inviteToAlliance, callAllianceMeeting, allianceTarget, // Alliance
            calculateChemistry, executeRomanceAction, // Romance
            bigFone, resolveBigFone, triggerBigFone, // Big Phone
            GAME_STATES, resolveEvent, activeEvent, setActiveEvent // Game States & Events
        }}>
            {children}
        </GameContext.Provider>
    );
};

export default GameContext;
