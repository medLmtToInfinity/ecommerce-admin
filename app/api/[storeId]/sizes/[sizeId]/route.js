import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(request, {params: {sizeId}}) {
    try {

        const sizes = await prismadb.size.findUnique({
            where: {
                id: sizeId
            }
        })

        return NextResponse.json(sizes);

    } catch(error) {
        console.log("SIZE_GET", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(request, {params: {storeId, sizeId}}) {
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

        const size = await prismadb.size.updateMany({
            where: {
                id: sizeId
            },
            data: {
                name,
                value,
            }
        })

        return NextResponse.json(size);

    } catch(error) {
        console.log("SIZE_PATCH", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(request, {params: {storeId, sizeId}}) {
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

        const size = await prismadb.size.delete({
            where: {
                id: sizeId,
            }
        })

        return NextResponse.json(size);

    } catch(error) {
        console.log("SIZE_DELETE", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}