import { z } from "zod";

const envSchema = z.object({
    VITE_API_BASE_URL: z.string().url().default("http://localhost:4000"),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.format());
    throw new Error("Invalid environment variables");
}

export const env = {
    API_BASE_URL: parsed.data.VITE_API_BASE_URL,
};
