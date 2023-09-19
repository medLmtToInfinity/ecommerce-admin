import ColorForm from "@/components/color-form";
import prismadb from "@/lib/prismadb";

export default async function ColorPage( { params: { colorId } } ) {
    // console.log("billboardId: ", billboardId)
    const color = await prismadb.color.findUnique({
        where: {
            id: colorId
        }
    })
    console.log("color: ", color)
    return (
        <>
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <ColorForm initialData={color} />
                </div>
            </div>
        </>
    )
}