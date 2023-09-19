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
        const { name, billboardId } = body;
        if(!name) {
            return new NextResponse("Name is Required", { status: 400 })
        }

        if(!billboardId) {
            return new NextResponse("Billboard is Required", { status: 400 })
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

        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId
            }
        })
        // console.log("created!")

        return NextResponse.json(category);

    } catch(error) {
        console.log("CATEGORIES_POST", error);
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

        const categories = await prismadb.category.findMany({
            where: {
                storeId
            }
        })

        return NextResponse.json(categories);

    } catch(error) {
        console.log("CATEGORIES_GET", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}
