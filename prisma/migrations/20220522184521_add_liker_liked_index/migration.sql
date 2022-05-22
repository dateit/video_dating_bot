-- CreateIndex
CREATE INDEX "Likes_likedId_idx" ON "Likes"("likedId");

-- CreateIndex
CREATE INDEX "Likes_likerId_idx" ON "Likes"("likerId");

-- CreateIndex
CREATE INDEX "find_disliked_liked" ON "Likes"("likedId", "dislike");
