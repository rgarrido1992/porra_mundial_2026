/**
 * Elimina participantes duplicados en minúsculas, mantiene los de MAYÚSCULAS.
 * Uso: node prisma/cleanupDuplicates.js
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allParticipants = await prisma.participant.findMany();

  // Agrupar por nombre normalizado (mayúsculas)
  const normalized = {};
  for (const p of allParticipants) {
    const key = p.name.toUpperCase();
    if (!normalized[key]) normalized[key] = [];
    normalized[key].push(p);
  }

  let deletedCount = 0;

  // Para cada grupo de duplicados
  for (const key of Object.keys(normalized)) {
    const group = normalized[key];
    if (group.length === 1) continue; // No es duplicado

    console.log(`\n🔍 Duplicados encontrados para: "${key}"`);
    group.forEach(p => console.log(`   - ${p.name} (id: ${p.id})`));

    // Mantener el que esté en mayúsculas, eliminar los demás
    const uppercase = group.find(p => p.name === key);
    const toDelete = group.filter(p => p.id !== uppercase.id);

    for (const del of toDelete) {
      // Migrar predicciones a la versión en mayúsculas si las tiene
      const preds = await prisma.prediction.findMany({
        where: { participantId: del.id },
      });

      if (preds.length > 0) {
        console.log(`   Migrando ${preds.length} predicciones de "${del.name}" → "${uppercase.name}"`);
        // Eliminar predicciones del duplicado (upsert en el uppercase las reemplazará si es necesario)
        await prisma.prediction.deleteMany({
          where: { participantId: del.id },
        });
      }

      // Eliminar participante en minúsculas
      await prisma.participant.delete({
        where: { id: del.id },
      });

      console.log(`   ❌ Eliminado: ${del.name}`);
      deletedCount++;
    }
  }

  console.log(`\n✅ ${deletedCount} participante(s) duplicado(s) eliminado(s)`);
  console.log('🎉 ¡Listo!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
