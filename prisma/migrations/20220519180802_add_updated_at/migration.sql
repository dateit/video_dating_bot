/*
  Warnings:

  - A unique constraint covering the columns `[likedId,likesId]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Likes_likedId_likesId_key" ON "Likes"("likedId", "likesId");
