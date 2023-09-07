"use client"

import * as z from "zod"
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "@/components/ui/modal";
import { Form, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormControl, 
    FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const formSchema = z.object({
    name: z.string().min(1)
});
export const StoreModal = () => {
    const storeModal = useStoreModal();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    });

    const onSubmit = async (value) => {
        try {
            setIsLoading(true)
            const data = JSON.stringify(value)
            // console.log(value);
            const res = await axios.post('/api/stores', {
              name: value.name,
            })
            console.log(res.data)
        } catch(error) {
          console.log(error.response.data);
        } finally {
            setIsLoading(false);
        }
    }
    // console.log(formSchema)
    return (
        <Modal 
        title="Test Title" 
        onClose={storeModal.onClose} 
        isOpen={storeModal.isOpen} 
        description="Test Description"
        >
            <div>
            <div className="space-y-4 py-2 pb-4">
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="Enter a name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={isLoading} variant='outline' onClick={storeModal.onClose}>Cancel</Button>
        <Button disabled={isLoading} type="submit">Continue</Button>
        </div>
      </form>
    </Form>
            </div>

            </div>
        </Modal>
    )
}