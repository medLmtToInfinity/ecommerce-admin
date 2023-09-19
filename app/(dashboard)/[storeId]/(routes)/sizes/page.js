import BillboardsClient from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/billboard-client"
import prismadb from "@/lib/prismadb"
import { format } from "date-fns"
import SizesClient from "./components/size-client"

export default async function SizePage( {params} ) {
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formattedData = sizes.map(item => {
        return {
            id: item.id,
            name: item.name,
            value: item.value,
            createdAt: format(item.createdAt, "MMMM do, yyyy")
        }
    })

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizesClient sizes={formattedData} />
            </div>
        </div>
    ) 
    
}