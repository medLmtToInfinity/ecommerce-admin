import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req) {
    // console.log(req)
    try {
        const {userId} = auth();
        const body = await req.json();
        console.log(body)
        const { name } = body;
        // console.log(name, userId)

        if(!userId) {
            console.log("Loggin");
            return new NextResponse("Unauthorized", {status: 401})
        }

        if(!name) {
            return new NextResponse("Name is Required", {status: 400});
        }

        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        });
        return new NextResponse(store);
    } catch(error) {
        console.log("[STORES_ROUTE]", error);
        // console.log(req);
        return new NextResponse("Internal error", {status: 500})
    }
}