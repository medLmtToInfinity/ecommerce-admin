import CategoryForm from "@/components/category-form";
// import BillboardForm from "@/components/category-form";
import prismadb from "@/lib/prismadb";
import axios from "axios";


export default async function CategoryPage( { params: { storeId, categoryId } } ) {
    // console.log("billboardId: ", billboardId)
    const category = await prismadb.category.findUnique({
        where: {
            id: categoryId
        }
    })

    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId
        }
    })
    console.log("category: ", category)
    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <CategoryForm initialData={category} billboards={billboards} />
                </div>
            </div>
        </>
    )
}