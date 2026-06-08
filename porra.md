Actúa como un desarrollador Full-Stack Senior experto en Node.js y bases de datos relacionales. Vamos a construir una aplicación web para gestionar una "porra" (quiniela de predicciones) del Mundial de Fútbol 2026.

Actualmente tengo los datos de los partidos, participantes y predicciones en un archivo Excel, pero quiero desarrollar el proyecto en dos fases cronológicas bien diferenciadas. En este turno, nos centraremos en la Fase 1, pero dejando la arquitectura totalmente preparada para la Fase 2.

Fase 1: Arquitectura, Lógica y UI con Mock Data (Turno Actual)
Diseña e implementa la aplicación utilizando datos simulados estructurados (un array de objetos o semillas en JS/JSON) que representen unos pocos partidos y participantes de prueba. El objetivo es validar la interfaz y la lógica de puntuación.

1. Stack Tecnológico:

Backend: Node.js con Express.

Base de Datos: SQLite o PostgreSQL (prepara un archivo de configuración de base de datos limpio y modular, usando un ORM como Prisma o directamente consultas SQL limpias).

Frontend: Renderizado desde el servidor (EJS) o HTML modular + Vanilla JS, estilizado de forma nativa con Tailwind CSS.

2. Lógica de Negocio Estricta:
El sistema debe calcular en tiempo real los puntos de cada participante comparando su predicción con el "Resultado Real" guardado en la base de datos:

3 Puntos: Acierto de marcador exacto (Predicción: 2-1 | Real: 2-1).

1 Punto: Acierto de tendencia/ganador/empate, pero no de marcador exacto (Predicción: 2-1 | Real: 3-1; o Predicción: 1-1 | Real: 2-2).

0 Puntos: Falla la tendencia (Predicción: 2-1 | Real: 0-2 o 1-1).

3. Diseño de la Interfaz (UI Premium, No-IA Look):
Evita los diseños genéricos de plantillas de IA (como Bootstrap azul/gris plano). Quiero una interfaz moderna, limpia, de temática deportiva pero minimalista.

Dashboard Principal:

Parte Superior: Tarjetas dinámicas con la clasificación actual (Ranking) de los participantes ordenada de mayor a menor puntuación.

Sección Principal (Matriz de Partidos): Una tabla masiva donde las Filas son los 72 partidos de la Fase de Grupos y las Columnas muestran: Encuentro, Resultado Real, y el nombre de cada participante.

Comportamiento Crítico: La cabecera de la tabla (nombres de los participantes) debe tener sticky top (fija arriba) para no perder la referencia de las columnas al hacer scroll vertical a través de los 72 encuentros.

Celdas: Cada celda debe mostrar el marcador que predijo ese participante. Si el partido ya ha finalizado, debe aplicar un estilo sutil (un color de fondo muy suave o un borde sutil: verde para 3pts, amarillo para 1pt, neutro para 0pts).

4. Escalabilidad del Modelo de Datos:
Diseña las tablas (Partidos, Participantes, Predicciones) pensando en que más adelante añadiremos las fases de eliminatorias (Dieciseisavos, Octavos, Cuartos, Semis, 3º-4º puesto y Final). Incluye un campo fase o stage para filtrarlos fácilmente.

Preparación para la Fase 2: Ingestión desde Excel (Futuro)
Aunque no lo programemos por completo ahora, organiza el código de la base de datos de manera que en el siguiente paso podamos añadir un script independiente (por ejemplo, npm run db:seed-excel) que lea mi archivo .xlsx (usando la librería xlsx) mapee las columnas a nuestras tablas e inserte todos los datos reales de golpe.

Por favor, genera:

La estructura de carpetas del proyecto.

Los esquemas/modelos de la base de datos.

El archivo con los datos de prueba (mock data) para que la web sea 100% funcional desde ya.

El código del servidor (Express) y la vista principal con el diseño Tailwind especificado.