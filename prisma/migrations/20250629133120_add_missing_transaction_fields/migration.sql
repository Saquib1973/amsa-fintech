-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "amountPaid" INTEGER,
ADD COLUMN     "cardPaymentData" JSONB,
ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "cryptoAmount" DOUBLE PRECISION,
ADD COLUMN     "stateCode" TEXT,
ADD COLUMN     "statusReason" TEXT,
ADD COLUMN     "totalFeeInFiat" DOUBLE PRECISION,
ADD COLUMN     "transakFeeAmount" DOUBLE PRECISION;
