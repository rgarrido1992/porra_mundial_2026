/**
 * Agrega múltiples participantes a DATOS PORRA.MD
 * Formato: participantes en columnas (tab-separated) con sus pronósticos debajo
 * Uso: node scripts/addMultipleParticipants.js
 */
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'instrucciones', 'DATOS PORRA.MD');
const newFile = path.join(__dirname, '..', 'instrucciones', 'NUEVO PARTICIPANTE.MD');

const dataContent = fs.readFileSync(dataFile, 'utf-8');
const newContent = fs.readFileSync(newFile, 'utf-8');

const dataLines = dataContent.split('\n');
const newLines = newContent.split('\n');

// Línea 1: nombres de participantes (tab-separated)
const newParticipants = newLines[0].split('\t').map(n => n.trim());
console.log(`📄 Leyendo ${newParticipants.length} participantes del archivo...`);
console.log(`   ${newParticipants.join(', ')}`);

// Línea 1 de DATOS: participantes actuales
const currentParticipants = dataLines[0].split(';').map(n => n.trim());
const existingSet = new Set(currentParticipants);

// Identificar nuevos participantes
const newPartsToAdd = newParticipants.filter(p => !existingSet.has(p));
console.log(`\n🆕 Nuevos participantes: ${newPartsToAdd.length}`);
newPartsToAdd.forEach(p => console.log(`   - ${p}`));

if (newPartsToAdd.length === 0) {
  console.log('✅ No hay nuevos participantes que agregar');
  process.exit(0);
}

// Parsear datos del archivo nuevo (formato: pares home/away en líneas, tab-separated)
const newData = {}; // { participantName: [[h1,a1], [h2,a2], ...], ... }

for (const part of newParticipants) {
  newData[part] = [];
}

let i = 1;
while (i < newLines.length) {
  const homeLine = newLines[i]?.trim();
  const awayLine = newLines[i + 1]?.trim();

  if (!homeLine || !awayLine) {
    i += 3; // Saltar línea en blanco
    continue;
  }

  const homeScores = homeLine.split('\t').map(v => v.trim());
  const awayScores = awayLine.split('\t').map(v => v.trim());

  for (let pi = 0; pi < newParticipants.length; pi++) {
    const part = newParticipants[pi];
    const h = parseInt(homeScores[pi], 10);
    const a = parseInt(awayScores[pi], 10);

    if (!isNaN(h) && !isNaN(a)) {
      newData[part].push([h, a]);
    }
  }

  i += 3;
}

// Verificar que cada participante tenga 72 pronósticos
for (const part of newParticipants) {
  if (newData[part].length !== 72) {
    console.error(`❌ ${part}: se esperaban 72 pronósticos, se encontraron ${newData[part].length}`);
    process.exit(1);
  }
}

// Actualizar DATOS PORRA.MD
const updatedLines = [];

// Línea 1: agregar nuevos participantes
const newHeader = currentParticipants.concat(newPartsToAdd).join(';');
updatedLines.push(newHeader);

// Líneas de datos: agregar columnas para nuevos participantes
let matchIdx = 0;
i = 1;

while (i < dataLines.length) {
  const homeLine = dataLines[i];
  const awayLine = dataLines[i + 1];

  if (homeLine.trim() === '' || awayLine.trim() === '') {
    updatedLines.push(homeLine);
    i++;
    continue;
  }

  // Agregar columnas de nuevos participantes
  let updatedHomeLine = homeLine;
  let updatedAwayLine = awayLine;

  for (const part of newPartsToAdd) {
    const [h, a] = newData[part][matchIdx];
    updatedHomeLine += '\t' + h;
    updatedAwayLine += '\t' + a;
  }

  updatedLines.push(updatedHomeLine);
  updatedLines.push(updatedAwayLine);
  matchIdx++;
  i += 2;
}

// Escribir archivo actualizado
const updatedContent = updatedLines.join('\n');
fs.writeFileSync(dataFile, updatedContent, 'utf-8');

const totalParticipants = currentParticipants.length + newPartsToAdd.length;
console.log(`\n✅ ${newPartsToAdd.length} participante(s) agregado(s) a DATOS PORRA.MD`);
console.log(`📊 Total participantes: ${totalParticipants}`);
