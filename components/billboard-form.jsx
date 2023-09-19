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
import AlertApi from "@/components/ui/api-alert";
import useOrigin from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/img-upload";

const formSchema = z.object({
    label: z.string().min(1),
    imgUrl: z.string().min(1)
})

export default function BillboardForm( { initialData } ) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: "",
            imgUrl: ""
        }
    })

    const title = initialData ? "Edit Billboard" : "Create Billboard";
    const description = initialData ? "Edit a Billboard" : "Add a New Billboard";
    const toastMessage = initialData ? "Billboard Updated" : "Billboard Created";
    const action = initialData ? "Save Changes" : "Create";

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const params = useParams();

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, values)
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, values)
            }
            router.refresh();
            toast.success(toastMessage)
            router.push(`/${params.storeId}/billboards`);
        } catch(error) {
            toast.error("Something Went Wrong");
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try{
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh();
            toast.success("Billbord Deleted.");
            router.push(`/${params.storeId}/billboards`);
        } catch(error) {
            toast.error("Make sure you removed all categories using this billboard.")
        } finally {
            setLoading(false);
            setOpen(false);
        }
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
        <FormField
            control={form.control}
            name="imgUrl"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Background Image</FormLabel>
                    <FormControl>
                        <ImageUpload
                            value={field.value ? [field.value] : []}
                            disabled={loading}
                            onChange={(url) => field.onChange(url)}
                            onRemove={() => field.onChange("")}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <div className="grid grid-cols-3 gap-8">
            <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                        <Input disabled={loading} placeholder="Billboard Label" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <Button disabled={loading} className="ml-auto" type="submit">{action}</Button>
      </form>
    </Form>
    </>
  )
}
