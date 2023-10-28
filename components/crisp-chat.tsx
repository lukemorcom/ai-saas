"use client";

import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";

export default function CrispChat() {
    useEffect(() => {
        Crisp.configure("95278b9b-e6cd-442e-959b-09e886fe4e9d");
    }, []);

    return null;
}
