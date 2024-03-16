-- AlterTable
ALTER TABLE "media" ADD COLUMN "lang" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_scene" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT 'Scène'
);
INSERT INTO "new_scene" ("id") SELECT "id" FROM "scene";
DROP TABLE "scene";
ALTER TABLE "new_scene" RENAME TO "scene";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
