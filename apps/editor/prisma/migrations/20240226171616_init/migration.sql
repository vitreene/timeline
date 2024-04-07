/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Scene" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "scene_media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" INTEGER NOT NULL,
    "events" TEXT NOT NULL,
    "media_id" INTEGER NOT NULL,
    "scene_id" INTEGER NOT NULL,
    CONSTRAINT "scene_media_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "scene_media_scene_id_fkey" FOREIGN KEY ("scene_id") REFERENCES "Scene" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "path" TEXT,
    "content" TEXT
);

-- CreateTable
CREATE TABLE "Capsule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "scene_id" INTEGER NOT NULL,
    CONSTRAINT "Capsule_scene_id_fkey" FOREIGN KEY ("scene_id") REFERENCES "Scene" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CapsuleElement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" INTEGER NOT NULL,
    "media_id" INTEGER NOT NULL,
    "capsule_id" INTEGER NOT NULL,
    CONSTRAINT "CapsuleElement_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CapsuleElement_capsule_id_fkey" FOREIGN KEY ("capsule_id") REFERENCES "Capsule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "start_at" REAL NOT NULL,
    "element_id" INTEGER,
    CONSTRAINT "Event_element_id_fkey" FOREIGN KEY ("element_id") REFERENCES "CapsuleElement" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
