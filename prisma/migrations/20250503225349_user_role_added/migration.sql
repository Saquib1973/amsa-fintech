-- CreateEnum
CREATE TYPE "USER_TYPE" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" "USER_TYPE" NOT NULL DEFAULT 'USER';
