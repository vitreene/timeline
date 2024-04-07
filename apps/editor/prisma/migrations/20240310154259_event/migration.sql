/*
  Warnings:

  - You are about to drop the `Capsule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CapsuleElement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Scene` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Capsule";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CapsuleElement";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Event";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Media";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Scene";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "scene" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "path" TEXT,
    "content" TEXT
);

-- CreateTable
CREATE TABLE "capsule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "scene_id" INTEGER NOT NULL,
    CONSTRAINT "capsule_scene_id_fkey" FOREIGN KEY ("scene_id") REFERENCES "scene" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "capsule_element" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" INTEGER NOT NULL,
    "media_id" INTEGER NOT NULL,
    "capsule_id" INTEGER NOT NULL,
    CONSTRAINT "capsule_element_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "capsule_element_capsule_id_fkey" FOREIGN KEY ("capsule_id") REFERENCES "capsule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "start_at" REAL NOT NULL,
    "duration" INTEGER,
    "element_id" INTEGER,
    CONSTRAINT "event_element_id_fkey" FOREIGN KEY ("element_id") REFERENCES "capsule_element" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_scene_media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" INTEGER NOT NULL,
    "events" TEXT NOT NULL,
    "media_id" INTEGER NOT NULL,
    "scene_id" INTEGER NOT NULL,
    CONSTRAINT "scene_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "scene_media_scene_id_fkey" FOREIGN KEY ("scene_id") REFERENCES "scene" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_scene_media" ("events", "id", "media_id", "order", "scene_id") SELECT "events", "id", "media_id", "order", "scene_id" FROM "scene_media";
DROP TABLE "scene_media";
ALTER TABLE "new_scene_media" RENAME TO "scene_media";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
