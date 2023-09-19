import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(request, {params: {categoryId}}) {
    try {

        const categories = await prismadb.category.findUnique({
            where: {
                id: categoryId
            }
        })

        return NextResponse.json(categories);

    } catch(error) {
        console.log("CATEGORY_GET", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(request, {params: {storeId, categoryId}}) {
    try {
        // console.log(storeId)
        const { userId } = auth();
        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        const body = await request.json();
        const { name, billboardId } = body;
        if(!name) {
            return new NextResponse("Name is Required", { status: 400 })
        }

        if(! billboardId) {
            return new NextResponse(" Billboard is Required", { status: 400 })
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

        const category = await prismadb.category.updateMany({
            where: {
                id: categoryId
            },
            data: {
                name,
                billboardId,
            }
        })

        return NextResponse.json(category);

    } catch(error) {
        console.log("CATEGORY_PATCH", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(request, {params: {storeId, categoryId}}) {
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

        const category = await prismadb.category.delete({
            where: {
                id: categoryId,
            }
        })

        return NextResponse.json(category);

    } catch(error) {
        console.log("CATEGORY_DELETE", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}