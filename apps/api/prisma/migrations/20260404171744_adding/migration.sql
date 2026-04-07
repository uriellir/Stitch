-- AlterTable
ALTER TABLE "ClothingItem" ADD COLUMN     "formality" INTEGER,
ADD COLUMN     "lastWornAt" TIMESTAMP(3),
ADD COLUMN     "material" TEXT,
ADD COLUMN     "occasionTags" TEXT[],
ADD COLUMN     "pattern" TEXT,
ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "season" TEXT[],
ADD COLUMN     "style" TEXT[],
ADD COLUMN     "subCategory" TEXT,
ADD COLUMN     "temperatureMax" INTEGER,
ADD COLUMN     "temperatureMin" INTEGER,
ADD COLUMN     "warmthLevel" INTEGER,
ADD COLUMN     "wearCount" INTEGER NOT NULL DEFAULT 0;
