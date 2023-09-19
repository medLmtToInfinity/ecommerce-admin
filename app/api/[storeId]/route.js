import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request, {params: { storeId }}) {
    try{
        console.log(storeId)
        if(!storeId) {
            return new NextResponse("Store Id is Required", { status: 400 });
        }
        const store = await prismadb.store.findUnique({
            where: {
                id: storeId,
            }
        })
        if(!store) {
            return new NextResponse("Store Not Found", {status: 404})
        }
    
        return NextResponse.json(store);
    } catch(error) {
        return new NextResponse("Internal error", {status: 500})
    }
}