import BillboardsClient from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/billboard-client"
import prismadb from "@/lib/prismadb"
import { format } from "date-fns"
import CategoriesClient from "./components/category-client"

export default async function CategoriesPage( {params} ) {
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            billboard: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formattedData = categories.map(item => {
        return {
            id: item.id,
            name: item.name,
            label: item.billboard.label,
            createdAt: format(item.createdAt, "MMMM do, yyyy")
        }
    })

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoriesClient categories={formattedData} />
            </div>
        </div>
    ) 
    
}