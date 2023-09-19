"use client"

import { useState, useEffect } from "react";

import { ImagePlus, Trash } from "lucide-react";
import { Button } from "./button";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

export default function ImageUpload({
    disabled,
    onChange,
    onRemove,
    value
}) {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = (result) => {
        onChange(result.info.secure_url)
    }
    if(!isMounted) return null;

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {
                    value.map(url => {
                        return (
                            <div key={url} className="relative rounded-md overflow-hidden w-[200px] h-[200px]">
                                <div className="z-10 absolute top-2 right-2">
                                    <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Image 
                                    fill
                                    className="object-cover"
                                    alt="Image"
                                    src={url}
                                />

                            </div>
                        )
                })
                }
            </div>
            <CldUploadWidget onUpload={onUpload} uploadPreset="zac8bqsk">
                {
                    ( {open} ) => {
                        const onClick = () => open();
                        return (
                            <Button
                                type="button"
                                disabled={disabled}
                                variant="secondary"
                                onClick={onClick}
                            >
                                <ImagePlus className="h-4 w-4 mr-2" />
                                Upload an Image
                            </Button>
                        )
                    }
                }
            </CldUploadWidget>
        </div>
    )
}