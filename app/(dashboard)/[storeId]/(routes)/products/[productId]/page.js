import ProductForm from "@/components/product-form";
import prismadb from "@/lib/prismadb";

export default async function BillboardPage( { params: {storeId, productId } } ) {
    // console.log("billboardId: ", billboardId)
    const product = await prismadb.product.findUnique({
        where: {
            id: productId
        },
        include: {
            images: true
        }
    })
    const store = await prismadb.store.findUnique({
        where: {
            id: storeId
        },
        include: {
            categories: true,
            sizes: true,
            colors: true,
        }
    })
    console.log("product: ", product)
    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <ProductForm store={store} initialData={product} />
                </div>
            </div>
        </>
    )
}