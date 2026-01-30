-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_category_id_fkey";

-- AlterTable
ALTER TABLE "books" ALTER COLUMN "category_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
