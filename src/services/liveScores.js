const prisma = require('../config/database');

// Nombres de football-data.org → nombres en nuestra BD (español)
const TEAM_MAP = {
  'Mexico':                        'México',
  'South Korea':                   'Corea del Sur',
  'Republic of Korea':             'Corea del Sur',
  'Korea Republic':                'Corea del Sur',
  'Czech Republic':                'Rep. Checa',
  'Czechia':                       'Rep. Checa',
  'Canada':                        'Canadá',
  'Bosnia and Herzegovina':        'Bosnia y Herzegovina',
  'Qatar':                         'Catar',
  'Switzerland':                   'Suiza',
  'United States':                 'Estados Unidos',
  'USA':                           'Estados Unidos',
  'Turkey':                        'Turquía',
  'Türkiye':                       'Turquía',
  'Brazil':                        'Brasil',
  'Morocco':                       'Marruecos',
  'Haiti':                         'Haití',
  'Germany':                       'Alemania',
  "Ivory Coast":                   'Costa de Marfil',
  "Côte d'Ivoire":                 'Costa de Marfil',
  'Netherlands':                   'Países Bajos',
  'Japan':                         'Japón',
  'Sweden':                        'Suecia',
  'Tunisia':                       'Túnez',
  'Spain':                         'España',
  'Cape Verde':                    'Cabo Verde',
  'Saudi Arabia':                  'Arabia Saudí',
  'Belgium':                       'Bélgica',
  'Egypt':                         'Egipto',
  'Iran':                          'Irán',
  'Islamic Republic of Iran':      'Irán',
  'New Zealand':                   'Nueva Zelanda',
  'France':                        'Francia',
  'Norway':                        'Noruega',
  'Algeria':                       'Argelia',
  'Austria':                       'Austria',
  'Jordan':                        'Jordania',
  'DR Congo':                      'RD Congo',
  'Democratic Republic of Congo':  'RD Congo',
  'Uzbekistan':                    'Uzbekistán',
  'England':                       'Inglaterra',
  'Croatia':                       'Croacia',
  'Panama':                        'Panamá',
  'South Africa':                  'Sudáfrica',
  'Costa Rica':                    'Costa Rica',
  'Honduras':                      'Honduras',
  'El Salvador':                   'El Salvador',
  'Guatemala':                     'Guatemala',
  'Venezuela':                     'Venezuela',
  'Chile':                         'Chile',
  'Peru':                          'Perú',
  'Bolivia':                       'Bolivia',
  'Paraguay':                      'Paraguay',
  'Nigeria':                       'Nigeria',
  'Cameroon':                      'Camerún',
  'Senegal':                       'Senegal',
  'Ghana':                         'Ghana',
  'Mali':                          'Mali',
  'Poland':                        'Polonia',
  'Ukraine':                       'Ucrania',
  'Serbia':                        'Serbia',
  'Romania':                       'Rumanía',
  'Hungary':                       'Hungría',
  'Slovakia':                      'Eslovaquia',
  'Scotland':                      'Escocia',
  'Greece':                        'Grecia',
  'Denmark':                       'Dinamarca',
  'Portugal':                      'Portugal',
  'Argentina':                     'Argentina',
  'Colombia':                      'Colombia',
  'Uruguay':                       'Uruguay',
  'Ecuador':                       'Ecuador',
  'Australia':                     'Australia',
  'Iraq':                          'Irak',
  'China':                         'China',
  "China PR":                      'China',
  'Indonesia':                     'Indonesia',
  'Jamaica':                       'Jamaica',
  'Trinidad and Tobago':           'Trinidad y Tobago',
  'New Caledonia':                 'Nueva Caledonia',
  'Cuba':                          'Cuba',
};

function mapStatus(status) {
  switch (status) {
    case 'IN_PLAY':   return 'live';
    case 'PAUSED':    return 'halftime';
    case 'FINISHED':  return 'finished';
    default:          return 'scheduled'; // SCHEDULED, TIMED, POSTPONED, etc.
  }
}

async function updateScores() {
  const key = process.env.FOOTBALL_DATA_KEY;
  if (!key) return;

  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' });

  // ¿Hay partidos hoy en BD?
  const start = new Date(`${today}T00:00:00+02:00`);
  const end   = new Date(`${today}T23:59:59+02:00`);
  const matchesToday = await prisma.match.count({
    where: { matchDate: { gte: start, lte: end } },
  });
  if (matchesToday === 0) return;

  try {
    const res = await fetch(
      `https://api.football-data.org/v4/competitions/WC/matches?dateFrom=${today}&dateTo=${today}`,
      { headers: { 'X-Auth-Token': key } }
    );

    if (!res.ok) {
      console.error(`[liveScores] Error ${res.status}: ${await res.text()}`);
      return;
    }

    const json = await res.json();
    const matches = json.matches || [];
    if (!matches.length) return;

    let updated = 0;
    for (const m of matches) {
      const apiHome = m.homeTeam?.name || m.homeTeam?.shortName;
      const apiAway = m.awayTeam?.name || m.awayTeam?.shortName;
      const dbHome  = TEAM_MAP[apiHome] || apiHome;
      const dbAway  = TEAM_MAP[apiAway] || apiAway;

      const status    = mapStatus(m.status);
      const minute    = m.minute ?? null;
      // fullTime contiene el marcador actual durante el partido y el final al terminar
      const homeScore = m.score?.fullTime?.home ?? null;
      const awayScore = m.score?.fullTime?.away ?? null;

      const data = { status };
      if (minute !== null) data.minute = minute;
      if (homeScore !== null) { data.homeScore = homeScore; data.awayScore = awayScore; }

      const r = await prisma.match.updateMany({
        where: { homeTeam: dbHome, awayTeam: dbAway },
        data,
      });
      if (r.count > 0) updated++;
      else if (status !== 'scheduled') {
        console.warn(`[liveScores] Sin coincidencia en BD: "${apiHome}" (→"${dbHome}") vs "${apiAway}" (→"${dbAway}")`);
      }
    }

    if (updated) console.log(`📡 ${new Date().toISOString()} — ${updated} partido(s) actualizados`);

  } catch (err) {
    console.error('[liveScores] Error:', err.message);
  }
}

function startPolling() {
  if (!process.env.FOOTBALL_DATA_KEY) {
    console.log('ℹ️  FOOTBALL_DATA_KEY no configurado — live scores desactivado');
    return;
  }
  updateScores();
  setInterval(updateScores, 5 * 60 * 1000);
  console.log('📡 Live scores activo (football-data.org, cada 5 min)');
}

module.exports = { startPolling };
