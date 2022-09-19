/*
  Warnings:

  - You are about to drop the column `session` on the `User` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Split` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tokenId_fkey";

-- DropIndex
DROP INDEX "User_session_key";

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Split" ADD COLUMN     "amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "session",
ALTER COLUMN "tokenId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "FriendExpense" (
    "id" SERIAL NOT NULL,
    "payerId" INTEGER NOT NULL,
    "userOwingMoneyId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "FriendExpense_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "OauthToken"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendExpense" ADD CONSTRAINT "FriendExpense_payerId_userOwingMoneyId_fkey" FOREIGN KEY ("payerId", "userOwingMoneyId") REFERENCES "FriendPair"("user1Id", "user2Id") ON DELETE RESTRICT ON UPDATE CASCADE;
