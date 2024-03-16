/*
  Warnings:

  - You are about to drop the column `start_at` on the `event` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "duration" INTEGER,
    "element_id" INTEGER,
    CONSTRAINT "event_element_id_fkey" FOREIGN KEY ("element_id") REFERENCES "capsule_element" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_event" ("action", "duration", "element_id", "id", "name") SELECT "action", "duration", "element_id", "id", "name" FROM "event";
DROP TABLE "event";
ALTER TABLE "new_event" RENAME TO "event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
