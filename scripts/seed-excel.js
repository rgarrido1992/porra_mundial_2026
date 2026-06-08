/**
 * Fase 2: Ingestión de datos desde archivo Excel
 * Uso: npm run db:seed-excel -- ruta/al/archivo.xlsx
 *
 * Hojas esperadas en el Excel:
 *   - "Partidos":      matchNumber | homeTeam | awayTeam | homeScore | awayScore | matchDate | stage | group
 *   - "Participantes": name
 *   - "Predicciones":  participantName | matchNumber | homeScore | awayScore
 *
 * Instalar dependencia cuando esté listo: npm install xlsx
 */

// const xlsx = require('xlsx');
const path = require('path');
const prisma = require('../src/config/database');

async function seedFromExcel(filePath) {
  console.log(`📂 Leyendo archivo: ${filePath}`);

  // const workbook = xlsx.readFile(filePath);

  // --- Partidos ---
  // const matchSheet = workbook.Sheets['Partidos'];
  // const matches = xlsx.utils.sheet_to_json(matchSheet);
  // await prisma.match.createMany({ data: matches.map(mapMatch), skipDuplicates: true });

  // --- Participantes ---
  // const partSheet = workbook.Sheets['Participantes'];
  // const participants = xlsx.utils.sheet_to_json(partSheet);
  // await prisma.participant.createMany({ data: participants, skipDuplicates: true });

  // --- Predicciones ---
  // const predSheet = workbook.Sheets['Predicciones'];
  // const predictions = xlsx.utils.sheet_to_json(predSheet);
  // ... mapear participantName → participantId y matchNumber → matchId ...
  // await prisma.prediction.createMany({ data: mappedPredictions, skipDuplicates: true });

  throw new Error('⚠️  Fase 2 pendiente de implementación. Descomenta el código cuando instales xlsx.');
}

const filePath = process.argv[2] || path.join(__dirname, '../data/porra.xlsx');
seedFromExcel(filePath)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
