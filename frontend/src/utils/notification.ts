import Swal from "sweetalert2";

type Icon = "success" | "error" | "info" | "warning" | "question";

interface ParamsBase {
    icon?: Icon;
}

interface ToastOptions extends ParamsBase {
    message: string;
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
}

type ConfirmActionParams = {
    title?: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmButtonColor?: string;
    cancelButtonColor?: string;
    icon?: Icon;
    onConfirm: () => Promise<void> | void;
    onCancel?: () => Promise<void> | void;
};

export function ShowToast({
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

export async function ConfirmAction({
    title = "¿Está seguro?",
    text,
    confirmButtonText = "Aceptar",
    cancelButtonText = "Cancelar",
    confirmButtonColor = "#4CAF50",
    cancelButtonColor = "#BDBDBD",
    icon = "warning",
    onConfirm,
    onCancel,
}: ConfirmActionParams): Promise<void> {
    const result = await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor,
        cancelButtonColor,
        confirmButtonText,
        cancelButtonText,
    });

    if (result.isConfirmed) {
        await onConfirm();
    } else if (onCancel) {
        await onCancel();
    }
}
