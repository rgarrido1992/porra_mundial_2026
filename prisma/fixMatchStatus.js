/**
 * Corrige el status de partidos que ya pasaron su fecha programada
 * Si un partido tiene homeScore/awayScore y ya pasó su fecha, marca como 'finished'
 * Si un partido pasó su fecha pero no tiene resultados, marca como 'scheduled' (aún no jugado)
 * Uso: node prisma/fixMatchStatus.js
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const matches = await prisma.match.findMany({
    where: { stage: 'group' },
  });

  console.log(`🔍 Verificando ${matches.length} partidos...`);

  let fixed = 0;
  for (const match of matches) {
    const matchDate = new Date(match.matchDate);
    const hasResult = match.homeScore !== null && match.awayScore !== null;

    // Si el partido ya pasó su fecha
    if (matchDate < now) {
      // Si tiene resultado, debería estar finished
      if (hasResult && match.status !== 'finished') {
        await prisma.match.update({
          where: { id: match.id },
          data: { status: 'finished' },
        });
        console.log(`✅ ${match.matchNumber}. ${match.homeTeam} vs ${match.awayTeam}: scheduled → finished`);
        fixed++;
      }
      // Si no tiene resultado, debería estar scheduled (o posiblemente postponed)
      else if (!hasResult && match.status !== 'scheduled') {
        await prisma.match.update({
          where: { id: match.id },
          data: { status: 'scheduled' },
        });
        console.log(`⏸️  ${match.matchNumber}. ${match.homeTeam} vs ${match.awayTeam}: ${match.status} → scheduled (sin resultado)`);
        fixed++;
      }
    }
  }

  console.log(`\n✅ ${fixed} partido(s) corregido(s)`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
