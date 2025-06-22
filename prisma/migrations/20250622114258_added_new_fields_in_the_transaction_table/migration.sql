-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "fiatAmountInUsd" TEXT,
ADD COLUMN     "paymentOptionId" TEXT,
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "statusHistories" JSONB;
