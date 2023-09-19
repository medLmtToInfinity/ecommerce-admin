import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(request, {params: {colorId}}) {
    try {

        const colors = await prismadb.color.findUnique({
            where: {
                id: colorId
            }
        })

        return NextResponse.json(colors);

    } catch(error) {
        console.log("COLOR_GET", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(request, {params: {storeId, colorId}}) {
    try {
        // console.log(storeId)
        const { userId } = auth();
        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const body = await request.json();
        const { name, value } = body;
        if(!name) {
            return new NextResponse("Name is Required", { status: 400 })
        }

        if(! value) {
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

        const color = await prismadb.color.updateMany({
            where: {
                id: colorId
            },
            data: {
                name,
                value,
            }
        })

        return NextResponse.json(color);

    } catch(error) {
        console.log("COLOR_PATCH", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(request, {params: {storeId, colorId}}) {
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

        const color = await prismadb.color.delete({
            where: {
                id: colorId,
            }
        })

        return NextResponse.json(color);

    } catch(error) {
        console.log("COLOR_DELETE", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}