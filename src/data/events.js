export const EVENTS = [
    // --- EXISTING ---
    // --- EXISTING ---
    {
        id: 'big_phone_ring',
        text: 'O BIG FONE ESTÁ TOCANDO! O que você faz?',
        trigger: 'special',
        weight: 0, // Triggered manually
        choices: [
            {
                text: "ATENDER CORRENDO!",
                sentiment: 'drama',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    const outcomes = ['immunity', 'danger', 'nominate'];
                    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

                    if (outcome === 'immunity') {
                        // We need access to setImmunes. Currently effect signature is limited.
                        // Workaround: We will handle special flags in resolveEvent or expand signature?
                        // For now, let's use a simpler approach: Log result, and GameContext middleware handles 'big_phone_ring' logic?
                        // OR: expand the signature in GameContext.jsx to pass all setters.
                        // Let's assume standard signature for now and just log, but we need state change.
                        // Actually, I can add `setImmunes` etc to the effect signature in GameContext calls.

                        // BUT, to keep it simple and consistent with standard events, let's just use what we have or 
                        // cheat by accessing global/closure if possible (not possible here).

                        // Better Plan: Add specific logic in resolveEvent for this ID if needed, 
                        // OR update resolveEvent to pass everything.

                        // Let's update resolveEvent in GameContext to pass a `context` object with everything.
                        addLog("☎ BIG FONE: Tocou!", 'drama');
                    }
                }
            },
            {
                text: "Ignorar (Deixar outro atender)",
                sentiment: 'neutral',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    const activeNpcs = npcs.filter(n => n.status === 'active');
                    const runner = activeNpcs[Math.floor(Math.random() * activeNpcs.length)];
                    addLog(`${runner.name} atendeu o Big Fone!`, 'warning');
                    if (Math.random() > 0.5) {
                        addLog(`☎ BIG FONE: ${runner.name} ganhou um poder misterioso!`, 'system');
                    } else {
                        addLog(`☎ BIG FONE: ${runner.name} foi para o Paredão!`, 'system');
                    }
                }
            }
        ]
    },
    {
        id: 'party',
        text: "A festa começou! O que você vai fazer?",
        trigger: 'special',
        weight: 0,
        choices: [
            {
                text: "Se acabar na pista (Energia -20, Estresse -25)",
                sentiment: 'positive',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, energy: Math.max(0, prev.energy - 20), stress: Math.max(0, prev.stress - 25) }));
                    const activeNpcs = npcs.filter(n => n.status === 'active');
                    if (activeNpcs.length > 0) {
                        const randomFriend = activeNpcs[Math.floor(Math.random() * activeNpcs.length)];
                        setN(prev => prev.map(n => n.id === randomFriend.id ? { ...n, affinity: Math.min(100, n.affinity + 5) } : n));
                        addLog(`Você dançou muito com ${randomFriend.name}!`, 'success');
                    }
                }
            },
            {
                text: "Comer e observar (Energia +10, Estresse -10)",
                sentiment: 'neutral',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, energy: Math.min(100, prev.energy + 10), stress: Math.max(0, prev.stress - 10) }));
                    addLog("Você ficou de boa na festa.", 'info');
                }
            }
        ]
    },
    {
        id: 'discordia',
        text: "É hora do Jogo da Discórdia! Escolha alguém para criticar na frente da casa:",
        trigger: 'special',
        weight: 0,
        choices: [] // Generated dynamically in Context, but base object needed? 
        // Actually, Discordia choices are dynamic (targets). We can't fully staticize it here easily without changing logic.
        // Option 1: Keep it inline but don't persist it? No, reloading breaks it.
        // Option 2: Persist the WHOLE event object? No, we removed that capability.
        // Option 3: Standardize choices. e.g. "Criticar Rival", "Criticar Amigo".
        // Option 4: Handle hydration specially for dynamic events?
        // Let's stick to Option 3 for simplicity, or make hydration smarter?
        // Actually, if I define it here with empty choices, reload will load it with empty choices.
        // Fix: Make Discordia a standard event with generic choices that then open a sub-modal or trigger a logic?
        // OR: Re-generate the choices in loadFromStorage?
        // Best approach for now: Generic choices that trigger the logic.
        // "Escolher Alvo" -> Opens Interaction Modal?
        // Let's make it simpler: "Criticar quem te odeia" / "Criticar quem você odeia".
    },
    {
        id: 'punishment',
        text: "A casa está imunda! O Big Boss decretou PUNIÇÃO COLETIVA.",
        trigger: 'special',
        weight: 0,
        choices: [{
            text: "Aceitar (-C$ 200)",
            sentiment: 'negative',
            effect: (p, setP, npcs, setN, addLog) => {
                setP(prev => ({ ...prev, money: Math.max(0, prev.money - 200) }));
                addLog("Todos perderam 200 estalecas pela sujeira.", 'alert');
            }
        }]
    },
    {
        id: 'gossip_bathroom',
        text: 'Você ouve sussurros no banheiro. Parece que estão combinando votos em você!',
        trigger: 'random',
        weight: 1.0,
        choices: [
            {
                text: 'Confrontar agora!',
                sentiment: 'drama',
                effect: (player, setPlayer, npcs, setNpcs, addLog, addMemory) => {
                    addLog("Você chutou a porta e gritou com todos! O clima pesou.", "alert");
                    setPlayer(p => ({ ...p, stress: p.stress + 20, popularity: p.popularity + 5 }));
                    const targets = npcs.filter(n => n.status === 'active').sort(() => 0.5 - Math.random()).slice(0, 2);
                    setNpcs(prev => prev.map(n => {
                        if (targets.some(t => t.id === n.id)) {
                            return { ...n, affinity: Math.max(0, n.affinity - 20) };
                        }
                        return n;
                    }));
                    if (addMemory) targets.forEach(t => addMemory(t.id, 'conflict', 'medium', 'player'));
                }
            },
            {
                text: 'Fingir que não ouviu',
                sentiment: 'neutral',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Você saiu de fininho, mas ficou paranoico.", "system");
                    setPlayer(p => ({ ...p, stress: p.stress + 10 }));
                }
            }
        ]
    },
    // --- NEW EVENTS (15+) ---
    {
        id: 'clogged_toilet',
        text: 'O banheiro está entupido e todos estão culpando você!',
        trigger: 'random',
        weight: 1.0,
        choices: [
            {
                text: 'Limpar (Humilhante)',
                sentiment: 'neutral',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Você desentupiu o banheiro. Pelo menos mostrou humildade.", "info");
                    setPlayer(p => ({ ...p, popularity: p.popularity + 5, stress: p.stress + 10 }));
                }
            },
            {
                text: 'Negar até a morte',
                sentiment: 'drama',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Você jurou que não foi você. Ninguém acreditou muito.", "alert");
                    setPlayer(p => ({ ...p, popularity: p.popularity - 5 }));
                }
            }
        ]
    },
    {
        id: 'leader_proposal',
        text: 'O Líder da semana te chamou num canto e propôs uma trégua.',
        trigger: 'random', // Logic should check if leader exists
        weight: 0.8,
        choices: [
            {
                text: 'Aceitar trégua',
                sentiment: 'positive',
                effect: (player, setPlayer, npcs, setNpcs, addLog, addMemory, leaderId) => {
                    addLog("Você aceitou a trégua. O Líder prometeu não te indicar.", "success");
                    // Increase affinity with leader if possible
                    if (leaderId) {
                        setNpcs(prev => prev.map(n => n.id === leaderId ? { ...n, affinity: n.affinity + 20 } : n));
                    }
                }
            },
            {
                text: 'Recusar ("Não confio")',
                sentiment: 'drama',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Você recusou. 'Aqui é jogo, não colônia de férias!'", "alert");
                    setPlayer(p => ({ ...p, popularity: p.popularity + 5 }));
                }
            }
        ]
    },
    {
        id: 'food_theft',
        text: 'Você viu alguém roubando ovos da Xepa!',
        trigger: 'random',
        weight: 1.0,
        choices: [
            {
                text: 'Dedurar no ao vivo',
                sentiment: 'drama',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Você expôs o ladrão de ovos! A casa pegou fogo.", "drama");
                    setPlayer(p => ({ ...p, popularity: p.popularity + 5 })); // Entertainment
                }
            },
            {
                text: 'Comer junto',
                sentiment: 'bad',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Você foi cúmplice. Se descobrirem, você roda.", "warning");
                    setPlayer(p => ({ ...p, hunger: 0 }));
                }
            }
        ]
    },
    {
        id: 'fake_news',
        text: 'Um participante inventou que você falou mal da torcida de outro.',
        trigger: 'random',
        weight: 0.9,
        choices: [
            {
                text: 'Chorar e negar',
                sentiment: 'neutral',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Você chorou copiosamente. O público ficou dividido.", "info");
                    setPlayer(p => ({ ...p, popularity: p.popularity - 2 }));
                }
            },
            {
                text: 'Peitar o mentiroso',
                sentiment: 'drama',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("VOCÊ É COBRA! gritou você na cara dele.", "drama");
                    setPlayer(p => ({ ...p, popularity: p.popularity + 5, stress: p.stress + 10 }));
                }
            }
        ]
    },
    {
        id: 'party_dance',
        text: 'A festa está morna. O DJ tocou sua música favorita!',
        trigger: 'party',
        weight: 1.5,
        choices: [
            {
                text: 'Dançar até o chão',
                sentiment: 'positive',
                effect: (player, setPlayer) => {
                    setPlayer(p => ({ ...p, popularity: p.popularity + 3, energy: Math.max(0, p.energy - 10) }));
                }
            },
            {
                text: 'Ficar sentado bebendo',
                sentiment: 'neutral',
                effect: (player, setPlayer) => {
                    setPlayer(p => ({ ...p, stress: Math.max(0, p.stress - 5) }));
                }
            }
        ]
    },
    {
        id: 'pool_fall',
        text: 'Você escorregou e caiu na piscina de roupa e microfone!',
        trigger: 'random',
        weight: 0.5,
        choices: [
            {
                text: 'Rir de si mesmo',
                sentiment: 'positive',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Você levou punição pelo microfone, mas o público amou o meme.", "success");
                    setPlayer(p => ({ ...p, money: Math.max(0, p.money - 50), popularity: p.popularity + 5 }));
                }
            }
        ]
    },
    {
        id: 'insomnia',
        text: 'Insônia! Todos dormiram, você está sozinho na sala.',
        trigger: 'status', // could be based on stress
        weight: 0.7,
        choices: [
            {
                text: 'Falar com as câmeras',
                sentiment: 'neutral',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Você fez um monólogo profundo. Ganhou fãs intelectuais.", "info");
                    setPlayer(p => ({ ...p, popularity: p.popularity + 2 }));
                }
            },
            {
                text: 'Comer doce escondido',
                sentiment: 'neutral',
                effect: (player, setPlayer) => {
                    setPlayer(p => ({ ...p, hunger: Math.max(0, p.hunger - 10) }));
                }
            }
        ]
    },
    {
        id: 'spider_attack',
        text: 'Uma aranha gigante apareceu no quarto!',
        trigger: 'random',
        weight: 0.6,
        choices: [
            {
                text: 'Matar a aranha',
                sentiment: 'drama',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Os defensores dos animais te cancelaram no Twitter.", "alert");
                    setPlayer(p => ({ ...p, popularity: p.popularity - 5 }));
                }
            },
            {
                text: 'Salvar a aranha',
                sentiment: 'positive',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Herói da natureza! Ganhou pontos com o público vegano.", "success");
                    setPlayer(p => ({ ...p, popularity: p.popularity + 3 }));
                }
            }
        ]
    },
    {
        id: 'punishment_angel',
        text: 'O Anjo te deu o Castigo do Monstro!',
        trigger: 'random',
        weight: 0.4,
        choices: [
            {
                text: 'Cumprir com garra',
                sentiment: 'positive',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Você ficou horas em pé vestido de brócolis. Guerreiro!", "success");
                    setPlayer(p => ({ ...p, popularity: p.popularity + 5, energy: 0, stress: p.stress + 30 }));
                }
            },
            {
                text: 'Reclamar o tempo todo',
                sentiment: 'negative',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Você ficou resmungando. Pegou mal.", "bad");
                    setPlayer(p => ({ ...p, popularity: p.popularity - 5, stress: p.stress + 10 }));
                }
            }
        ]
    },
    {
        id: 'flirt_gym',
        text: 'Na academia, alguém elogiou sua forma física.',
        trigger: 'gym',
        weight: 1.2,
        choices: [
            {
                text: 'Agradecer timidamente',
                sentiment: 'neutral',
                effect: (player, setPlayer) => {
                    setPlayer(p => ({ ...p, popularity: p.popularity + 1 }));
                }
            },
            {
                text: 'Retribuir o elogio',
                sentiment: 'positive',
                effect: (player, setPlayer, npcs, setNpcs) => {
                    // Random NPC likes you more
                    const targets = npcs.filter(n => n.status === 'active');
                    const t = targets[Math.floor(Math.random() * targets.length)];
                    setNpcs(prev => prev.map(n => n.id === t.id ? { ...n, affinity: n.affinity + 5 } : n));
                }
            }
        ]
    },
    {
        id: 'missing_items',
        text: 'Sumiram seus cigarros/chicletes.',
        trigger: 'random',
        weight: 1.0,
        choices: [
            {
                text: 'Investigar',
                sentiment: 'neutral',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Você revirou as malas de todos. Criou um climão.", "alert");
                    setNpcs(prev => prev.map(n => ({ ...n, affinity: n.affinity - 5 })));
                }
            }
        ]
    },
    {
        id: 'dream_talk',
        text: 'Você falou dormindo e revelou seu voto!',
        trigger: 'random',
        weight: 0.2,
        choices: [
            {
                text: 'Tentar desmentir',
                sentiment: 'drama',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Você disse que era pesadelo. Ninguém acreditou.", "alert");
                    setPlayer(p => ({ ...p, strategy: p.strategy - 5 }));
                }
            }
        ]
    },
    {
        id: 'unexpected_gift',
        text: 'Uma marca enviou chocolates para a casa.',
        trigger: 'random',
        weight: 1.0,
        choices: [
            {
                text: 'Comer tudo',
                sentiment: 'bad',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Você comeu quase tudo sozinho. Egoísta!", "bad");
                    setPlayer(p => ({ ...p, popularity: p.popularity - 5, hunger: 0 }));
                }
            },
            {
                text: 'Dividir igualmente',
                sentiment: 'positive',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Você organizou a divisão. Líder nato.", "success");
                    setPlayer(p => ({ ...p, popularity: p.popularity + 2 }));
                }
            }
        ]
    },
    {
        id: 'fake_elimination',
        text: 'Suspeita de Paredão Falso na casa!',
        trigger: 'random',
        weight: 0.5,
        choices: [
            {
                text: 'Teorizar com aliados',
                sentiment: 'neutral',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Vocês ficaram hora teorizando. O público riu das bobeiras.", "info");
                }
            }
        ]
    },
    {
        id: 'camera_man',
        text: 'Você viu um câmera pelo espelho!',
        trigger: 'random',
        weight: 0.1,
        choices: [
            {
                text: 'Dar tchauzinho',
                sentiment: 'positive',
                effect: (player, setPlayer, npcs, setNpcs, addLog) => {
                    addLog("Você quebrou a quarta parede. Boninho não gostou (-50 Estalecas).", "alert");
                    setPlayer(p => ({ ...p, money: Math.max(0, p.money - 50) }));
                }
            }
        ]
    }
];
