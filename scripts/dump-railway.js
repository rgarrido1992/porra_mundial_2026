/**
 * Script para hacer DUMP de Railway SIN MODIFICAR NADA
 * Solo hace SELECT, exporta a archivo JSON
 * Uso: node scripts/dump-railway.js
 */

const { Client } = require('pg');
const fs = require('fs');

const RAILWAY_URL = 'postgresql://postgres:nhPIGBeECXBfXDBlSDMXSXWlMKXGOdXb@acela.proxy.rlwy.net:40475/railway';

async function dumpRailway() {
  const client = new Client({ connectionString: RAILWAY_URL });

  try {
    console.log('🔐 Conectando a Railway (READ-ONLY)...');
    await client.connect();
    console.log('✅ Conectado\n');

    const dump = {};

    // Dump Participants
    console.log('👥 Leyendo participantes...');
    const participants = await client.query('SELECT * FROM "Participant" ORDER BY id');
    dump.participants = participants.rows;
    console.log(`   ${participants.rows.length} participantes\n`);

    // Dump Matches
    console.log('⚽ Leyendo partidos...');
    const matches = await client.query('SELECT * FROM "Match" ORDER BY "matchNumber"');
    dump.matches = matches.rows;
    console.log(`   ${matches.rows.length} partidos\n`);

    // Dump Predictions
    console.log('🎯 Leyendo pronósticos...');
    const predictions = await client.query('SELECT * FROM "Prediction" ORDER BY id');
    dump.predictions = predictions.rows;
    console.log(`   ${predictions.rows.length} pronósticos\n`);

    // Guardar a archivo
    const dumpFile = 'railway-dump.json';
    fs.writeFileSync(dumpFile, JSON.stringify(dump, null, 2));

    console.log('═══════════════════════════════════════════════════════');
    console.log(`✨ DUMP GUARDADO EN: ${dumpFile}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('\nPróximo paso:');
    console.log('1. npm run db:migrate (crear BD local)');
    console.log('2. node scripts/restore-dump.js (restaurar datos)');
    console.log('3. npm start\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

dumpRailway();
