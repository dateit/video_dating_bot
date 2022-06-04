-- CreateIndex
CREATE INDEX "Likes_likedId_dislike_mutual_idx" ON "Likes"("likedId", "dislike", "mutual");
