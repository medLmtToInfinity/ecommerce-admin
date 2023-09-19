"use client"

import { Plus } from "lucide-react";

import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/app/(dashboard)/[storeId]/(routes)/categories/components/columns";
import ApiList from "@/components/ui/api-list";
// import Heading from "@/components/ui/heading";

export default function CategoriesClient( {categories} ) {
    const router = useRouter();
    const params = useParams();
    
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Categories (${categories.length})`}
                    description="Manage Categories for your store"
                />
                <Button onClick={() => { router.push(`/${params.storeId}/categories/new`) }}>
                    <Plus className="mr-2 w-4 h-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={categories} />
            <Heading title="API" description="APIs for Categories" />
            <Separator />
            <ApiList entityName="categories" entityIdName="categoryId" />
        </>
    )
}