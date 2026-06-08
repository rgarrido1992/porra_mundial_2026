const prisma = require('../config/database');

// Nombres de equipos en la API → nombres en nuestra BD (español)
const TEAM_MAP = {
  'Mexico':                       'México',
  'South Korea':                  'Corea del Sur',
  'Czech Republic':               'Rep. Checa',
  'Canada':                       'Canadá',
  'Bosnia':                       'Bosnia y Herzegovina',
  'Bosnia and Herzegovina':       'Bosnia y Herzegovina',
  'Qatar':                        'Catar',
  'Switzerland':                  'Suiza',
  'United States':                'Estados Unidos',
  'USA':                          'Estados Unidos',
  'Paraguay':                     'Paraguay',
  'Australia':                    'Australia',
  'Turkey':                       'Turquía',
  'Türkiye':                      'Turquía',
  'Brazil':                       'Brasil',
  'Morocco':                      'Marruecos',
  'Haiti':                        'Haití',
  'Scotland':                     'Escocia',
  'Germany':                      'Alemania',
  'Curacao':                      'Curazao',
  'Ivory Coast':                  'Costa de Marfil',
  "Cote d'Ivoire":                'Costa de Marfil',
  'Ecuador':                      'Ecuador',
  'Netherlands':                  'Países Bajos',
  'Holland':                      'Países Bajos',
  'Japan':                        'Japón',
  'Sweden':                       'Suecia',
  'Tunisia':                      'Túnez',
  'Spain':                        'España',
  'Cape Verde':                   'Cabo Verde',
  'Saudi Arabia':                 'Arabia Saudí',
  'Uruguay':                      'Uruguay',
  'Belgium':                      'Bélgica',
  'Egypt':                        'Egipto',
  'Iran':                         'Irán',
  'New Zealand':                  'Nueva Zelanda',
  'France':                       'Francia',
  'Senegal':                      'Senegal',
  'Iraq':                         'Irak',
  'Norway':                       'Noruega',
  'Argentina':                    'Argentina',
  'Algeria':                      'Argelia',
  'Austria':                      'Austria',
  'Jordan':                       'Jordania',
  'Portugal':                     'Portugal',
  'DR Congo':                     'RD Congo',
  'Democratic Republic of Congo': 'RD Congo',
  'Congo DR':                     'RD Congo',
  'Uzbekistan':                   'Uzbekistán',
  'Colombia':                     'Colombia',
  'England':                      'Inglaterra',
  'Croatia':                      'Croacia',
  'Ghana':                        'Ghana',
  'Panama':                       'Panamá',
  'South Africa':                 'Sudáfrica',
};

function mapStatus(short) {
  if (['1H', '2H', 'ET', 'P', 'BT'].includes(short)) return 'live';
  if (short === 'HT') return 'halftime';
  if (['FT', 'AET', 'PEN'].includes(short)) return 'finished';
  return 'scheduled';
}

async function updateScores() {
  const key = process.env.APIFOOTBALL_KEY;
  if (!key) return;

  // Fecha de hoy en hora Madrid (YYYY-MM-DD)
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' });

  // ¿Hay partidos hoy en nuestra BD?
  const start = new Date(`${today}T00:00:00+02:00`);
  const end   = new Date(`${today}T23:59:59+02:00`);
  const matchesToday = await prisma.match.count({
    where: { matchDate: { gte: start, lte: end } },
  });
  if (matchesToday === 0) return; // nada que actualizar hoy

  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures?league=1&season=2026&date=${today}`,
      { headers: { 'x-apisports-key': key } }
    );

    if (!res.ok) { console.error(`API error ${res.status}`); return; }

    const { response: fixtures, errors } = await res.json();
    if (errors && Object.keys(errors).length) { console.error('API errors:', errors); return; }
    if (!fixtures?.length) return;

    let updated = 0;
    for (const f of fixtures) {
      const dbHome = TEAM_MAP[f.teams.home.name];
      const dbAway = TEAM_MAP[f.teams.away.name];
      if (!dbHome || !dbAway) {
        console.warn(`Sin mapeo: "${f.teams.home.name}" / "${f.teams.away.name}"`);
        continue;
      }

      const status    = mapStatus(f.fixture.status.short);
      const minute    = f.fixture.status.elapsed ?? null;
      const homeScore = f.goals.home;   // null antes de empezar, número durante/después
      const awayScore = f.goals.away;

      const data = { status, minute };
      if (homeScore !== null) { data.homeScore = homeScore; data.awayScore = awayScore; }

      await prisma.match.updateMany({ where: { homeTeam: dbHome, awayTeam: dbAway }, data });
      updated++;
    }

    if (updated) console.log(`📡 ${updated} partidos actualizados (${today})`);

  } catch (err) {
    console.error('Live scores error:', err.message);
  }
}

function startPolling() {
  if (!process.env.APIFOOTBALL_KEY) {
    console.log('ℹ️  APIFOOTBALL_KEY no configurado — live scores desactivado');
    return;
  }
  updateScores();
  setInterval(updateScores, 5 * 60 * 1000); // cada 5 minutos
  console.log('📡 Live scores activo (cada 5 min)');
}

module.exports = { startPolling };
