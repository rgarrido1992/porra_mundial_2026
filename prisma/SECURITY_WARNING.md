# ⚠️ SEGURIDAD CRÍTICA

## Archivos ELIMINADOS DELIBERADAMENTE

**NUNCA** intentes recrear o ejecutar:
- `migrations/` - Contenía comandos que RESETEABAN la BD
- `seed.js` - Contenía datos iniciales que SOBRESCRIBÍAN la BD

## Por qué

El proyecto usa Railway PostgreSQL en producción con datos en vivo. Las migraciones y seed pueden:
- ❌ Borrar todos los partidos, resultados y pronósticos
- ❌ Resetear la BD a estado inicial
- ❌ Causar pérdida total de datos

## Si necesitas cambios en el schema

**NUNCA HAGAS:**
```bash
prisma migrate dev    # ❌ PELIGROSO
prisma db push        # ❌ PELIGROSO
prisma db seed        # ❌ PELIGROSO
npm run db:reset      # ❌ PELIGROSO
```

**SI NECESITAS cambios en Prisma schema:**
1. Consulta con el usuario PRIMERO
2. Haz backup manual de la BD en Railway
3. Cambios SOLO al schema.prisma
4. Usa Prisma Studio para cambios en datos si es necesario

## Datos en la BD

- 72 partidos Fase de Grupos (con resultados)
- 16 partidos Dieciseisavos (con resultados)
- 1,800+ pronósticos
- 25 participantes

**ESTOS DATOS SON VALIOSOS. NO PUEDEN PERDERSE.**