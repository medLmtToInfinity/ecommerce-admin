"use client"
import { useState } from "react";
import { Trash } from "lucide-react"
import * as z from "zod";
import { useForm } from "react-hook-form";

import Heading from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormControl, 
    FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1)
})

export default function ColorForm( { initialData } ) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            value: ""
        }
    })

    const title = initialData ? "Edit Color" : "Create Color";
    const description = initialData ? "Edit a Color" : "Add a New Color";
    const toastMessage = initialData ? "Color Updated" : "Color Created";
    const action = initialData ? "Save Changes" : "Create";

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const params = useParams();
    const [color, setColor] = useState("");

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, values)
            } else {
                await axios.post(`/api/${params.storeId}/colors`, values)
            }
            router.refresh();
            toast.success(toastMessage)
            router.push(`/${params.storeId}/colors`);
        } catch(error) {
            toast.error("Something Went Wrong");
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try{
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
            router.refresh();
            toast.success("Color Deleted.");
            router.push(`/${params.storeId}/colors`);
        } catch(error) {
            toast.error("Something Went Wrong.")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }
    const handleChange = (event) => {
        console.log(event)
    }

  return (
    <>
        <AlertModal 
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
        />
        <div className="flex items-center justify-between">
            <Heading 
                title={title}
                description={description}
            />
            {
                initialData && (
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )
            }
        </div>
        <Separator />
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="grid grid-cols-3 gap-8">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input disabled={loading} placeholder="Color Name..." {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                        <Input onChange={handleChange} disabled={loading} placeholder="Color Value..." {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <div className="h-6 w-6 rounded-full border border-gray-600"style={{backgroundColor: color}} />
        </div>
        <Button disabled={loading} className="ml-auto" type="submit">{action}</Button>
      </form>
    </Form>
    </>
  )
}
