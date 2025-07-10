import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Swal from "sweetalert2";

export const useFlashMessages = () => {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                title: "Success!",
                text: flash.success,
                icon: "success",
                confirmButtonText: "OK",
            });
        }
        if (flash?.error) {
            Swal.fire({
                title: "Error!",
                text: flash.error,
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    }, [flash]);
};
