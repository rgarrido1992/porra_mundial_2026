const express = require('express');
const router  = express.Router();
const prisma  = require('../config/database');

function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  res.redirect('/admin/login');
}

// ── MANTENIMIENTO ─────────────────────────────────────────────────────────────
router.post('/toggle-maintenance', requireAuth, async (req, res) => {
  const config = await prisma.config.findUnique({ where: { key: 'maintenance' } });
  const isActive = config?.value === 'true';

  if (config) {
    await prisma.config.update({
      where: { key: 'maintenance' },
      data: { value: isActive ? 'false' : 'true' },
    });
  } else {
    await prisma.config.create({
      data: { key: 'maintenance', value: 'true' },
    });
  }

  res.redirect('/admin?saved=mantenimiento');
});

// ── LOGIN ─────────────────────────────────────────────────────────────────────
router.get('/login', (req, res) => {
  if (req.session && req.session.isAdmin) return res.redirect('/admin');
  res.render('admin/login', { error: null });
});

router.post('/login', (req, res) => {
  if (req.body.password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.redirect('/admin');
  } else {
    res.render('admin/login', { error: 'Contraseña incorrecta' });
  }
});

router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// ── PANEL PRINCIPAL ───────────────────────────────────────────────────────────
router.get('/', requireAuth, async (req, res) => {
  const [matches, participants, maintenanceConfig] = await Promise.all([
    prisma.match.findMany({ orderBy: { matchNumber: 'asc' } }),
    prisma.participant.findMany({ orderBy: { name: 'asc' } }),
    prisma.config.findUnique({ where: { key: 'maintenance' } }),
  ]);
  const maintenanceActive = maintenanceConfig?.value === 'true' || false;
  res.render('admin/index', { matches, participants, maintenanceActive, saved: req.query.saved || null });
});

// ── RESULTADOS ────────────────────────────────────────────────────────────────
router.post('/match/:id/result', requireAuth, async (req, res) => {
  const matchId = parseInt(req.params.id, 10);
  const { homeScore, awayScore } = req.body;
  const hS = homeScore === '' ? null : parseInt(homeScore, 10);
  const aS = awayScore === '' ? null : parseInt(awayScore, 10);
  await prisma.match.update({
    where: { id: matchId },
    data: { homeScore: hS, awayScore: aS },
  });
  res.redirect('/admin?saved=resultados');
});

// ── STATUS DEL PARTIDO ─────────────────────────────────────────────────────────
router.post('/match/:id/status', requireAuth, async (req, res) => {
  const matchId = parseInt(req.params.id, 10);
  const { status } = req.body;
  if (!['scheduled', 'live', 'halftime', 'finished'].includes(status)) {
    return res.redirect('/admin?error=status-invalido');
  }
  await prisma.match.update({
    where: { id: matchId },
    data: { status },
  });
  res.redirect('/admin?saved=status');
});

// ── PARTICIPANTES ─────────────────────────────────────────────────────────────
router.post('/participant/add', requireAuth, async (req, res) => {
  const name = (req.body.name || '').trim();
  if (name) await prisma.participant.create({ data: { name } });
  res.redirect('/admin?saved=participante');
});

// ── PREDICCIONES DE UN PARTICIPANTE ──────────────────────────────────────────
router.get('/participant/:id/predictions', requireAuth, async (req, res) => {
  const participantId = parseInt(req.params.id, 10);
  const [participant, matches, predictions] = await Promise.all([
    prisma.participant.findUnique({ where: { id: participantId } }),
    prisma.match.findMany({ orderBy: { matchNumber: 'asc' } }),
    prisma.prediction.findMany({ where: { participantId } }),
  ]);
  if (!participant) return res.redirect('/admin');
  const predMap = {};
  predictions.forEach(p => { predMap[p.matchId] = p; });
  res.render('admin/predictions', {
    participant, matches, predMap, saved: req.query.saved || null,
  });
});

router.post('/participant/:id/predictions', requireAuth, async (req, res) => {
  const participantId = parseInt(req.params.id, 10);
  const matches = await prisma.match.findMany({ orderBy: { matchNumber: 'asc' } });

  await prisma.$transaction(async (tx) => {
    for (const match of matches) {
      const hRaw = req.body[`home_${match.id}`] ?? '';
      const aRaw = req.body[`away_${match.id}`] ?? '';

      if (hRaw === '' || aRaw === '') {
        await tx.prediction.deleteMany({ where: { participantId, matchId: match.id } });
        continue;
      }

      const hS = parseInt(hRaw, 10);
      const aS = parseInt(aRaw, 10);
      if (isNaN(hS) || isNaN(aS)) continue;

      await tx.prediction.upsert({
        where:  { participantId_matchId: { participantId, matchId: match.id } },
        update: { homeScore: hS, awayScore: aS },
        create: { participantId, matchId: match.id, homeScore: hS, awayScore: aS },
      });
    }
  });

  res.redirect(`/admin/participant/${participantId}/predictions?saved=1`);
});

// ── BORRAR PARTIDO ────────────────────────────────────────────────────────────
router.post('/match/:id/delete', requireAuth, async (req, res) => {
  const matchId = parseInt(req.params.id, 10);
  await prisma.$transaction(async (tx) => {
    await tx.prediction.deleteMany({ where: { matchId } });
    await tx.match.delete({ where: { id: matchId } });
  });
  res.redirect('/admin?saved=partido-eliminado');
});

// ── EDITAR PARTIDO ────────────────────────────────────────────────────────────
router.get('/match/:id/edit', requireAuth, async (req, res) => {
  const matchId = parseInt(req.params.id, 10);
  const teamsData = require('../data/teams');
  const teams = Object.keys(teamsData).sort();
  const stages = [
    { value: 'group', label: 'Fase de Grupos' },
    { value: 'round_of_16', label: 'Dieciseisavos' },
    { value: 'quarter', label: 'Octavos' },
    { value: 'semi', label: 'Cuartos' },
    { value: 'semifinal', label: 'Semifinal' },
    { value: 'third_place', label: '3º y 4º puesto' },
    { value: 'final', label: 'Final' },
  ];
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) return res.redirect('/admin');

  // Convertir matchDate a formato datetime-local (YYYY-MM-DDTHH:mm)
  const dateObj = new Date(match.matchDate);
  const localDate = dateObj.toISOString().slice(0, 16);

  res.render('admin/edit-match', { match, teams, stages, localDate, saved: req.query.saved || null });
});

router.post('/match/:id/edit', requireAuth, async (req, res) => {
  const matchId = parseInt(req.params.id, 10);
  const { homeTeam, awayTeam, stage, matchDate } = req.body;

  if (!homeTeam || !awayTeam || !stage || !matchDate) {
    return res.redirect(`/admin/match/${matchId}/edit?error=campos-requeridos`);
  }

  if (homeTeam === awayTeam) {
    return res.redirect(`/admin/match/${matchId}/edit?error=equipos-iguales`);
  }

  await prisma.match.update({
    where: { id: matchId },
    data: {
      homeTeam,
      awayTeam,
      stage,
      matchDate: new Date(matchDate),
    },
  });

  res.redirect('/admin?saved=partido-editado');
});

// ── CREAR PARTIDO ─────────────────────────────────────────────────────────────
router.get('/create-match', requireAuth, async (req, res) => {
  const teamsData = require('../data/teams');
  const teams = Object.keys(teamsData).sort();
  const stages = [
    { value: 'group', label: 'Fase de Grupos' },
    { value: 'round_of_16', label: 'Dieciseisavos' },
    { value: 'quarter', label: 'Octavos' },
    { value: 'semi', label: 'Cuartos' },
    { value: 'semifinal', label: 'Semifinal' },
    { value: 'third_place', label: '3º y 4º puesto' },
    { value: 'final', label: 'Final' },
  ];
  res.render('admin/create-match', { teams, stages, saved: req.query.saved || null });
});

router.post('/create-match', requireAuth, async (req, res) => {
  const { homeTeam, awayTeam, stage, matchDate } = req.body;

  if (!homeTeam || !awayTeam || !stage || !matchDate) {
    return res.redirect('/admin/create-match?error=campos-requeridos');
  }

  if (homeTeam === awayTeam) {
    return res.redirect('/admin/create-match?error=equipos-iguales');
  }

  // Obtener próximo matchNumber
  const lastMatch = await prisma.match.findFirst({
    orderBy: { matchNumber: 'desc' },
  });
  const nextMatchNumber = (lastMatch?.matchNumber || 0) + 1;

  // Crear partido
  await prisma.match.create({
    data: {
      matchNumber: nextMatchNumber,
      homeTeam,
      awayTeam,
      stage,
      group: stage === 'group' ? req.body.group || null : null,
      matchDate: new Date(matchDate),
      status: 'scheduled',
      homeScore: null,
      awayScore: null,
    },
  });

  res.redirect('/admin?saved=partido-creado');
});

module.exports = router;
