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
        const { label, imgUrl } = body;
        if(!label) {
            return new NextResponse("Label is Required", { status: 400 })
        }

        if(!imgUrl) {
            return new NextResponse("Image is Required", { status: 400 })
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

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imgUrl,
                storeId
            }
        })
        // console.log("created!")

        return NextResponse.json(billboard);

    } catch(error) {
        console.log("BILLBOARD_POST", error);
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

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId
            }
        })

        return NextResponse.json(billboards);

    } catch(error) {
        console.log("BILLBOARD_GET", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}
