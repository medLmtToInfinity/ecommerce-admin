"use client"
import { StoreModal } from "@/components/modals/storeModal";
// import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { UserButton } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SetupPage() {

  const onOpen = useStoreModal(state => state.onOpen);
  const isOpen = useStoreModal(state => state.isOpen);
  useEffect(()=>{
    // console.log('useEffect :)')
    if(!isOpen) onOpen();
  }, [onOpen, isOpen])
  return (
    <div className="p-4">
      <UserButton afterSignOutUrl="/"/>
      {/* <StoreModal /> */}
    </div>
  )
}
