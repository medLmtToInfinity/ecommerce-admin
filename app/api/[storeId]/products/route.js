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
        const { name, images, price, categoryId, sizeId, colorId, isFeatured, isArchived } = body;
        if(!name) {
            return new NextResponse("Name is Required", { status: 400 })
        }

        if(!images.length) {
            return new NextResponse("Images is Required", { status: 400 })
        }
        if(!price) {
            return new NextResponse("Price is Required", { status: 400 })
        }

        if(!categoryId) {
            return new NextResponse("Category is Required", { status: 400 })
        }
        if(!sizeId) {
            return new NextResponse("Size is Required", { status: 400 })
        }

        if(!colorId) {
            return new NextResponse("Color is Required", { status: 400 })
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

        const product = await prismadb.product.create({
            data: {
                name,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image) => image )
                        ]
                    }
                },
                price,
                categoryId,
                sizeId,
                colorId,
                isArchived,
                isFeatured,
                storeId,
            }
        })
        // console.log("created!")

        return NextResponse.json(product);

    } catch(error) {
        console.log("PRODUCTS_POST", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}


export async function GET(request, {params: {storeId}}) {
    try {

        const {searchParams} = new URL(request.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const isFeatured = searchParams.get("isFeatured");
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

        const products = await prismadb.product.findMany({
            where: {
                storeId,
                categoryId,
                sizeId,
                colorId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(products);

    } catch(error) {
        console.log("PRODUCTS_GET", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}
