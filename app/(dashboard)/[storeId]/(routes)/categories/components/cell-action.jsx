"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@radix-ui/react-dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { useState } from "react"
import AlertModal from "@/components/modals/alert-modal"

function CellAction( {data: {id, cell}} ) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const params = useParams();

    const onUpdate = () => {
        router.push(`/${params.storeId}/categories/${id}`)
    }

    const onDelete = async () => {
        try{
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/categories/${id}`);
            router.refresh();
            toast.success("Category Deleted.");
        } catch(error) {
            toast.error("Something Went Wrong.")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }
    const onCopy = () => {
        navigator.clipboard.writeText(id);
        toast.success("Category id copied to the Clipboard");
    }

  return (
    <>
    <AlertModal 
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
    />
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 outline-none border-0">
                <span className="sr-only">Open Menu </span>
                <MoreHorizontal className="w-4 h-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white p-4">
            <DropdownMenuLabel className="font-bold mb-2">Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={onCopy} className="flex items-center mb-2 cursor-pointer outline-none">
                <Copy className="mr-2 w-4 h-4" />
                Copy Id
            </DropdownMenuItem>
            <Separator className="mb-2" />
            <DropdownMenuItem onClick={onUpdate} className="flex items-center mb-2 cursor-pointer outline-none">
                <Edit className="mr-2 w-4 h-4" />
                Update
            </DropdownMenuItem>
            <Separator className="mb-2" />
            <DropdownMenuItem onClick={() => setOpen(true)} className="flex items-center cursor-pointer outline-none">
                <Trash className="mr-2 w-4 h-4" />
                Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}

export default CellAction