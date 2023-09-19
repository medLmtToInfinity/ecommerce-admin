import OrdersClient from "./components/order-client"
import prismadb from "@/lib/prismadb"
import { formatter } from "@/lib/utils"
import { format } from "date-fns"

export default async function OrdersPage( {params} ) {
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    // console.log("Orders: ", orders.orderItems);

    const formattedData = orders.map(item => {
        console.log("Orders: ", item.orderItems)
        return {
            id: item.id,
            phone: item.phone,
            address: item.address,
            products: item.orderItems.map(orderItem => orderItem.product.name).join(", "),
            totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
                return total + Number(item.product.price)
              }, 0)),
            isPaid: item.isPaid,
            createdAt: format(item.createdAt, "MMMM do, yyyy")
        }
    })

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrdersClient orders={formattedData} />
            </div>
        </div>
    ) 
    
}