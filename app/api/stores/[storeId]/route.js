import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(request, {params: {storeId}}) {
    try {
        // console.log(storeId)
        const { userId } = auth();
        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const body = await request.json();
        const { name } = body;
        if(!name) {
            return new NextResponse("Name is Required", { status: 400 })
        }

        if(!storeId) {
            return new NextResponse("Store id is Required", { status: 400 })
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: storeId,
                userId
            },
            data: {
                name
            }
        })

        return NextResponse.json(store);

    } catch(error) {
        console.log("STORE_PATCH", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(request, {params: {storeId}}) {
    try {
        const { userId } = auth();
        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if(!storeId) {
            return new NextResponse("Store id is Required", { status: 400 })
        }

        const store = await prismadb.store.deleteMany({
            where: {
                id: storeId,
                userId
            }
        })

        return NextResponse.json(store);

    } catch(error) {
        console.log("STORE_PATCH", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}