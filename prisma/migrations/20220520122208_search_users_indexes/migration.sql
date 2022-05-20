/*
  Warnings:

  - A unique constraint covering the columns `[likedId,likesId,mutual]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,gender,lookingFor]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Likes_likedId_likesId_mutual_key" ON "Likes"("likedId", "likesId", "mutual");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_gender_lookingFor_key" ON "User"("id", "gender", "lookingFor");
