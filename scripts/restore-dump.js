/**
 * Script para restaurar DUMP de Railway a BD local
 * Uso: node scripts/restore-dump.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function restoreDump() {
  try {
    console.log('📂 Leyendo dump...');
    const dump = JSON.parse(fs.readFileSync('railway-dump.json', 'utf8'));

    console.log('🔄 Restaurando datos en BD local...\n');

    // Limpiar datos previos
    console.log('🧹 Limpiando datos previos...');
    await prisma.prediction.deleteMany({});
    await prisma.match.deleteMany({});
    await prisma.participant.deleteMany({});
    console.log('✅ Limpiado\n');

    // Restaurar Participants
    console.log(`👥 Restaurando ${dump.participants.length} participantes...`);
    for (const p of dump.participants) {
      await prisma.participant.create({
        data: {
          id: p.id,
          name: p.name,
          createdAt: new Date(p.createdAt),
        },
      });
    }
    console.log('✅ Participantes restaurados\n');

    // Restaurar Matches
    console.log(`⚽ Restaurando ${dump.matches.length} partidos...`);
    for (const m of dump.matches) {
      await prisma.match.create({
        data: {
          id: m.id,
          matchNumber: m.matchNumber,
          homeTeam: m.homeTeam,
          awayTeam: m.awayTeam,
          homeScore: m.homeScore,
          awayScore: m.awayScore,
          matchDate: new Date(m.matchDate),
          stage: m.stage,
          group: m.group,
          status: m.status,
          minute: m.minute,
          createdAt: new Date(m.createdAt),
          updatedAt: new Date(m.updatedAt),
        },
      });
    }
    console.log('✅ Partidos restaurados\n');

    // Restaurar Predictions
    console.log(`🎯 Restaurando ${dump.predictions.length} pronósticos...`);
    for (const pred of dump.predictions) {
      await prisma.prediction.create({
        data: {
          id: pred.id,
          participantId: pred.participantId,
          matchId: pred.matchId,
          homeScore: pred.homeScore,
          awayScore: pred.awayScore,
          createdAt: new Date(pred.createdAt),
        },
      });
    }
    console.log('✅ Pronósticos restaurados\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('✨ RESTAURACIÓN COMPLETADA');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\nAhora puedes:');
    console.log('npm start\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

restoreDump();
