/**
 * Lee instrucciones/DATOS PORRA.MD y actualiza las predicciones en la BD.
 * Formato del archivo: tab-separated values con pares de líneas (home score, away score)
 * Participa
ntes sin pronósticos completos no tendrán predicciones.
 * Uso: node prisma/updateFromDataFile.js
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const dataFile = path.join(__dirname, '..', 'instrucciones', 'DATOS PORRA.MD');

async function main() {
  const content = fs.readFileSync(dataFile, 'utf-8');
  const lines = content.split('\n').map(l => l.trim());

  // Línea 1: nombres de participantes (tab-separated)
  const headers = lines[0].split('\t').map(h => h.trim());
  console.log(`📄 Leyendo ${headers.length} participantes del archivo...`);

  // Cargar todos los partidos en orden
  const matches = await prisma.match.findMany({
    where: { stage: 'group' },
    orderBy: { matchNumber: 'asc' },
  });
  console.log(`📋 ${matches.length} partidos encontrados en BD`);

  if (matches.length !== 72) {
    console.warn(`⚠️  Se esperaban 72 partidos, se encontraron ${matches.length}`);
  }

  // Parse: pares de líneas (home, away) separadas por línea en blanco
  let matchIdx = 0;
  let lineIdx = 1; // saltamos header

  const allPreds = {}; // { participantName: { matchNumber: [homeScore, awayScore], ... }, ... }

  while (lineIdx < lines.length && matchIdx < matches.length) {
    const homeLine = lines[lineIdx];
    const awayLine = lines[lineIdx + 1];
    lineIdx += 2;

    // Saltamos línea en blanco si existe
    if (lineIdx < lines.length && lines[lineIdx] === '') {
      lineIdx++;
    }

    if (!homeLine || !awayLine) break;

    const homeScores = homeLine.split('\t').map(v => v.trim());
    const awayScores = awayLine.split('\t').map(v => v.trim());

    const match = matches[matchIdx];
    const matchNumber = match.matchNumber;

    // Para cada participante, almacena su predicción
    for (let pi = 0; pi < headers.length; pi++) {
      const participant = headers[pi];
      const homeScore = parseInt(homeScores[pi], 10);
      const awayScore = parseInt(awayScores[pi], 10);

      if (isNaN(homeScore) || isNaN(awayScore)) {
        console.warn(`⚠️  Predicción inválida en partido ${matchNumber}, participante ${participant}: ${homeScores[pi]}-${awayScores[pi]}`);
        continue;
      }

      if (!allPreds[participant]) allPreds[participant] = {};
      allPreds[participant][matchNumber] = [homeScore, awayScore];
    }

    matchIdx++;
  }

  console.log(`\n✅ Parseadas ${Object.keys(allPreds).length} participantes`);

  // Actualizar o crear predicciones en BD
  let createdCount = 0;
  let updatedCount = 0;

  for (const participantName of Object.keys(allPreds)) {
    // Buscar o crear el participante
    let participant = await prisma.participant.findUnique({
      where: { name: participantName },
    });

    if (!participant) {
      participant = await prisma.participant.create({
        data: { name: participantName },
      });
      console.log(`✨ Participante creado: ${participantName}`);
    }

    const preds = allPreds[participantName];
    let countForParticipant = 0;

    for (const matchNumber of Object.keys(preds).map(Number).sort((a, b) => a - b)) {
      const [homeScore, awayScore] = preds[matchNumber];
      const match = matches.find(m => m.matchNumber === matchNumber);

      if (!match) {
        console.warn(`⚠️  Partido ${matchNumber} no encontrado en BD`);
        continue;
      }

      const result = await prisma.prediction.upsert({
        where: {
          participantId_matchId: { participantId: participant.id, matchId: match.id },
        },
        create: { participantId: participant.id, matchId: match.id, homeScore, awayScore },
        update: { homeScore, awayScore },
      });

      if (result.createdAt === result.updatedAt) {
        createdCount++;
      } else {
        updatedCount++;
      }
      countForParticipant++;
    }

    console.log(`   ${participantName}: ${countForParticipant} pronósticos`);
  }

  console.log(`\n📊 Resumen:`);
  console.log(`   ${createdCount} predicciones creadas`);
  console.log(`   ${updatedCount} predicciones actualizadas`);

  // Identificar y reportar participantes en BD sin pronósticos en el archivo
  const allDbParticipants = await prisma.participant.findMany();
  const participantsInFile = new Set(Object.keys(allPreds));
  const notInFile = allDbParticipants.filter(p => !participantsInFile.has(p.name));

  if (notInFile.length > 0) {
    console.log(`\n⚠️  Participantes en BD pero NO en el archivo (sin pronósticos):`);
    for (const p of notInFile) {
      console.log(`   - ${p.name}`);
    }
  }

  console.log('\n🎉 ¡Listo!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
