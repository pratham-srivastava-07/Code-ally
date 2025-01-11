-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Editor', 'Viewer');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role";
