/*
  Warnings:

  - You are about to alter the column `videoNoteId` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "lookingFor" "Gender",
ALTER COLUMN "videoNoteId" SET DATA TYPE VARCHAR(128);
