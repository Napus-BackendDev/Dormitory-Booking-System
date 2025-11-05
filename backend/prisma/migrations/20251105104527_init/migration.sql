/*
  Warnings:

  - The `name` column on the `Role` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Role" DROP COLUMN "name",
ADD COLUMN     "name" JSONB[];

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
