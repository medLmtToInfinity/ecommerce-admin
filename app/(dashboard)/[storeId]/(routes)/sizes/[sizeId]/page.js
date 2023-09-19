import SizeForm from "@/components/size-form";
import prismadb from "@/lib/prismadb";

export default async function SizedPage( { params: { sizeId } } ) {
    // console.log("billboardId: ", billboardId)
    const size = await prismadb.size.findUnique({
        where: {
            id: sizeId
        }
    })
    console.log("size: ", size)
    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <SizeForm initialData={size} />
                </div>
            </div>
        </>
    )
}