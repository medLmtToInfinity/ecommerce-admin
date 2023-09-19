"use client"

import { Plus } from "lucide-react";

import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/app/(dashboard)/[storeId]/(routes)/sizes/components/columns";
import ApiList from "@/components/ui/api-list";
// import Heading from "@/components/ui/heading";

export default function SizesClient( {sizes} ) {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Sizes (${sizes.length})`}
                    description="Manage Sizes for your store"
                />
                <Button onClick={() => { router.push(`/${params.storeId}/sizes/new`) }}>
                    <Plus className="mr-2 w-4 h-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={sizes} />
            <Heading title="API" description="APIs for sizes" />
            <Separator />
            <ApiList entityName="sizes" entityIdName="sizesId" />
        </>
    )
}