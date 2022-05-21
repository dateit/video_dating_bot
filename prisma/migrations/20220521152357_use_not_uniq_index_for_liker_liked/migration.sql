-- DropIndex
DROP INDEX "Likes_likedId_mutual_key";

-- DropIndex
DROP INDEX "Likes_likerId_mutual_key";

-- CreateIndex
CREATE INDEX "find_mutual_liked" ON "Likes"("likedId", "mutual");

-- CreateIndex
CREATE INDEX "find_mutual_liker" ON "Likes"("likerId", "mutual");
