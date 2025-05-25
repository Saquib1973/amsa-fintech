-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('TRANSACTION_CREATED', 'TRANSACTION_SUCCESSFUL', 'TRANSACTION_FAILED', 'WALLET_CREDITED', 'WALLET_DEBITED', 'NEW_LOGIN_DETECTED', 'PASSWORD_CHANGED', 'KYC_VERIFIED', 'KYC_REJECTED', 'ACCOUNT_VERIFICATION', 'PRICE_ALERT', 'SYSTEM_MESSAGE');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
