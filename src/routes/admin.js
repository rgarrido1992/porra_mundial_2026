const express = require('express');
const router  = express.Router();
const prisma  = require('../config/database');

function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  res.redirect('/admin/login');
}

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
  const [matches, participants] = await Promise.all([
    prisma.match.findMany({ orderBy: { matchNumber: 'asc' } }),
    prisma.participant.findMany({ orderBy: { name: 'asc' } }),
  ]);
  res.render('admin/index', { matches, participants, saved: req.query.saved || null });
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

module.exports = router;
