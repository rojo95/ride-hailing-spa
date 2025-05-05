import bcrypt from "bcryptjs";

export const encryptAnswer = async (answer: string) => {
    return await bcrypt.hash(answer, 10);
};
