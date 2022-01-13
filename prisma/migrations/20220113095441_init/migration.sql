-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "mpm" INTEGER NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL,
    "threshold" INTEGER NOT NULL,
    "slowmode" INTEGER NOT NULL,
    "channelId" TEXT NOT NULL,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_id_key" ON "Channel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Rule_channelId_key" ON "Rule"("channelId");

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
