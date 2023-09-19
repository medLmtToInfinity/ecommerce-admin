import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(request, {params: {billboardId}}) {
    try {

        const billboards = await prismadb.billboard.findUnique({
            where: {
                id: billboardId
            }
        })

        return NextResponse.json(billboards);

    } catch(error) {
        console.log("BILLBOARD_GET", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(request, {params: {storeId, billboardId}}) {
    try {
        // console.log(storeId)
        const { userId } = auth();
        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
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

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: billboardId
            },
            data: {
                label,
                imgUrl
            }
        })

        return NextResponse.json(billboard);

    } catch(error) {
        console.log("BILLBOARD_PATCH", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(request, {params: {storeId, billboardId}}) {
    try {
        const { userId } = auth();
        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
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

        const billboard = await prismadb.billboard.delete({
            where: {
                id: billboardId,
            }
        })

        return NextResponse.json(billboard);

    } catch(error) {
        console.log("BILLBOARD_DELETE", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}