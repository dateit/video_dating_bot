-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ANONYMOUS', 'USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "telegramId" VARCHAR(64) NOT NULL,
    "language" VARCHAR(64) NOT NULL DEFAULT E'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "videoNoteId" TEXT,
    "gender" "Gender",
    "role" "Role" NOT NULL DEFAULT E'ANONYMOUS',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Likes" (
    "id" TEXT NOT NULL,
    "mutual" BOOLEAN NOT NULL DEFAULT false,
    "likedId" TEXT NOT NULL,
    "likesId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "data" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_likedId_fkey" FOREIGN KEY ("likedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_likesId_fkey" FOREIGN KEY ("likesId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
