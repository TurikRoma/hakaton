import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;
export const prisma = new PrismaClient();
