/**
 * Inserta / actualiza los pronósticos de Fran T. y Jacobo E. en la BD existente.
 * Idempotente: se puede ejecutar varias veces sin problemas.
 * Uso: node prisma/addPredictions.js
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Orden: matchNumber 1→72 (mismo orden que el seed)
// Formato: [homeScore, awayScore]
const francPreds = [
  [1,1],[0,1],[1,2],[2,1],[0,2],[3,1],[0,1],[1,1],[3,0],[3,1],  // 1-10
  [1,1],[1,0],[2,0],[1,0],[1,3],[1,0],[3,0],[0,3],[1,1],[1,0],  // 11-20
  [3,0],[1,2],[1,1],[0,2],[2,0],[1,2],[1,0],[2,2],[2,2],[2,3],  // 21-30
  [4,0],[2,1],[2,1],[3,1],[2,0],[1,2],[1,0],[3,1],[2,0],[1,2],  // 31-40
  [2,0],[2,0],[3,2],[0,1],[3,0],[2,1],[0,1],[2,2],[3,1],[2,2],  // 41-50
  [2,0],[2,2],[0,3],[2,1],[0,1],[1,2],[1,2],[0,2],[1,2],[1,2],  // 51-60
  [2,3],[3,1],[1,2],[0,1],[0,0],[2,4],[2,1],[1,3],[2,3],[1,0],  // 61-70
  [2,1],[0,2],                                                    // 71-72
];

const jacoboPreds = [
  [2,0],[1,1],[2,1],[2,0],[1,2],[2,2],[0,2],[1,3],[5,0],[2,0],  // 1-10
  [1,1],[2,0],[4,0],[3,0],[1,1],[2,0],[3,2],[0,3],[3,1],[1,0],  // 11-20
  [4,0],[3,1],[1,1],[0,4],[2,0],[2,1],[1,0],[2,2],[2,1],[1,3],  // 21-30
  [5,0],[2,1],[1,2],[1,2],[1,0],[1,2],[3,0],[3,1],[3,0],[0,2],  // 31-40
  [2,0],[3,0],[2,2],[0,1],[3,0],[2,1],[1,3],[2,0],[1,1],[1,2],  // 41-50
  [3,0],[1,2],[0,1],[0,1],[0,3],[1,1],[0,2],[0,2],[1,1],[1,0],  // 51-60
  [2,1],[3,0],[1,0],[1,2],[0,0],[0,4],[2,1],[1,5],[1,3],[1,0],  // 61-70
  [2,1],[0,4],                                                    // 71-72
];

async function upsertPreds(participant, matches, preds) {
  let count = 0;
  for (let i = 0; i < matches.length; i++) {
    const [homeScore, awayScore] = preds[i];
    await prisma.prediction.upsert({
      where: {
        participantId_matchId: { participantId: participant.id, matchId: matches[i].id },
      },
      create: { participantId: participant.id, matchId: matches[i].id, homeScore, awayScore },
      update: { homeScore, awayScore },
    });
    count++;
  }
  return count;
}

async function main() {
  const matches = await prisma.match.findMany({
    where:   { stage: 'group' },
    orderBy: { matchNumber: 'asc' },
  });

  if (matches.length !== 72) {
    console.warn(`⚠️  Se esperaban 72 partidos de grupo, se encontraron ${matches.length}`);
  }

  const fran   = await prisma.participant.findFirst({ where: { name: 'Fran T.' } });
  const jacobo = await prisma.participant.findFirst({ where: { name: 'Jacobo E.' } });

  if (!fran)   throw new Error('Participante "Fran T." no encontrado en la BD');
  if (!jacobo) throw new Error('Participante "Jacobo E." no encontrado en la BD');

  const nFran   = await upsertPreds(fran,   matches, francPreds);
  console.log(`✅ ${nFran} pronósticos de ${fran.name} insertados/actualizados`);

  const nJacobo = await upsertPreds(jacobo, matches, jacoboPreds);
  console.log(`✅ ${nJacobo} pronósticos de ${jacobo.name} insertados/actualizados`);

  console.log('🎉 ¡Listo!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
