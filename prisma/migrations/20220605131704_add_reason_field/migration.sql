-- AlterTable
ALTER TABLE "DeletedVideos" ADD COLUMN     "reason" VARCHAR(256);

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "reason" SET DATA TYPE VARCHAR(256);
