const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function d(fecha, hora) {
  const [dd, mm, yyyy] = fecha.split('/');
  return new Date(`${yyyy}-${mm}-${dd}T${hora}:00+02:00`);
}

const matchDefs = [
  // ── JORNADA 1 ──────────────────────────────────────────────────────────────
  { matchNumber:  1, homeTeam: 'México',               awayTeam: 'Sudáfrica',            matchDate: d('11/06/2026','21:00'), stage:'group', group:'A', homeScore:null, awayScore:null },
  { matchNumber:  2, homeTeam: 'Corea del Sur',        awayTeam: 'Rep. Checa',           matchDate: d('12/06/2026','04:00'), stage:'group', group:'A', homeScore:null, awayScore:null },
  { matchNumber:  3, homeTeam: 'Canadá',               awayTeam: 'Bosnia y Herzegovina', matchDate: d('12/06/2026','21:00'), stage:'group', group:'B', homeScore:null, awayScore:null },
  { matchNumber:  4, homeTeam: 'Estados Unidos',       awayTeam: 'Paraguay',             matchDate: d('13/06/2026','03:00'), stage:'group', group:'C', homeScore:null, awayScore:null },
  { matchNumber:  5, homeTeam: 'Catar',                awayTeam: 'Suiza',                matchDate: d('13/06/2026','21:00'), stage:'group', group:'B', homeScore:null, awayScore:null },
  { matchNumber:  6, homeTeam: 'Brasil',               awayTeam: 'Marruecos',            matchDate: d('14/06/2026','00:00'), stage:'group', group:'D', homeScore:null, awayScore:null },
  { matchNumber:  7, homeTeam: 'Haití',                awayTeam: 'Escocia',              matchDate: d('14/06/2026','03:00'), stage:'group', group:'D', homeScore:null, awayScore:null },
  { matchNumber:  8, homeTeam: 'Australia',            awayTeam: 'Turquía',              matchDate: d('14/06/2026','06:00'), stage:'group', group:'C', homeScore:null, awayScore:null },
  { matchNumber:  9, homeTeam: 'Alemania',             awayTeam: 'Curazao',              matchDate: d('14/06/2026','19:00'), stage:'group', group:'E', homeScore:null, awayScore:null },
  { matchNumber: 10, homeTeam: 'Países Bajos',         awayTeam: 'Japón',                matchDate: d('14/06/2026','22:00'), stage:'group', group:'F', homeScore:null, awayScore:null },
  { matchNumber: 11, homeTeam: 'Costa de Marfil',      awayTeam: 'Ecuador',              matchDate: d('15/06/2026','01:00'), stage:'group', group:'E', homeScore:null, awayScore:null },
  { matchNumber: 12, homeTeam: 'Suecia',               awayTeam: 'Túnez',                matchDate: d('15/06/2026','04:00'), stage:'group', group:'F', homeScore:null, awayScore:null },
  { matchNumber: 13, homeTeam: 'España',               awayTeam: 'Cabo Verde',           matchDate: d('15/06/2026','18:00'), stage:'group', group:'G', homeScore:null, awayScore:null },
  { matchNumber: 14, homeTeam: 'Bélgica',              awayTeam: 'Egipto',               matchDate: d('15/06/2026','21:00'), stage:'group', group:'H', homeScore:null, awayScore:null },
  { matchNumber: 15, homeTeam: 'Arabia Saudí',         awayTeam: 'Uruguay',              matchDate: d('16/06/2026','00:00'), stage:'group', group:'G', homeScore:null, awayScore:null },
  { matchNumber: 16, homeTeam: 'Irán',                 awayTeam: 'Nueva Zelanda',        matchDate: d('16/06/2026','03:00'), stage:'group', group:'H', homeScore:null, awayScore:null },
  { matchNumber: 17, homeTeam: 'Francia',              awayTeam: 'Senegal',              matchDate: d('16/06/2026','21:00'), stage:'group', group:'I', homeScore:null, awayScore:null },
  { matchNumber: 18, homeTeam: 'Irak',                 awayTeam: 'Noruega',              matchDate: d('17/06/2026','00:00'), stage:'group', group:'I', homeScore:null, awayScore:null },
  { matchNumber: 19, homeTeam: 'Argentina',            awayTeam: 'Argelia',              matchDate: d('17/06/2026','03:00'), stage:'group', group:'J', homeScore:null, awayScore:null },
  { matchNumber: 20, homeTeam: 'Austria',              awayTeam: 'Jordania',             matchDate: d('17/06/2026','06:00'), stage:'group', group:'J', homeScore:null, awayScore:null },
  { matchNumber: 21, homeTeam: 'Portugal',             awayTeam: 'RD Congo',             matchDate: d('17/06/2026','19:00'), stage:'group', group:'K', homeScore:null, awayScore:null },
  { matchNumber: 22, homeTeam: 'Inglaterra',           awayTeam: 'Croacia',              matchDate: d('17/06/2026','22:00'), stage:'group', group:'L', homeScore:null, awayScore:null },
  { matchNumber: 23, homeTeam: 'Ghana',                awayTeam: 'Panamá',               matchDate: d('18/06/2026','01:00'), stage:'group', group:'L', homeScore:null, awayScore:null },
  { matchNumber: 24, homeTeam: 'Uzbekistán',           awayTeam: 'Colombia',             matchDate: d('18/06/2026','04:00'), stage:'group', group:'K', homeScore:null, awayScore:null },

  // ── JORNADA 2 ──────────────────────────────────────────────────────────────
  { matchNumber: 25, homeTeam: 'Rep. Checa',           awayTeam: 'Sudáfrica',            matchDate: d('18/06/2026','18:00'), stage:'group', group:'A', homeScore:null, awayScore:null },
  { matchNumber: 26, homeTeam: 'Suiza',                awayTeam: 'Bosnia y Herzegovina', matchDate: d('18/06/2026','21:00'), stage:'group', group:'B', homeScore:null, awayScore:null },
  { matchNumber: 27, homeTeam: 'Canadá',               awayTeam: 'Catar',                matchDate: d('19/06/2026','00:00'), stage:'group', group:'B', homeScore:null, awayScore:null },
  { matchNumber: 28, homeTeam: 'México',               awayTeam: 'Corea del Sur',        matchDate: d('19/06/2026','03:00'), stage:'group', group:'A', homeScore:null, awayScore:null },
  { matchNumber: 29, homeTeam: 'Estados Unidos',       awayTeam: 'Australia',            matchDate: d('19/06/2026','21:00'), stage:'group', group:'C', homeScore:null, awayScore:null },
  { matchNumber: 30, homeTeam: 'Escocia',              awayTeam: 'Marruecos',            matchDate: d('20/06/2026','00:00'), stage:'group', group:'D', homeScore:null, awayScore:null },
  { matchNumber: 31, homeTeam: 'Brasil',               awayTeam: 'Haití',                matchDate: d('20/06/2026','02:30'), stage:'group', group:'D', homeScore:null, awayScore:null },
  { matchNumber: 32, homeTeam: 'Turquía',              awayTeam: 'Paraguay',             matchDate: d('20/06/2026','05:00'), stage:'group', group:'C', homeScore:null, awayScore:null },
  { matchNumber: 33, homeTeam: 'Países Bajos',         awayTeam: 'Suecia',               matchDate: d('20/06/2026','19:00'), stage:'group', group:'F', homeScore:null, awayScore:null },
  { matchNumber: 34, homeTeam: 'Alemania',             awayTeam: 'Costa de Marfil',      matchDate: d('20/06/2026','22:00'), stage:'group', group:'E', homeScore:null, awayScore:null },
  { matchNumber: 35, homeTeam: 'Ecuador',              awayTeam: 'Curazao',              matchDate: d('21/06/2026','02:00'), stage:'group', group:'E', homeScore:null, awayScore:null },
  { matchNumber: 36, homeTeam: 'Túnez',                awayTeam: 'Japón',                matchDate: d('21/06/2026','06:00'), stage:'group', group:'F', homeScore:null, awayScore:null },
  { matchNumber: 37, homeTeam: 'España',               awayTeam: 'Arabia Saudí',         matchDate: d('21/06/2026','18:00'), stage:'group', group:'G', homeScore:null, awayScore:null },
  { matchNumber: 38, homeTeam: 'Bélgica',              awayTeam: 'Irán',                 matchDate: d('21/06/2026','21:00'), stage:'group', group:'H', homeScore:null, awayScore:null },
  { matchNumber: 39, homeTeam: 'Uruguay',              awayTeam: 'Cabo Verde',           matchDate: d('22/06/2026','00:00'), stage:'group', group:'G', homeScore:null, awayScore:null },
  { matchNumber: 40, homeTeam: 'Nueva Zelanda',        awayTeam: 'Egipto',               matchDate: d('22/06/2026','03:00'), stage:'group', group:'H', homeScore:null, awayScore:null },
  { matchNumber: 41, homeTeam: 'Argentina',            awayTeam: 'Austria',              matchDate: d('22/06/2026','19:00'), stage:'group', group:'J', homeScore:null, awayScore:null },
  { matchNumber: 42, homeTeam: 'Francia',              awayTeam: 'Irak',                 matchDate: d('22/06/2026','23:00'), stage:'group', group:'I', homeScore:null, awayScore:null },
  { matchNumber: 43, homeTeam: 'Noruega',              awayTeam: 'Senegal',              matchDate: d('23/06/2026','02:00'), stage:'group', group:'I', homeScore:null, awayScore:null },
  { matchNumber: 44, homeTeam: 'Jordania',             awayTeam: 'Argelia',              matchDate: d('23/06/2026','05:00'), stage:'group', group:'J', homeScore:null, awayScore:null },
  { matchNumber: 45, homeTeam: 'Portugal',             awayTeam: 'Uzbekistán',           matchDate: d('23/06/2026','19:00'), stage:'group', group:'K', homeScore:null, awayScore:null },
  { matchNumber: 46, homeTeam: 'Inglaterra',           awayTeam: 'Ghana',                matchDate: d('23/06/2026','22:00'), stage:'group', group:'L', homeScore:null, awayScore:null },
  { matchNumber: 47, homeTeam: 'Panamá',               awayTeam: 'Croacia',              matchDate: d('24/06/2026','01:00'), stage:'group', group:'L', homeScore:null, awayScore:null },
  { matchNumber: 48, homeTeam: 'Colombia',             awayTeam: 'RD Congo',             matchDate: d('24/06/2026','04:00'), stage:'group', group:'K', homeScore:null, awayScore:null },

  // ── JORNADA 3 ──────────────────────────────────────────────────────────────
  { matchNumber: 49, homeTeam: 'Bosnia y Herzegovina', awayTeam: 'Catar',                matchDate: d('24/06/2026','21:00'), stage:'group', group:'B', homeScore:null, awayScore:null },
  { matchNumber: 50, homeTeam: 'Suiza',                awayTeam: 'Canadá',               matchDate: d('24/06/2026','21:00'), stage:'group', group:'B', homeScore:null, awayScore:null },
  { matchNumber: 51, homeTeam: 'Marruecos',            awayTeam: 'Haití',                matchDate: d('25/06/2026','00:00'), stage:'group', group:'D', homeScore:null, awayScore:null },
  { matchNumber: 52, homeTeam: 'Escocia',              awayTeam: 'Brasil',               matchDate: d('25/06/2026','00:00'), stage:'group', group:'D', homeScore:null, awayScore:null },
  { matchNumber: 53, homeTeam: 'Rep. Checa',           awayTeam: 'México',               matchDate: d('25/06/2026','03:00'), stage:'group', group:'A', homeScore:null, awayScore:null },
  { matchNumber: 54, homeTeam: 'Sudáfrica',            awayTeam: 'Corea del Sur',        matchDate: d('25/06/2026','03:00'), stage:'group', group:'A', homeScore:null, awayScore:null },
  { matchNumber: 55, homeTeam: 'Curazao',              awayTeam: 'Costa de Marfil',      matchDate: d('25/06/2026','22:00'), stage:'group', group:'E', homeScore:null, awayScore:null },
  { matchNumber: 56, homeTeam: 'Ecuador',              awayTeam: 'Alemania',             matchDate: d('25/06/2026','22:00'), stage:'group', group:'E', homeScore:null, awayScore:null },
  { matchNumber: 57, homeTeam: 'Japón',                awayTeam: 'Suecia',               matchDate: d('26/06/2026','01:00'), stage:'group', group:'F', homeScore:null, awayScore:null },
  { matchNumber: 58, homeTeam: 'Túnez',                awayTeam: 'Países Bajos',         matchDate: d('26/06/2026','01:00'), stage:'group', group:'F', homeScore:null, awayScore:null },
  { matchNumber: 59, homeTeam: 'Paraguay',             awayTeam: 'Australia',            matchDate: d('26/06/2026','04:00'), stage:'group', group:'C', homeScore:null, awayScore:null },
  { matchNumber: 60, homeTeam: 'Turquía',              awayTeam: 'Estados Unidos',       matchDate: d('26/06/2026','04:00'), stage:'group', group:'C', homeScore:null, awayScore:null },
  { matchNumber: 61, homeTeam: 'Noruega',              awayTeam: 'Francia',              matchDate: d('26/06/2026','21:00'), stage:'group', group:'I', homeScore:null, awayScore:null },
  { matchNumber: 62, homeTeam: 'Senegal',              awayTeam: 'Irak',                 matchDate: d('26/06/2026','21:00'), stage:'group', group:'I', homeScore:null, awayScore:null },
  { matchNumber: 63, homeTeam: 'Cabo Verde',           awayTeam: 'Arabia Saudí',         matchDate: d('27/06/2026','02:00'), stage:'group', group:'G', homeScore:null, awayScore:null },
  { matchNumber: 64, homeTeam: 'Uruguay',              awayTeam: 'España',               matchDate: d('27/06/2026','02:00'), stage:'group', group:'G', homeScore:null, awayScore:null },
  { matchNumber: 65, homeTeam: 'Egipto',               awayTeam: 'Irán',                 matchDate: d('27/06/2026','05:00'), stage:'group', group:'H', homeScore:null, awayScore:null },
  { matchNumber: 66, homeTeam: 'Nueva Zelanda',        awayTeam: 'Bélgica',              matchDate: d('27/06/2026','05:00'), stage:'group', group:'H', homeScore:null, awayScore:null },
  { matchNumber: 67, homeTeam: 'Croacia',              awayTeam: 'Ghana',                matchDate: d('27/06/2026','23:00'), stage:'group', group:'L', homeScore:null, awayScore:null },
  { matchNumber: 68, homeTeam: 'Panamá',               awayTeam: 'Inglaterra',           matchDate: d('27/06/2026','23:00'), stage:'group', group:'L', homeScore:null, awayScore:null },
  { matchNumber: 69, homeTeam: 'Colombia',             awayTeam: 'Portugal',             matchDate: d('28/06/2026','01:30'), stage:'group', group:'K', homeScore:null, awayScore:null },
  { matchNumber: 70, homeTeam: 'RD Congo',             awayTeam: 'Uzbekistán',           matchDate: d('28/06/2026','01:30'), stage:'group', group:'K', homeScore:null, awayScore:null },
  { matchNumber: 71, homeTeam: 'Argelia',              awayTeam: 'Austria',              matchDate: d('28/06/2026','04:00'), stage:'group', group:'J', homeScore:null, awayScore:null },
  { matchNumber: 72, homeTeam: 'Jordania',             awayTeam: 'Argentina',            matchDate: d('28/06/2026','04:00'), stage:'group', group:'J', homeScore:null, awayScore:null },
];

// ──────────────────────────────────────────────────────────────────────────────
// PARTICIPANTES REALES
// Índices: 0=Ricardo G. 1=Guillermo H. 2=Raúl L. 3=Iván G. 4=Raúl P.
//          5=Christian M. 6=Carlos P. 7=P. Eugenio M. 8=Mike C. 9=Adrián L. 10=Manu L.
// Carlos P. (índice 6) sin pronóstico desde el partido 8 en adelante → null
// ──────────────────────────────────────────────────────────────────────────────
const participantNames = [
  'Ricardo G.', 'Guillermo H.', 'Raúl L.', 'Iván G.', 'Raúl P.',
  'Christian M.', 'Carlos P.', 'P. Eugenio M.', 'Mike C.', 'Adrián L.', 'Manu L.',
  'Adrián G.', 'Fran T.', 'Paco L.', 'Alberto S.', 'Dani S.', 'Jacobo E.', 'Julián',
];

// predData[matchIdx][participantIdx] = [homeScore, awayScore] | null
const predData = [
  [[3,0],[2,1],[2,1],[2,0],[2,0],[2,0],[2,1],[2,1],[2,1],[1,0],[2,1]],   // 1
  [[2,1],[1,1],[0,0],[0,0],[1,1],[1,1],[1,3],[1,1],[3,0],[1,1],[1,1]],   // 2
  [[2,1],[3,0],[2,1],[1,0],[1,0],[1,0],[1,1],[1,1],[2,1],[1,0],[3,0]],   // 3
  [[2,0],[2,0],[2,0],[2,0],[2,0],[2,0],[3,1],[2,1],[0,1],[1,0],[2,0]],   // 4
  [[0,2],[1,4],[0,2],[0,1],[0,3],[0,3],[0,2],[0,1],[1,3],[0,2],[1,4]],   // 5
  [[2,1],[3,1],[1,1],[5,0],[2,1],[2,1],[2,2],[2,1],[2,2],[2,1],[3,1]],   // 6
  [[0,2],[1,4],[0,2],[0,2],[0,2],[0,2],[0,4],[0,2],[0,0],[0,1],[1,4]],   // 7
  [[0,2],[1,1],[1,3],[1,2],[0,1],[0,1],null,[1,2],[2,3],[0,1],[1,1]],    // 8
  [[4,0],[6,0],[3,0],[4,0],[3,0],[3,0],null,[4,0],[5,1],[4,0],[6,0]],    // 9
  [[2,1],[2,2],[3,1],[3,2],[2,1],[2,1],null,[2,2],[0,2],[2,1],[2,2]],    // 10
  [[1,2],[3,1],[0,0],[0,0],[1,0],[1,0],null,[1,1],[2,4],[1,1],[3,1]],    // 11
  [[2,0],[2,1],[1,0],[1,1],[2,0],[2,0],null,[1,1],[1,1],[0,0],[2,1]],    // 12
  [[4,0],[4,0],[3,0],[2,1],[2,0],[2,0],null,[4,0],[3,0],[3,0],[4,0]],    // 13
  [[2,1],[2,2],[2,0],[3,1],[3,1],[3,1],null,[2,1],[2,0],[2,1],[2,2]],    // 14
  [[0,2],[1,3],[0,2],[1,3],[1,2],[1,2],null,[0,2],[1,0],[0,2],[1,3]],    // 15
  [[2,0],[1,0],[0,0],[0,4],[0,0],[0,0],null,[1,1],[2,1],[0,0],[1,0]],    // 16
  [[2,0],[4,1],[2,0],[1,1],[3,0],[3,0],null,[2,1],[2,2],[3,0],[4,1]],    // 17
  [[0,3],[0,3],[0,1],[0,6],[0,2],[0,2],null,[0,2],[2,6],[1,3],[0,3]],    // 18
  [[2,0],[4,1],[2,0],[5,1],[2,1],[2,1],null,[2,0],[2,0],[2,0],[4,1]],    // 19
  [[3,1],[3,0],[1,0],[4,1],[1,1],[1,1],null,[2,1],[1,0],[1,0],[3,0]],    // 20
  [[2,0],[4,0],[3,0],[7,0],[3,0],[3,0],null,[2,0],[3,0],[2,0],[4,0]],    // 21
  [[1,1],[2,1],[1,1],[1,2],[3,1],[3,1],null,[2,1],[3,1],[1,2],[2,1]],    // 22
  [[1,1],[1,0],[0,0],[0,0],[1,0],[1,0],null,[2,0],[0,1],[1,1],[1,0]],    // 23
  [[0,2],[1,2],[0,1],[1,4],[0,2],[0,2],null,[0,2],[1,3],[0,2],[1,2]],    // 24
  [[2,0],[1,1],[2,1],[2,2],[1,0],[1,0],null,[2,1],[2,0],[2,0],[1,1]],    // 25
  [[1,0],[2,0],[1,1],[1,1],[1,0],[1,0],null,[1,1],[1,0],[1,1],[2,0]],    // 26
  [[2,1],[2,0],[1,0],[2,0],[1,0],[1,0],null,[1,0],[2,1],[1,0],[2,0]],    // 27
  [[1,1],[2,1],[2,1],[1,1],[1,1],[1,1],null,[1,1],[2,4],[3,1],[2,1]],    // 28
  [[1,0],[2,0],[1,1],[3,1],[1,0],[1,0],null,[2,1],[2,2],[2,0],[2,0]],    // 29
  [[0,2],[1,1],[0,1],[1,2],[1,2],[1,2],null,[1,1],[0,2],[0,2],[1,1]],    // 30
  [[4,0],[7,0],[3,0],[8,0],[4,0],[4,0],null,[4,0],[4,0],[4,0],[7,0]],    // 31
  [[0,0],[2,1],[2,1],[2,1],[1,0],[1,0],null,[1,0],[2,2],[2,1],[2,1]],    // 32
  [[2,1],[3,1],[2,0],[3,1],[3,2],[3,2],null,[2,1],[3,2],[3,1],[3,1]],    // 33
  [[3,1],[3,2],[3,0],[4,1],[4,0],[4,0],null,[2,1],[3,1],[3,0],[3,2]],    // 34
  [[3,0],[4,1],[1,0],[2,1],[1,0],[1,0],null,[2,0],[2,0],[2,0],[4,1]],    // 35
  [[0,2],[1,3],[1,1],[1,2],[0,2],[0,2],null,[0,2],[0,3],[1,2],[1,3]],    // 36
  [[3,0],[3,1],[2,0],[2,1],[3,1],[3,1],null,[3,0],[3,1],[4,0],[3,1]],    // 37
  [[2,0],[2,0],[2,0],[5,0],[2,0],[2,0],null,[2,0],[1,0],[3,0],[2,0]],    // 38
  [[3,0],[4,1],[2,0],[1,1],[2,0],[2,0],null,[2,0],[2,1],[2,0],[4,1]],    // 39
  [[0,1],[0,1],[1,1],[0,2],[1,2],[1,2],null,[0,2],[1,1],[1,2],[0,1]],    // 40
  [[1,1],[2,1],[2,1],[3,0],[3,0],[3,0],null,[2,1],[3,2],[3,0],[2,1]],    // 41
  [[3,0],[3,0],[3,0],[3,1],[4,0],[4,0],null,[3,0],[5,1],[3,0],[3,0]],    // 42
  [[2,2],[2,1],[1,1],[1,2],[1,1],[1,1],null,[1,1],[2,1],[2,0],[2,1]],    // 43
  [[0,2],[0,0],[0,0],[1,2],[0,1],[0,1],null,[0,2],[1,3],[0,1],[0,0]],    // 44
  [[3,0],[4,0],[3,0],[4,1],[2,0],[2,0],null,[2,0],[3,0],[4,0],[4,0]],    // 45
  [[2,0],[3,2],[2,0],[3,2],[3,0],[3,0],null,[3,1],[2,0],[3,0],[3,2]],    // 46
  [[0,2],[1,3],[0,2],[1,2],[1,2],[1,2],null,[0,2],[1,2],[0,2],[1,3]],    // 47
  [[2,1],[2,1],[1,0],[0,0],[2,1],[2,1],null,[2,1],[3,2],[2,0],[2,1]],    // 48
  [[1,0],[2,1],[1,1],[1,1],[1,1],[1,1],null,[2,1],[2,0],[1,0],[2,1]],    // 49
  [[1,1],[1,1],[1,1],[1,2],[2,1],[2,1],null,[1,1],[1,1],[1,1],[1,1]],    // 50
  [[3,0],[3,0],[2,1],[6,0],[3,0],[3,0],null,[2,0],[3,0],[3,0],[3,0]],    // 51
  [[0,3],[1,3],[1,3],[1,5],[0,3],[0,3],null,[1,2],[0,3],[1,3],[1,3]],    // 52
  [[1,2],[1,1],[1,1],[1,1],[1,2],[1,2],null,[1,2],[1,2],[1,3],[1,1]],    // 53
  [[1,3],[1,1],[0,0],[2,1],[0,2],[0,2],null,[2,1],[0,3],[1,2],[1,1]],    // 54
  [[0,4],[1,4],[0,0],[0,2],[0,1],[0,1],null,[0,2],[0,1],[0,0],[1,4]],    // 55
  [[1,1],[1,3],[1,2],[1,4],[0,3],[0,3],null,[1,3],[1,2],[0,3],[1,3]],    // 56
  [[1,0],[2,2],[1,1],[3,1],[2,2],[2,2],null,[2,1],[2,0],[1,0],[2,2]],    // 57
  [[0,2],[1,3],[0,2],[1,4],[0,2],[0,2],null,[1,2],[0,2],[1,3],[1,3]],    // 58
  [[0,0],[0,0],[1,1],[1,1],[1,0],[1,0],null,[2,0],[1,0],[1,1],[0,0]],    // 59
  [[1,1],[3,2],[1,1],[1,2],[2,1],[2,1],null,[2,1],[2,1],[3,0],[3,2]],    // 60
  [[1,2],[2,3],[1,3],[1,2],[1,3],[1,3],null,[0,2],[1,3],[1,2],[2,3]],    // 61
  [[2,0],[2,1],[1,1],[2,0],[1,0],[1,0],null,[2,0],[2,0],[2,1],[2,1]],    // 62
  [[1,1],[1,1],[1,1],[1,1],[0,0],[0,0],null,[1,1],[1,2],[0,0],[1,1]],    // 63
  [[2,2],[1,2],[1,2],[1,1],[2,3],[2,3],null,[1,2],[1,2],[1,2],[1,2]],    // 64
  [[0,0],[2,0],[1,1],[2,1],[1,1],[1,1],null,[1,0],[2,2],[2,2],[2,0]],    // 65
  [[0,2],[0,3],[0,2],[1,2],[0,2],[0,2],null,[0,2],[1,3],[0,3],[0,3]],    // 66
  [[2,1],[1,1],[1,0],[1,1],[2,1],[2,1],null,[2,1],[2,1],[3,1],[1,1]],    // 67
  [[0,3],[0,2],[0,2],[1,2],[0,3],[0,3],null,[0,3],[2,4],[0,2],[0,2]],    // 68
  [[1,2],[2,2],[1,2],[2,2],[2,3],[2,3],null,[1,1],[0,1],[1,3],[2,2]],    // 69
  [[1,1],[1,0],[1,1],[1,1],[1,1],[1,1],null,[2,1],[2,1],[0,0],[1,0]],    // 70
  [[1,2],[1,1],[1,1],[1,2],[2,0],[2,0],null,[1,1],[2,2],[2,0],[1,1]],    // 71
  [[0,4],[1,4],[0,3],[1,3],[0,4],[0,4],null,[0,3],[0,3],[1,1],[1,4]],    // 72
];

async function main() {
  // FORCE_RESEED=true en Railway para forzar un re-seed puntual; luego quitar la variable
  const existing = await prisma.participant.count();
  if (existing > 0 && process.env.FORCE_RESEED !== 'true') {
    console.log(`✅ BD ya inicializada (${existing} participantes). Saltando seed.`);
    return;
  }
  if (process.env.FORCE_RESEED === 'true') {
    console.log('⚠️  FORCE_RESEED activo — re-sembrando desde cero...');
  }

  console.log('🌍 Sembrando Porra Mundial 2026 (datos reales)...');

  await prisma.prediction.deleteMany();
  await prisma.match.deleteMany();
  await prisma.participant.deleteMany();

  const participants = await Promise.all(
    participantNames.map(name => prisma.participant.create({ data: { name } }))
  );
  console.log(`✅ ${participants.length} participantes`);

  await prisma.match.createMany({ data: matchDefs });
  const played = matchDefs.filter(m => m.homeScore !== null).length;
  console.log(`✅ ${matchDefs.length} partidos (${played} con resultado demo)`);

  const allMatches = await prisma.match.findMany({ orderBy: { matchNumber: 'asc' } });
  let totalPreds = 0;
  let skipped = 0;

  for (let pi = 0; pi < participants.length; pi++) {
    const participant = participants[pi];
    const rows = [];
    for (let mi = 0; mi < allMatches.length; mi++) {
      const pred = predData[mi]?.[pi];
      if (pred == null) { skipped++; continue; }
      rows.push({
        participantId: participant.id,
        matchId:       allMatches[mi].id,
        homeScore:     pred[0],
        awayScore:     pred[1],
      });
    }
    await prisma.prediction.createMany({ data: rows });
    totalPreds += rows.length;
  }
  console.log(`✅ ${totalPreds} predicciones (${skipped} sin pronostico — Carlos P.)`);

  console.log('\n📊 Puntuación actual (partidos con resultado):');
  for (const p of participants) {
    const preds = await prisma.prediction.findMany({
      where: { participantId: p.id },
      include: { match: true },
    });
    let pts = 0;
    for (const pred of preds) {
      const { homeScore: rH, awayScore: rA } = pred.match;
      if (rH === null) continue;
      if (pred.homeScore === rH && pred.awayScore === rA) pts += 3;
      else if (Math.sign(pred.homeScore - pred.awayScore) === Math.sign(rH - rA)) pts += 1;
    }
    console.log(`   ${p.name}: ${pts} pts`);
  }

  console.log('\n🎉 ¡Listo!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
