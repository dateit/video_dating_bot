-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "telegramMediaId" VARCHAR(128) NOT NULL,
    "telegramMediaType" VARCHAR(64) NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Media_type_idx" ON "Media"("type");
