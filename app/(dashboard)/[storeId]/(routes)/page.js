import prismadb from "@/lib/prismadb"

export default async function DashboardPage({ params }) {
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId
        }
    })

    return (
        <div>
            Active Dashboard: {store?.name}
        </div>
    )
}