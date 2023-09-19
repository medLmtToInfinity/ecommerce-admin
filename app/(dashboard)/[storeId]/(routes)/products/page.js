import ProductsClient from "./components/product-client"
import prismadb from "@/lib/prismadb"
import { formatter } from "@/lib/utils"
import { format } from "date-fns"

export default async function BillboardPage( {params} ) {
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            size: true,
            color: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formattedData = products.map(item => {
        return {
            id: item.id,
            name: item.name,
            isFeatured: item.isFeatured,
            isArchived: item.isArchived,
            price: formatter.format(+item.price),
            category: item.category.name,
            size: item.size.name,
            color: item.color.value,
            createdAt: format(item.createdAt, "MMMM do, yyyy")
        }
    })

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductsClient products={formattedData} />
            </div>
        </div>
    ) 
    
}