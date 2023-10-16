"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SideBar from "@/components/sidebar";
import { useEffect, useState } from "react";

export default function MobileSidebar() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
    <Sheet>
        <SheetTrigger>
            <Button variant="ghost" size="icon" className='md:hidden'>
                <Menu />
            </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
            <SideBar />
        </SheetContent>
    </Sheet>
    )
}
