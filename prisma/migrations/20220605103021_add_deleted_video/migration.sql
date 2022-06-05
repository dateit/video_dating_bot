-- AlterTable
ALTER TABLE "Likes" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstname" VARCHAR(128) DEFAULT E'',
ADD COLUMN     "lastname" VARCHAR(128) DEFAULT E'';

-- CreateTable
CREATE TABLE "DeletedVideos" (
    "id" TEXT NOT NULL,
    "videoId" VARCHAR(128) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "DeletedVideos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DeletedVideos_userId_idx" ON "DeletedVideos"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DeletedVideos_videoId_userId_key" ON "DeletedVideos"("videoId", "userId");

-- CreateIndex
CREATE INDEX "User_gender_lookingFor_idx" ON "User"("gender", "lookingFor");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- AddForeignKey
ALTER TABLE "DeletedVideos" ADD CONSTRAINT "DeletedVideos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
