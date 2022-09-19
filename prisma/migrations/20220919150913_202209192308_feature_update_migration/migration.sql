/*
  Warnings:

  - You are about to drop the column `session` on the `User` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Split` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_session_key";

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Split" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "session";

-- CreateTable
CREATE TABLE "FriendExpense" (
    "id" SERIAL NOT NULL,
    "payerId" INTEGER NOT NULL,
    "userOwingMoneyId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FriendExpense_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FriendExpense" ADD CONSTRAINT "FriendExpense_payerId_userOwingMoneyId_fkey" FOREIGN KEY ("payerId", "userOwingMoneyId") REFERENCES "FriendPair"("user1Id", "user2Id") ON DELETE RESTRICT ON UPDATE CASCADE;
