/**
 * SCRIPT DE BACKUP - Exporta datos de Railway a archivo JSON
 * USO: node scripts/backup-railway.js
 *
 * Crea un backup completo de:
 * - Todos los partidos
 * - Todos los resultados
 * - Todos los pronósticos
 * - Todos los participantes
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function createBackup() {
  try {
    console.log('📦 Creando backup de Railway...');

    const [participants, matches, predictions] = await Promise.all([
      prisma.participant.findMany(),
      prisma.match.findMany(),
      prisma.prediction.findMany(),
    ]);

    const backup = {
      timestamp: new Date().toISOString(),
      participants,
      matches,
      predictions,
      summary: {
        participants: participants.length,
        matches: matches.length,
        predictions: predictions.length,
        matchesByStage: matches.reduce((acc, m) => {
          acc[m.stage] = (acc[m.stage] || 0) + 1;
          return acc;
        }, {}),
      }
    };

    const backupPath = path.join(__dirname, `../backups/backup-${new Date().toISOString().split('T')[0]}.json`);

    // Crear carpeta backups si no existe
    const backupsDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

    console.log(`✅ Backup creado: ${backupPath}`);
    console.log(`   Participantes: ${backup.summary.participants}`);
    console.log(`   Partidos: ${backup.summary.matches}`);
    console.log(`   Pronósticos: ${backup.summary.predictions}`);
    console.log(`   Por stage:`, backup.summary.matchesByStage);

    await prisma.$disconnect();
  } catch (err) {
    console.error('❌ Error en backup:', err.message);
    process.exit(1);
  }
}

createBackup();