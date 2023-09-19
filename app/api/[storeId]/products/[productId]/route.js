import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(request, {params: {productId}}) {
    try {

        const product = await prismadb.product.findUnique({
            where: {
                id: productId,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            }
        })

        return NextResponse.json(product);

    } catch(error) {
        console.log("PRODUCT_GET", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(request, {params: {storeId, productId}}) {
    try {
            const { userId } = auth();
            if(!userId) {
                return new NextResponse("Unauthorized", {status: 401})
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
    
    
            await prismadb.product.update({
                where: {
                    id: productId,
                },
                data: {
                    name,
                    images: {
                        deleteMany: {}
                    },
                    price,
                    categoryId,
                    sizeId,
                    colorId,
                    isArchived,
                    isFeatured,
                }
            })
            const product = await prismadb.product.update({
                where: {
                    id: productId,
                },
                data: {
                    name,
                    images: {
                        createMany: {
                            data: [
                                ...images.map(image => image)
                            ]
                        }
                    },
                    price,
                    categoryId,
                    sizeId,
                    colorId,
                    isArchived,
                    isFeatured,
                }
            })
            // console.log("created!")
    
            return NextResponse.json(product);
    
        } catch(error) {
            console.log("PRODUCTS_POST", error);
            return new NextResponse("Internal Error", { status: 500 })
        }
}

export async function DELETE(request, {params: {storeId, productId}}) {
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

        const product = await prismadb.product.deleteMany({
            where: {
                id: productId,
            }
        })

        return NextResponse.json(product);

    } catch(error) {
        console.log("PRODUCT_DELETE", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}