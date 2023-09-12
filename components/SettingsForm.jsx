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

const formSchema = z.object({
    name: z.string().min(1),
})

export default function SettingsForm( { initialData } ) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const origin = useOrigin();
    const router = useRouter();
    const params = useParams();

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            await axios.patch(`/api/stores/${params.storeId}`, values)
            router.refresh();
            toast.success("Store Updated")
        } catch(error) {
            toast.error("Something Went Wrong");
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try{
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`);
            router.push("/");
            toast.success("Store Deleted Successfully");
        } catch(error) {
            toast.error("Make sure you removed all categories and products first.")
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
                title="Settings"
                description="Manage Store Preferences"
            />
            <Button
                variant="destructive"
                size="icon"
                onClick={() => setOpen(true)}
            >
                <Trash className="h-4 w-4" />
            </Button>
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
                    <Input disabled={loading} placeholder="Store Name" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <Button disabled={loading} className="ml-auto" type="submit">Save Changes</Button>
      </form>
    </Form>
    <Separator />
    <AlertApi title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} />
    </>
  )
}
