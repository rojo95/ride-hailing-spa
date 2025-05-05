export function isDecodedUserToken(
    user: unknown
): user is { id: string; iat: number; exp: number } {
    return (
        typeof user === "object" &&
        user !== null &&
        "id" in user &&
        typeof (user as any).id === "string"
    );
}
