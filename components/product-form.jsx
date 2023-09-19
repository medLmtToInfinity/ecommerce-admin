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
    FormMessage, 
    FormDescription
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";
import AlertApi from "@/components/ui/api-alert";
import useOrigin from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/img-upload";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({url: z.string()}).array(),
    categoryId: z.string().min(1),
    sizeId: z.string().min(1),
    colorId: z.string().min(1),
    price: z.coerce.number().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
})

export default function ProductForm( { initialData, store: { categories, sizes, colors } } ) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price)),
        } : {
            name: "",
            images: [],
            categoryId: "",
            sizeId: "",
            colorId: "",
            price: 0,
            isFeatured: false,
            isArchived: false,
        }
    })

    const title = initialData ? "Edit Product" : "Create Product";
    const description = initialData ? "Edit a Product" : "Add a New Product";
    const toastMessage = initialData ? "Product Updated" : "Product Created";
    const action = initialData ? "Save Changes" : "Create";

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const params = useParams();

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, values)
            } else {
                await axios.post(`/api/${params.storeId}/products`, values)
            }
            router.refresh();
            toast.success(toastMessage)
            router.push(`/${params.storeId}/products`);
        } catch(error) {
            toast.error("Something Went Wrong");
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try{
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            toast.success("Product Deleted.");
            router.push(`/${params.storeId}/products`);
        } catch(error) {
            toast.error("Something Went Wrong.")
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
            name="images"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Background Image</FormLabel>
                    <FormControl>
                        <ImageUpload
                            value={field.value.map(image => image.url)}
                            disabled={loading}
                            onChange={(url) => field.onChange([...field.value, {url}])}
                            onRemove={(url) => field.onChange([...field.value.filter(current => current.url !== url)])}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <div className="grid grid-cols-3 gap-8">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input disabled={loading} placeholder="Product Name" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                        <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category</FormLabel>
                <Select disabled={loading} value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {
                            categories.map(category => {
                                return (
                                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                )
                            })
                        }
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="sizeId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Size</FormLabel>
                <Select disabled={loading} value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {
                            sizes.map(size => {
                                return (
                                    <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                                )
                            })
                        }
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="colorId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Color</FormLabel>
                <Select disabled={loading} value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Color" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {
                            colors.map(color => {
                                return (
                                    <SelectItem key={color.id} value={color.id}>{color.name}</SelectItem>
                                )
                            })
                        }
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Featured
                </FormLabel>
                <FormDescription>
                This Product will appear on the Home Page.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
            <FormField
          control={form.control}
          name="isArchived"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Archived
                </FormLabel>
                <FormDescription>
                    This Product will not appear anywhere in the Store.
                </FormDescription>
              </div>
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
