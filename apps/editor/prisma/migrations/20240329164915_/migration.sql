/*
  Warnings:

  - The primary key for the `event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `event` table. All the data in the column will be lost.
  - Made the column `element_id` on table `event` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_event" (
    "name" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "duration" INTEGER,
    "element_id" INTEGER NOT NULL,

    PRIMARY KEY ("element_id", "action"),
    CONSTRAINT "event_element_id_fkey" FOREIGN KEY ("element_id") REFERENCES "capsule_element" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_event" ("action", "duration", "element_id", "name") SELECT "action", "duration", "element_id", "name" FROM "event";
DROP TABLE "event";
ALTER TABLE "new_event" RENAME TO "event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
