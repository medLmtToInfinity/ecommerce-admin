
import { PrismaClient } from "@prisma/client";
//let prisma;
const prismadb = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;
export default prismadb;
