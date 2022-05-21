/*
  Warnings:

  - You are about to drop the column `likesId` on the `Likes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[likedId,likerId]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[likedId,mutual]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[likerId,mutual]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `likerId` to the `Likes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_likesId_fkey";

-- DropIndex
DROP INDEX "Likes_likedId_likesId_key";

-- DropIndex
DROP INDEX "Likes_likedId_likesId_mutual_key";

-- AlterTable
ALTER TABLE "Likes" DROP COLUMN "likesId",
ADD COLUMN     "likerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Likes_likedId_likerId_key" ON "Likes"("likedId", "likerId");

-- CreateIndex
CREATE UNIQUE INDEX "Likes_likedId_mutual_key" ON "Likes"("likedId", "mutual");

-- CreateIndex
CREATE UNIQUE INDEX "Likes_likerId_mutual_key" ON "Likes"("likerId", "mutual");

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_likerId_fkey" FOREIGN KEY ("likerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
