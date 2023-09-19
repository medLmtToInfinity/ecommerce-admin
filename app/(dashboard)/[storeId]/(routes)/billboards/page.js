import BillboardsClient from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/billboard-client"
import prismadb from "@/lib/prismadb"
import { format } from "date-fns"

export default async function BillboardPage( {params} ) {
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formattedData = billboards.map(item => {
        return {
            id: item.id,
            label: item.label,
            createdAt: format(item.createdAt, "MMMM do, yyyy")
        }
    })

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardsClient billboards={formattedData} />
            </div>
        </div>
    ) 
    
}