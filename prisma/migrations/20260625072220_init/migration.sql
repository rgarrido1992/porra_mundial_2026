-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchNumber" INTEGER NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "matchDate" DATETIME NOT NULL,
    "stage" TEXT NOT NULL,
    "group" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "minute" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Match" ("awayScore", "awayTeam", "createdAt", "group", "homeScore", "homeTeam", "id", "matchDate", "matchNumber", "stage", "updatedAt") SELECT "awayScore", "awayTeam", "createdAt", "group", "homeScore", "homeTeam", "id", "matchDate", "matchNumber", "stage", "updatedAt" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE UNIQUE INDEX "Match_matchNumber_key" ON "Match"("matchNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
