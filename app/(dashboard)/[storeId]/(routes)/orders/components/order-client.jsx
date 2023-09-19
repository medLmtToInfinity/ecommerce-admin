"use client"


import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
// import Heading from "@/components/ui/heading";

export default function OrdersClient( {orders} ) {
    
    return (
        <>
            <Heading
                title={`Orders (${orders.length})`}
                description="Manage orders for your store"
            />
            <Separator />
            <DataTable searchKey="products" columns={columns} data={orders} />
        </>
    )
}