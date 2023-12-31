import prismadb from "@/lib/prismadb"
import { format } from "date-fns"
import ColorsClient from "./components/color-client"

export default async function SizePage( {params} ) {
    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formattedData = colors.map(item => {
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
                <ColorsClient colors={formattedData} />
            </div>
        </div>
    ) 
    
}