export const handleErrorMessage = ({
    error,
    defaultMessage,
}: {
    error: unknown;
    defaultMessage: string;
}) =>
    error instanceof Error
        ? error.message
        : error || defaultMessage || "An unknown error has occurred.";
