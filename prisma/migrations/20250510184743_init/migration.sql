-- CreateTable
CREATE TABLE "user_messages" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "user_messages_pkey" PRIMARY KEY ("id")
);
