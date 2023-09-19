import BillboardForm from "@/components/billboard-form";
import prismadb from "@/lib/prismadb";

export default async function BillboardPage( { params: { billboardId } } ) {
    // console.log("billboardId: ", billboardId)
    const billboard = await prismadb.billboard.findUnique({
        where: {
            id: billboardId
        }
    })
    console.log("billboard: ", billboard)
    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <BillboardForm initialData={billboard} />
                </div>
            </div>
        </>
    )
}