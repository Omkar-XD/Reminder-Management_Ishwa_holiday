"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to login page and potentially signal to show signup tab
        router.replace("/login");
    }, [router]);

    return (
        <div className="min-h-screen bg-indigo-50/10 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}
