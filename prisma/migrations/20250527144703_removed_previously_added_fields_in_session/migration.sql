/*
  Warnings:

  - You are about to drop the column `device` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "device",
DROP COLUMN "ip";
