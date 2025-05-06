-- CreateEnum
CREATE TYPE "TransactionMethod" AS ENUM ('BUY', 'SELL');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "isBuyOrSell" "TransactionMethod" NOT NULL DEFAULT 'BUY',
    "fiatAmount" INTEGER NOT NULL,
    "fiatCurrency" TEXT NOT NULL,
    "cryptoCurrency" TEXT NOT NULL,
    "walletLink" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
