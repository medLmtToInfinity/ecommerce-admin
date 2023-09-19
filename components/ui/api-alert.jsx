"use client"

import { Copy, Server } from "lucide-react";
import toast from "react-hot-toast";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const textMap = (variant) => {
    return variant === "public" ? "Public" : "Admin"
}
const variantMap = (variant) => {
    return variant === "public" ? "secondary" : "destructive"
}

export default function AlertApi( { title, description, variant="public" } ) {

    const onCopy = () => {
        navigator.clipboard.writeText(description);
        toast.success("API Route copied to the Clipboard");
    }

    return (
        <Alert>
            <Server className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-x-2">
                {title}
                <Badge variant={variantMap(variant)}>{textMap(variant)}</Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 flex items-center justify-between">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    {description}
                </code>
                <Button variant="outline" size="icon" onClick={onCopy}>
                    <Copy className="w-4 h-4" />
                </Button>
            </AlertDescription>
        </Alert>
    )
}