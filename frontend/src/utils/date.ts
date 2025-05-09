type FormatDateOptions = {
    date: string | Date;
    onlyYear?: boolean;
    longFormat?: boolean;
};

export function formatDate({
    date,
    onlyYear,
    longFormat,
}: FormatDateOptions): string {
    const parsedDate = new Date(date);

    if (onlyYear) {
        return parsedDate.toLocaleDateString("es-VE", {
            timeZone: "America/Caracas",
            year: "numeric",
        });
    }

    if (longFormat) {
        return parsedDate.toLocaleDateString("es-VE", {
            timeZone: "America/Caracas",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }

    // Formato corto por defecto: dd/mm/yyyy
    return parsedDate.toLocaleDateString("es-VE", {
        timeZone: "America/Caracas",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function calculateTime(fecha: Date | string): string {
    const inicio = new Date(fecha);
    const hoy = new Date();

    let años = hoy.getFullYear() - inicio.getFullYear();
    let meses = hoy.getMonth() - inicio.getMonth();
    let dias = hoy.getDate() - inicio.getDate();

    if (dias < 0) {
        meses--;
        const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
        dias += mesAnterior.getDate();
    }

    if (meses < 0) {
        años--;
        meses += 12;
    }

    if (años > 0) return `${años} año${años > 1 ? "s" : ""}`;
    if (meses > 0) return `${meses} mes${meses > 1 ? "es" : ""}`;
    return `${dias} día${dias > 1 ? "s" : ""}`;
}
