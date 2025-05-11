import Swal from "sweetalert2";

type ToastOptions = {
    message: string;
    icon?: "success" | "error" | "info" | "warning" | "question";
    position?:
        | "top"
        | "top-start"
        | "top-end"
        | "center"
        | "center-start"
        | "center-end"
        | "bottom"
        | "bottom-start"
        | "bottom-end";
    timer?: number;
};

export function showToast({
    message,
    icon = "success",
    position = "top-end",
    timer = 5000,
}: ToastOptions) {
    Swal.fire({
        toast: true,
        position: position,
        icon,
        title: message,
        showConfirmButton: false,
        timer: timer,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });
}
