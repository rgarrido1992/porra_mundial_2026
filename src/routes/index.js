const express   = require('express');
const router    = express.Router();
const prisma    = require('../config/database');
const teamsData = require('../data/teams');

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

const FALLBACK = { code:'un', color:'#334155', rgb:'51,65,85' };
const teams = Object.fromEntries(
  Object.entries(teamsData).map(([name,d]) => [name, { ...d, rgb: hexToRgb(d.color) }])
);
function getTeam(name) { return teams[name] || FALLBACK; }

function calcPoints(pH, pA, rH, rA) {
  if (rH === null || rA === null) return null;
  if (pH === rH && pA === rA) return 3;
  if (Math.sign(pH - pA) === Math.sign(rH - rA)) return 1;
  return 0;
}

function dayKey(date) {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday:'long', day:'numeric', month:'long', year:'numeric',
    timeZone:'Europe/Madrid',
  });
}
function matchTime(date) {
  return new Date(date).toLocaleTimeString('es-ES', {
    hour:'2-digit', minute:'2-digit', timeZone:'Europe/Madrid',
  });
}

async function loadData(stageFilter = 'group') {
  const [participants, matches] = await Promise.all([
    prisma.participant.findMany({ orderBy: { id: 'asc' } }),
    prisma.match.findMany({
      where:   { stage: stageFilter },
      include: { predictions: true },
      orderBy: { matchDate: 'asc' },
    }),
  ]);

  const participantScores = participants.map(p => {
    let totalPoints = 0, exactCount = 0, tendencyCount = 0, zeroCount = 0, playedCount = 0;
    matches.forEach(match => {
      const pred = match.predictions.find(pr => pr.participantId === p.id);
      if (!pred) return;
      if (match.status !== 'finished') return;
      const pts = calcPoints(pred.homeScore, pred.awayScore, match.homeScore, match.awayScore);
      if (pts !== null) {
        playedCount++;
        totalPoints += pts;
        if (pts === 3) exactCount++;
        else if (pts === 1) tendencyCount++;
        else zeroCount++;
      }
    });
    return { ...p, totalPoints, exactCount, tendencyCount, zeroCount, playedCount };
  });

  participantScores.sort((a, b) => b.totalPoints - a.totalPoints);
  participantScores.forEach((p, i) => { p.position = i + 1; });

  const matchData = matches.map(match => {
    const isLive     = match.status === 'live' || match.status === 'halftime';
    const isFinished = match.status === 'finished';
    const predictionsMap = {};
    match.predictions.forEach(pred => {
      predictionsMap[pred.participantId] = {
        homeScore: pred.homeScore,
        awayScore: pred.awayScore,
        points: isFinished
          ? calcPoints(pred.homeScore, pred.awayScore, match.homeScore, match.awayScore)
          : null,
      };
    });
    return {
      ...match,
      isLive,
      isFinished,
      predictionsMap,
      timeStr:      matchTime(match.matchDate),
      dateKey:      dayKey(match.matchDate),
      homeTeamData: getTeam(match.homeTeam),
      awayTeamData: getTeam(match.awayTeam),
    };
  });

  const playedMatches = matches.filter(m => m.status === 'finished').length;
  const liveCount     = matches.filter(m => m.status === 'live' || m.status === 'halftime').length;
  const totalMatches  = matches.length;

  return { participantScores, matchData, playedMatches, liveCount, totalMatches };
}

// ── RUTAS ─────────────────────────────────────────────────────────────────────

router.get('/', (req, res) => res.redirect('/fase-grupos'));

router.get('/fase-grupos', async (req, res) => {
  try {
    const data = await loadData();
    res.render('predicciones', data);
  } catch (err) {
    console.error(err);
    res.status(500).send(`<pre>${err.message}</pre>`);
  }
});

router.get('/clasificacion', async (req, res) => {
  try {
    const { participantScores, playedMatches, totalMatches, liveCount } = await loadData();
    res.render('clasificacion', { participantScores, playedMatches, totalMatches, liveCount });
  } catch (err) {
    console.error(err);
    res.status(500).send(`<pre>${err.message}</pre>`);
  }
});

router.get('/api/scores', async (req, res) => {
  const { participantScores } = await loadData();
  res.json(participantScores.map(({ id, name, totalPoints, position }) => ({ id, name, totalPoints, position })));
});

module.exports = router;
