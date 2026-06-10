/**
 * Agrega un nuevo participante a DATOS PORRA.MD
 * Lee NUEVO PARTICIPANTE.MD y lo combina con DATOS PORRA.MD
 * Uso: node scripts/addNewParticipant.js
 */
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '..', 'instrucciones', 'DATOS PORRA.MD');
const newFile = path.join(__dirname, '..', 'instrucciones', 'NUEVO PARTICIPANTE.MD');

const dataContent = fs.readFileSync(dataFile, 'utf-8');
const newContent = fs.readFileSync(newFile, 'utf-8');

const dataLines = dataContent.split('\n');
const newLines = newContent.split('\n');

// Línea 1 del nuevo archivo: nombre del participante
const newName = newLines[0].trim();
console.log(`Agregando participante: ${newName}`);

// Línea 1 de DATOS: agregar nuevo participante
const headerLine = dataLines[0];
const newHeader = headerLine + ';' + newName;

// Parsear datos del nuevo participante (pares home/away)
const newPreds = [];
let i = 1;
while (i < newLines.length) {
  const home = newLines[i]?.trim();
  const away = newLines[i + 1]?.trim();

  if (home === '' || away === '') {
    i += 3; // Saltar línea en blanco
    continue;
  }

  if (home !== undefined && away !== undefined) {
    newPreds.push([home, away]);
  }

  i += 3; // home, away, blank
}

console.log(`Pronósticos encontrados: ${newPreds.length}`);

if (newPreds.length !== 72) {
  console.error(`❌ Se esperaban 72 pronósticos, se encontraron ${newPreds.length}`);
  process.exit(1);
}

// Combinar datos
const updatedLines = [newHeader];
let predIdx = 0;

// i=1, i=2: primer partido (home, away)
// i=3: blanco
// i=4, i=5: segundo partido
// i=6: blanco
// Patrón: (i-1) % 3 => 0: home, 1: away, 2: blanco

for (let i = 1; i < dataLines.length; i++) {
  const line = dataLines[i];
  const posInPattern = (i - 1) % 3;

  if (posInPattern === 2) {
    // Línea en blanco
    updatedLines.push(line);
    continue;
  }

  // Es una línea de datos
  let updatedLine = line;

  if (posInPattern === 0) {
    // Home score
    updatedLine += '\t' + newPreds[predIdx][0];
  } else {
    // Away score
    updatedLine += '\t' + newPreds[predIdx][1];
    predIdx++;
  }

  updatedLines.push(updatedLine);
}

// Escribir archivo actualizado
const updatedContent = updatedLines.join('\n');
fs.writeFileSync(dataFile, updatedContent, 'utf-8');

console.log(`✅ Participante agregado a DATOS PORRA.MD`);
console.log(`📊 Total participantes: 19`);
