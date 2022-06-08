-- CreateTable
CREATE TABLE "WelcomeQuestions" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WelcomeQuestions_pkey" PRIMARY KEY ("id")
);
