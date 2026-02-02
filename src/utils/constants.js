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
    { id: 'leader', name: 'Líder Nato', desc: 'Tende a puxar responsabilidade.', bonus: { strategy: 10 } },
    { id: 'emotional', name: 'Emotivo', desc: 'Chora fácil, mas ganha empatia.', bonus: { charisma: 10 } },
    { id: 'competitive', name: 'Competitivo', desc: 'Focado em vencer provas.', bonus: { endurance: 10 } },
    { id: 'barraqueiro', name: 'Barraqueiro', desc: 'Gera entretenimento, mas cria inimigos.', bonus: { charisma: 5 } }, // Risk high
    { id: 'planta', name: 'Planta', desc: 'Foge do jogo, público tende a esquecer.', bonus: { strategy: 5 } },
    { id: 'strategist', name: 'Estrategista', desc: 'Joga com a mente, perigoso no paredão.', bonus: { strategy: 15 } },
    { id: 'sedutor', name: 'Sedutor', desc: 'Foca em romances e alianças duplas.', bonus: { charisma: 15 } },
    { id: 'amigo', name: 'Amigo Leal', desc: 'Ganha confiança rápido.', bonus: { charisma: 10 } }
];

export const ACTION_COSTS = {
    GYM: 25,
    CONFLICT: 25,
    HOUSEWORK: 20,
    ROMANCE: 20,
    SOCIALIZE: 15,
    EAVESDROP: 15,
    READ: 10,
    SPREAD_RUMOR: 30
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
