import { useEffect, useRef } from "react";
import { router } from "@inertiajs/react";

export const useAutoRedirect = (timeout = 60000) => {
    const timeoutRef = useRef(null);

    useEffect(() => {
        const startTimeout = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                router.visit("/", { replace: true });
            }, timeout);
        };

        startTimeout();

        const resetTimeout = () => {
            startTimeout();
        };

        window.addEventListener("mousemove", resetTimeout);
        window.addEventListener("keydown", resetTimeout);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            window.removeEventListener("mousemove", resetTimeout);
            window.removeEventListener("keydown", resetTimeout);
        };
    }, [timeout]);
};
