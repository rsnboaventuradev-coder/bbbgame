export const NAMES = ["Enzo", "Valentina", "Cleber", "Jurema", "Thales", "Bia", "Rodrigão", "Luana", "Fábio", "Mirella", "Jéssica", "Arthur", "Carol", "Pedro"];

export const STATES = [
    { code: 'SP', name: 'São Paulo' },
    { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'MG', name: 'Minas Gerais' },
    { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'BA', name: 'Bahia' },
    { code: 'PE', name: 'Pernambuco' },
    { code: 'CE', name: 'Ceará' },
    { code: 'DF', name: 'Distrito Federal' },
    { code: 'GO', name: 'Goiás' },
    { code: 'PR', name: 'Paraná' },
    { code: 'SC', name: 'Santa Catarina' },
    { code: 'AM', name: 'Amazonas' }
];

export const JOBS = [
    { id: 'actor', name: 'Ator/Atriz', bonus: { charisma: 20, strategy: 5, endurance: 0 }, desc: 'Facilidade em simular e atuar.' },
    { id: 'teacher', name: 'Professor(a)', bonus: { charisma: 5, strategy: 20, endurance: 0 }, desc: 'Boa oratória e articulação.' },
    { id: 'influence', name: 'Influencer', bonus: { charisma: 25, strategy: 0, endurance: 0 }, desc: 'Já entra com torcida organizada.' },
    { id: 'doctor', name: 'Médico(a)', bonus: { charisma: 5, strategy: 15, endurance: 5 }, desc: 'Frio sob pressão e cuidadoso.' },
    { id: 'lawyer', name: 'Advogado(a)', bonus: { charisma: 10, strategy: 20, endurance: -5 }, desc: 'Argumentação imbatível.' },
    { id: 'trainer', name: 'Personal Trainer', bonus: { charisma: 5, strategy: -5, endurance: 25 }, desc: 'Monstro nas provas de resistência.' },
    { id: 'model', name: 'Modelo', bonus: { charisma: 15, strategy: -5, endurance: 5 }, desc: 'Charme natural.' },
    { id: 'student', name: 'Estudante', bonus: { charisma: 10, strategy: 10, endurance: 5 }, desc: 'Energia de sobra.' }
];

export const TRAITS = [
    {
        id: 'leader',
        name: 'Líder Nato',
        desc: 'Tende a puxar responsabilidade e organizar o grupo.',
        bonus: { strategy: 10, charisma: 5 },
        behaviors: {
            conflictChance: 0.15,
            allianceChance: 0.4,
            gossipChance: 0.1,
            romanceChance: 0.1,
            helpChance: 0.5
        },
        autonomousActions: ['organize_meeting', 'mediate_conflict', 'plan_strategy']
    },
    {
        id: 'emotional',
        name: 'Emotivo',
        desc: 'Chora fácil, mas ganha empatia do público.',
        bonus: { charisma: 10 },
        behaviors: {
            conflictChance: 0.05,
            allianceChance: 0.3,
            gossipChance: 0.05,
            romanceChance: 0.25,
            helpChance: 0.4,
            cryChance: 0.3
        },
        autonomousActions: ['cry_alone', 'seek_comfort', 'share_feelings']
    },
    {
        id: 'competitive',
        name: 'Competitivo',
        desc: 'Focado em vencer provas e ser o melhor.',
        bonus: { endurance: 10, strategy: 5 },
        behaviors: {
            conflictChance: 0.25,
            allianceChance: 0.2,
            gossipChance: 0.1,
            romanceChance: 0.05,
            helpChance: 0.1,
            trainChance: 0.4
        },
        autonomousActions: ['train_alone', 'challenge_others', 'boast_skills']
    },
    {
        id: 'barraqueiro',
        name: 'Barraqueiro',
        desc: 'Gera entretenimento e drama, mas cria inimigos.',
        bonus: { charisma: 5 },
        behaviors: {
            conflictChance: 0.5,
            allianceChance: 0.15,
            gossipChance: 0.4,
            romanceChance: 0.2,
            helpChance: 0.05,
            dramaChance: 0.6
        },
        autonomousActions: ['start_argument', 'spread_rumor', 'provoke_others']
    },
    {
        id: 'planta',
        name: 'Planta',
        desc: 'Evita conflitos e passa despercebido.',
        bonus: { strategy: 5 },
        behaviors: {
            conflictChance: 0.02,
            allianceChance: 0.1,
            gossipChance: 0.05,
            romanceChance: 0.05,
            helpChance: 0.15,
            hideChance: 0.5
        },
        autonomousActions: ['avoid_camera', 'stay_quiet', 'observe_others']
    },
    {
        id: 'strategist',
        name: 'Estrategista',
        desc: 'Joga com a mente, manipula e planeja.',
        bonus: { strategy: 15, charisma: 5 },
        behaviors: {
            conflictChance: 0.1,
            allianceChance: 0.5,
            gossipChance: 0.35,
            romanceChance: 0.15,
            helpChance: 0.2,
            manipulateChance: 0.4
        },
        autonomousActions: ['plant_seed_doubt', 'form_alliance', 'gather_intel']
    },
    {
        id: 'sedutor',
        name: 'Sedutor',
        desc: 'Foca em romances e usa charme como estratégia.',
        bonus: { charisma: 15 },
        behaviors: {
            conflictChance: 0.1,
            allianceChance: 0.25,
            gossipChance: 0.15,
            romanceChance: 0.6,
            helpChance: 0.2,
            flirtChance: 0.5
        },
        autonomousActions: ['flirt_target', 'create_love_triangle', 'use_charm']
    },
    {
        id: 'amigo',
        name: 'Amigo Leal',
        desc: 'Ganha confiança rápido e mantém alianças.',
        bonus: { charisma: 10, strategy: 5 },
        behaviors: {
            conflictChance: 0.05,
            allianceChance: 0.5,
            gossipChance: 0.05,
            romanceChance: 0.2,
            helpChance: 0.6,
            loyaltyBonus: 20
        },
        autonomousActions: ['help_friend', 'defend_ally', 'share_resources']
    },
    {
        id: 'manipulator',
        name: 'Manipulador',
        desc: 'Mestre em jogar duplo e criar caos controlado.',
        bonus: { strategy: 12, charisma: 8 },
        behaviors: {
            conflictChance: 0.2,
            allianceChance: 0.4,
            gossipChance: 0.5,
            romanceChance: 0.1,
            helpChance: 0.1,
            betrayChance: 0.3
        },
        autonomousActions: ['betray_ally', 'pit_against', 'fake_friendship']
    },
    {
        id: 'peacemaker',
        name: 'Pacificador',
        desc: 'Tenta manter a paz e mediar conflitos.',
        bonus: { charisma: 12 },
        behaviors: {
            conflictChance: 0.03,
            allianceChance: 0.35,
            gossipChance: 0.05,
            romanceChance: 0.15,
            helpChance: 0.5,
            mediateChance: 0.4
        },
        autonomousActions: ['mediate_fight', 'calm_situation', 'unite_group']
    }
];

export const ACTION_COSTS = {
    GYM: 25,
    CONFLICT: 25,
    HOUSEWORK: 20,
    ROMANCE: 20,
    SOCIALIZE: 15,
    EAVESDROP: 15,
    READ: 10,
    SPREAD_RUMOR: 30,
    PARTY_DRINK: 10 // [NEW]
};

export const EVENT_CHANCES = {
    BIG_PHONE: 0.05,
    RANDOM_EVENT: 0.40, // 40% per action
    STRATEGY_LEAK: 0.40 // 40% during party
};

export const GAME_STATES = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    VOTING: 'VOTING',
    VOTING_HOUSE: 'VOTING_HOUSE',
    ELIMINATION: 'ELIMINATION',
    LEADER: 'LEADER',
    ANGEL: 'ANGEL',
    PARTY: 'PARTY',
    WINNER: 'WINNER',
    MINIGAME: 'MINIGAME',
    ANGEL_CEREMONY: 'ANGEL_CEREMONY',
    LEADER_NOMINATION: 'LEADER_NOMINATION', // [NEW]
    VOTING_CONFESSIONAL: 'VOTING_CONFESSIONAL', // New Immersive Voting
    ELIMINATION_CEREMONY: 'ELIMINATION_CEREMONY' // New Suspense Reveal
};

export const MAX_DAILY_ACTIONS = 4;
export const TIMES_OF_DAY = ['Manhã', 'Tarde', 'Noite', 'Madrugada'];

export const RELATIONSHIP_LEVELS = {
    NONE: 'Conhecido',
    INTERESTED: 'Interesse',
    FLIRT: 'Flerte',
    SECRET: 'Romance Secreto',
    OFFICIAL: 'Casal Oficial',
};

export const ROMANCE_ACTIONS = {
    FLIRT: { cost: 10, reqAffinity: 20, label: 'Flerter' },
    KISS: { cost: 15, reqAffinity: 50, label: 'Beijar' },
    EDREDOM: { cost: 40, reqAffinity: 90, label: 'Edredom' }
};
