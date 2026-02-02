export const EVENTS = [
    // --- EXISTING ---
    {
        id: 'big_phone_ring',
        text: 'O BIG FONE ESTÁ TOCANDO! O que você faz?',
        trigger: 'special',
        weight: 0,
        choices: [
            {
                text: "ATENDER CORRENDO!",
                sentiment: 'drama',
                effect: (player, setPlayer, npcs, setNpcs, addLog, addMemory, setImmunes, setNominees) => {
                    const outcomes = ['immunity', 'wall', 'power'];
                    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
                    if (outcome === 'immunity') {
                        setImmunes(prev => [...prev, 'player']);
                        addLog("☎ BIG FONE: Você está IMUNE!", 'success');
                    } else if (outcome === 'wall') {
                        setNominees(prev => [...prev, 'player']);
                        addLog("☎ BIG FONE: Você está no PAREDÃO!", 'bad');
                    } else {
                        addLog("☎ BIG FONE: Você ganhou o Poder do Voto Duplo (WIP)!", 'info');
                    }
                }
            },
            {
                text: "Ignorar",
                sentiment: 'neutral',
                effect: (p, setP, npcs, setN, addLog) => {
                    const runner = npcs.find(n => n.status === 'active');
                    if (runner) addLog(`${runner.name} atendeu o Big Fone!`, 'system');
                }
            }
        ]
    },
    // --- SOCIAL & DRAMA ---
    {
        id: 'punishment_food',
        text: "ALERTA: Alguém comeu o bolo da Xepa que não devia! A casa toda foi punida.",
        trigger: 'random',
        weight: 1,
        choices: [
            {
                text: "Reclamar com todos",
                sentiment: 'negative',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, stress: prev.stress + 10 }));
                    setN(prev => prev.map(n => ({ ...n, affinity: Math.max(0, n.affinity - 5) })));
                    addLog("Você causou um climão reclamando da comida.", 'bad');
                }
            },
            {
                text: "Ficar quieto",
                sentiment: 'neutral',
                effect: (p, setP) => {
                    setP(prev => ({ ...prev, hunger: prev.hunger + 20 }));
                    addLog("Você aceitou a punição em silêncio.", 'neutral');
                }
            }
        ]
    },
    {
        id: 'pool_talk',
        text: "Um grupo está falando mal de um aliado seu na piscina. Você ouve tudo.",
        trigger: 'random',
        weight: 1,
        choices: [
            {
                text: "Defender o aliado",
                sentiment: 'positive',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, popularity: prev.popularity + 5 }));
                    addLog("Você defendeu seu amigo! O público gostou da lealdade.", 'success');
                }
            },
            {
                text: "Ficar calado para não se expor",
                sentiment: 'neutral',
                effect: (p, setP) => {
                    setP(prev => ({ ...prev, strategy: prev.strategy + 5 }));
                    addLog("Você guardou a informação para usar depois.", 'info');
                }
            }
        ]
    },
    {
        id: 'party_aftermath',
        text: "A festa acabou, mas deixaram a sala imunda. O que fazer?",
        trigger: 'random',
        weight: 0.8,
        choices: [
            {
                text: "Limpar tudo sozinho",
                sentiment: 'positive',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, energy: prev.energy - 20, popularity: prev.popularity + 5 }));
                    addLog("Você limpou a sujeira dos outros. Alguns te acham planta, outros admiram.", 'info');
                }
            },
            {
                text: "Acordar geral batendo panela!",
                sentiment: 'drama',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, stress: prev.stress - 10 })); // Catharsis
                    setN(prev => prev.map(n => ({ ...n, affinity: n.affinity - 10 })));
                    addLog("PANELAÇO! A casa acordou te odiando, mas você lavou a alma.", 'drama');
                }
            }
        ]
    },
    {
        id: 'crush_look',
        text: "Você percebeu alguém te olhando diferente durante o almoço...",
        trigger: 'random',
        weight: 1,
        choices: [
            {
                text: "Sorrir de volta",
                sentiment: 'positive',
                effect: (p, setP, npcs, setN, addLog) => {
                    const admirer = npcs.find(n => n.status === 'active' && n.id !== 'player');
                    if (admirer) {
                        setN(prev => prev.map(n => n.id === admirer.id ? { ...n, affinity: n.affinity + 10 } : n));
                        addLog(`Você e ${admirer.name} trocaram olhares...`, 'success');
                    }
                }
            },
            {
                text: "Fingir que não viu",
                sentiment: 'neutral',
                effect: (p, setP) => {
                    setP(prev => ({ ...prev, strategy: prev.strategy + 2 }));
                    addLog("Foco no jogo, sem romance agora.", 'neutral');
                }
            }
        ]
    },
    {
        id: 'fake_news',
        text: "Um boato diz que você vai votar no Líder. É mentira, mas espalharam.",
        trigger: 'random',
        weight: 0.7,
        choices: [
            {
                text: "Desmentir publicamente",
                sentiment: 'drama',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, stress: prev.stress + 5 }));
                    addLog("Você reuniu a casa para se explicar. O clima pesou.", 'warning');
                }
            },
            {
                text: "Deixar falarem",
                sentiment: 'neutral',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, popularity: prev.popularity - 2 }));
                    addLog("O Líder ficou desconfiado...", 'bad');
                }
            }
        ]
    },
    {
        id: 'food_theft',
        text: "Desaparareceram 5 ovos da sua cartela na geladeira!",
        trigger: 'random',
        weight: 0.9,
        choices: [
            {
                text: "Investigar quem foi",
                sentiment: 'neutral',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, strategy: prev.strategy + 5, energy: prev.energy - 5 }));
                    addLog("Você ficou de tocaia na cozinha.", 'info');
                }
            },
            {
                text: "Armar um barraco na sala",
                sentiment: 'drama',
                effect: (p, setP, npcs, setN, addLog) => {
                    setN(prev => prev.map(n => ({ ...n, affinity: n.affinity - 5 })));
                    setP(prev => ({ ...prev, popularity: prev.popularity + 5 })); // Public likes drama
                    addLog("CADÊ MEUS OVOS?? O Brasil viu seu surto.", 'drama');
                }
            }
        ]
    },
    {
        id: 'missing_family',
        text: "Tocou uma música que te lembrou da família. A saudade bateu forte.",
        trigger: 'random',
        weight: 0.8,
        choices: [
            {
                text: "Chorar escondido no quarto",
                sentiment: 'negative',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, stress: Math.max(0, prev.stress - 20) })); // Crying helps
                    addLog("Você desabafou com o travesseiro.", 'neutral');
                }
            },
            {
                text: "Dividir com os amigos",
                sentiment: 'positive',
                effect: (p, setP, npcs, setN, addLog) => {
                    setN(prev => prev.map(n => ({ ...n, affinity: n.affinity + 5 })));
                    addLog("Todos te consolaram. A aliança se fortaleceu.", 'success');
                }
            }
        ]
    },
    {
        id: 'mic_fail',
        text: "ATENÇÃO: Você esqueceu o microfone ou falou sem ele. Punição!",
        trigger: 'random',
        weight: 0.5,
        choices: [
            {
                text: "Pedir desculpas",
                sentiment: 'neutral',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, estalecas: Math.max(0, prev.estalecas - 50) }));
                    addLog("Você perdeu 50 estalecas.", 'bad');
                }
            }
        ]
    },
    {
        id: 'plant_mode',
        text: "Você percebeu que não apareceu muito no jogo nos últimos dias.",
        trigger: 'random',
        weight: 0.6,
        choices: [
            {
                text: "Pular na piscina de roupa",
                sentiment: 'positive',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, popularity: prev.popularity + 10, stress: prev.stress - 5 }));
                    addLog("VTzeiro! O público adorou sua loucura.", 'success');
                }
            },
            {
                text: "Criar uma estratégia nova",
                sentiment: 'neutral',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, strategy: prev.strategy + 10 }));
                    addLog("Você passou horas desenhando cenários de voto.", 'info');
                }
            }
        ]
    },
    // --- PARTY & STRATEGY ---
    {
        id: 'secret_reveal',
        text: "Você achou um papel amassado no lixo do banheiro. Parece uma combinação de votos!",
        trigger: 'random',
        weight: 0.3,
        choices: [
            {
                text: "Ler imediatamente",
                sentiment: 'neutral',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, strategy: prev.strategy + 15 }));
                    addLog("Você descobriu os planos do grupo rival!", 'success');
                }
            },
            {
                text: "Mostrar para seu aliado",
                sentiment: 'positive',
                effect: (p, setP, npcs, setN, addLog) => {
                    addLog("Seu aliado ficou chocado com a descoberta.", 'info');
                }
            }
        ]
    },
    {
        id: 'monster_threat',
        text: "O Monstro da semana está insuportável batendo panelas no seu ouvido!",
        trigger: 'random',
        weight: 0.5,
        choices: [
            {
                text: "Discutir com o Monstro",
                sentiment: 'drama',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, stress: prev.stress + 10 }));
                    addLog("Você pediu respeito, mas virou bate-boca.", 'bad');
                }
            },
            {
                text: "Ajudar o Monstro",
                sentiment: 'positive',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, popularity: prev.popularity + 5 }));
                    addLog("Você levou água para o Monstro. Empatia +10.", 'success');
                }
            }
        ]
    },
    {
        id: 'hair_cut',
        text: "Tédio total. Alguém sugere cortar seu cabelo.",
        trigger: 'random',
        weight: 0.4,
        choices: [
            {
                text: "Aceitar mudança radical",
                sentiment: 'positive',
                effect: (p, setP, npcs, setN, addLog) => {
                    const success = Math.random() > 0.5;
                    if (success) {
                        setP(prev => ({ ...prev, beauty: Math.min(100, prev.beauty + 10) }));
                        addLog("Ficou ótimo! Autoestima renovada.", 'success');
                    } else {
                        setP(prev => ({ ...prev, beauty: Math.max(0, prev.beauty - 10), stress: prev.stress + 10 }));
                        addLog("Ficou horrível... Você chorou no espelho.", 'bad');
                    }
                }
            },
            {
                text: "Recusar",
                sentiment: 'neutral',
                effect: (p, setP) => {
                    addLog("Melhor não arriscar a imagem.", 'neutral');
                }
            }
        ]
    },
    {
        id: 'insect_invasion',
        text: "Uma barata surgiu no meio da sala!",
        trigger: 'random',
        weight: 0.5,
        choices: [
            {
                text: "Subir no sofá gritando",
                sentiment: 'drama',
                effect: (p, setP, npcs, setN, addLog) => {
                    addLog("Meme instantâneo: Sua cara de pavor viralizou.", 'fun');
                }
            },
            {
                text: "Matar com o chinelo",
                sentiment: 'neutral',
                effect: (p, setP, npcs, setN, addLog) => {
                    addLog("Você resolveu o problema com frieza.", 'info');
                }
            },
            {
                text: "Salvar a barata e levar pro jardim",
                sentiment: 'positive',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, popularity: prev.popularity + 2 }));
                    addLog("A Luisa Mell curtiu isso.", 'success');
                }
            }
        ]
    },
    {
        id: 'sponsorship',
        text: "Ação de Publicidade! Todos ganharam presentes do patrocinador.",
        trigger: 'random',
        weight: 0.2, // Rare
        choices: [
            {
                text: "Comemorar",
                sentiment: 'positive',
                effect: (p, setP, npcs, setN, addLog) => {
                    setP(prev => ({ ...prev, stress: 0, hunger: 0 })); // Full restore
                    addLog("Comida boa e presentes! O humor da casa melhorou 100%.", 'success');
                }
            }
        ]
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
