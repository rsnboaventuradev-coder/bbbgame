import { NPC_BEHAVIOR, PARTY_MODE } from './constants';

export const simulateNPCTurn = (currentNpcs, isPartyMode, player) => {
    let updates = JSON.parse(JSON.stringify(currentNpcs)); // Deep copy to avoid mutation
    let newEvents = [];

    const activeNpcs = updates.filter(n => n.status === 'active' && n.id !== 'player');
    if (activeNpcs.length < 2) return { updatedNpcs: updates, generatedEvents: [] };

    // Pick 1-3 NPCs to act this turn
    const numActors = Math.min(Math.floor(Math.random() * 3) + 1, activeNpcs.length);
    const actors = activeNpcs.sort(() => 0.5 - Math.random()).slice(0, numActors);

    actors.forEach(actor => {
        const trait = actor.trait;
        const behaviors = trait.behaviors || {};
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Determine action type based on personality
        const roll = Math.random();

        // SPONTANEOUS TRAIT-SPECIFIC ACTIONS
        if (trait.autonomousActions && roll < NPC_BEHAVIOR.AUTONOMOUS_ACTION_CHANCE) {
            const action = trait.autonomousActions[Math.floor(Math.random() * trait.autonomousActions.length)];
            const safeId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            switch (action) {
                case 'cry_alone':
                    newEvents.push({
                        id: safeId,
                        time,
                        type: 'emotional',
                        text: `${actor.name} foi chorar sozinho no quarto.`,
                        detail: "Momento emotivo."
                    });
                    actor.publicPop = Math.min(100, (actor.publicPop || 50) + 5);
                    break;
                case 'start_argument':
                    const victim = activeNpcs.filter(n => n.id !== actor.id)[Math.floor(Math.random() * (activeNpcs.length - 1))];
                    if (victim) {
                        newEvents.push({
                            id: safeId,
                            time,
                            type: 'conflict',
                            text: `${actor.name} começou uma BRIGA com ${victim.name} do nada!`,
                            detail: "Barraco formado!"
                        });
                        if (!actor.relationships) actor.relationships = {};
                        if (!victim.relationships) victim.relationships = {};
                        actor.relationships[victim.id] = Math.max(0, (actor.relationships[victim.id] || 50) - 20);
                        victim.relationships[actor.id] = Math.max(0, (victim.relationships[actor.id] || 50) - 20);
                        actor.publicPop = Math.min(100, (actor.publicPop || 50) + 10);
                    }
                    break;
                case 'train_alone':
                    newEvents.push({
                        id: safeId,
                        time,
                        type: 'activity',
                        text: `${actor.name} está treinando intensamente.`,
                        detail: "Foco total."
                    });
                    break;
                case 'flirt_target':
                    const crush = activeNpcs.filter(n => n.id !== actor.id && (actor.relationships?.[n.id] || 50) > 70)[0];
                    if (crush) {
                        newEvents.push({
                            id: safeId,
                            time,
                            type: 'romance',
                            text: `${actor.name} está jogando charme em ${crush.name}...`,
                            detail: "Clima de romance!"
                        });
                        actor.relationships[crush.id] = Math.min(100, (actor.relationships[crush.id] || 50) + 5);
                        crush.relationships[actor.id] = Math.min(100, (crush.relationships[actor.id] || 50) + 2);
                    }
                    break;
                case 'spread_rumor':
                    const target = activeNpcs.filter(n => n.id !== actor.id)[Math.floor(Math.random() * (activeNpcs.length - 1))];
                    if (target) {
                        newEvents.push({
                            id: safeId,
                            time,
                            type: 'gossip',
                            text: `${actor.name} está espalhando fofoca sobre ${target.name}...`,
                            detail: "Intriga na casa!"
                        });
                    }
                    break;
                case 'mediate_fight':
                    newEvents.push({
                        id: safeId,
                        time,
                        type: 'social',
                        text: `${actor.name} tentou acalmar os ânimos.`,
                        detail: "Pacificador."
                    });
                    actor.publicPop = Math.min(100, (actor.publicPop || 50) + 5);
                    break;
                case 'avoid_camera':
                    newEvents.push({
                        id: safeId,
                        time,
                        type: 'neutral',
                        text: `${actor.name} está sumido... modo planta.`,
                        detail: "Escondido."
                    });
                    actor.publicPop = Math.max(0, (actor.publicPop || 50) - 5);
                    break;
                case 'betray_ally':
                    const ally = activeNpcs.find(n => (player?.alliance || []).includes(n.id) && n.id !== actor.id);
                    if (ally) {
                        newEvents.push({
                            id: safeId,
                            time,
                            type: 'drama',
                            text: `${actor.name} TRAIU ${ally.name} pelas costas!`,
                            detail: "Traição!"
                        });
                        actor.relationships[ally.id] = Math.max(0, (actor.relationships[ally.id] || 50) - 30);
                    }
                    break;
                default: break;
            }
            return; // Skip standard interaction
        }

        // --- STANDARD INTERACTION ---
        const targets = activeNpcs.filter(n => n.id !== actor.id);
        if (targets.length === 0) return;

        const target = targets[Math.floor(Math.random() * targets.length)];
        const currentAffinity = actor.relationships?.[target.id] || 50;
        const eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Conflict Chance
        let conflictChance = behaviors.conflictChance || 0.1;
        if (currentAffinity < 30) conflictChance += 0.2;
        if (isPartyMode) conflictChance += 0.2;

        const isConflict = Math.random() < conflictChance;

        if (!actor.relationships) actor.relationships = {};
        if (!target.relationships) target.relationships = {};

        if (isConflict) {
            const conflictMsgs = [
                `provocou ${target.name}.`,
                `discutiu com ${target.name}.`,
                `criticou ${target.name}.`
            ];
            const msg = conflictMsgs[Math.floor(Math.random() * conflictMsgs.length)];

            actor.relationships[target.id] = Math.max(0, (actor.relationships[target.id] || 50) - 10);
            target.relationships[actor.id] = Math.max(0, (target.relationships[actor.id] || 50) - 10);

            newEvents.push({
                id: eventId,
                time,
                type: 'conflict',
                text: `${actor.name} ${msg}`,
                detail: "Afinidade caiu."
            });
        } else {
            const socialMsgs = [
                `conversou com ${target.name}.`,
                `elogiou ${target.name}.`,
                `riu com ${target.name}.`
            ];
            const msg = socialMsgs[Math.floor(Math.random() * socialMsgs.length)];

            actor.relationships[target.id] = Math.min(100, (actor.relationships[target.id] || 50) + 5);
            target.relationships[actor.id] = Math.min(100, (target.relationships[actor.id] || 50) + 5);

            newEvents.push({
                id: eventId,
                time,
                type: 'social',
                text: `${actor.name} ${msg}`,
                detail: "Estão se aproximando."
            });
        }
    });

    // PARTY CHAOS
    if (isPartyMode && Math.random() > 0.4) {
        const randomActor = activeNpcs[Math.floor(Math.random() * activeNpcs.length)];
        if (randomActor) {
            const chaosId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            if (Math.random() > 0.5) {
                newEvents.push({
                    id: chaosId,
                    time,
                    type: 'fun',
                    text: `${randomActor.name} subiu na mesa para dançar!`,
                    detail: "Vibes."
                });
            } else {
                newEvents.push({
                    id: chaosId,
                    time,
                    type: 'drama',
                    text: `${randomActor.name} começou a chorar de bêbado.`,
                    detail: "Cena de festa."
                });
            }
        }
    }

    return { updatedNpcs: updates, generatedEvents: newEvents };
};
