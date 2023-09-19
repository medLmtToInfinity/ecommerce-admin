import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request, {params: {storeId}}) {
    try {
        const { userId } = auth();
        if(!userId) {
            return new NextResponse("Unauthenticated", {status: 401})
        }

        const body = await request.json();
        const { name, value } = body;
        // console.log(`name: ${name} \n value: ${value}`)
        if(!name) {
            return new NextResponse("Name is Required", { status: 400 })
        }

        if(!value) {
            return new NextResponse("Value is Required", { status: 400 })
        }


        if(!storeId) {
            return new NextResponse("Store id is Required", { status: 400 })
        }

        const store = await prismadb.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        })

        if(!store) {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        const color = await prismadb.color.create({
            data: {
                name,
                value,
                storeId
            }
        })
        // console.log("created!")

        return NextResponse.json(color);

    } catch(error) {
        console.log("COLOR_POST", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}


export async function GET(request, {params: {storeId}}) {
    try {
        if(!storeId) {
            return new NextResponse("Store id is Required", { status: 400 })
        }

        const store = await prismadb.store.findFirst({
            where: {
                id: storeId,
            }
        })

        if(!store) {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        const colors = await prismadb.color.findMany({
            where: {
                storeId
            }
        })

        return NextResponse.json(colors);

    } catch(error) {
        console.log("COLORS_GET", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}
