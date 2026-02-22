import "dotenv/config";
import { z } from "zod";
const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3000),
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    DATABASE_URL: z.string().url(),
    TIKTOK_APP_KEY: z.string().optional(),
    TIKTOK_APP_SECRET: z.string().optional(),
    TIKTOK_REDIRECT_URI: z.string().url().optional(),
    FRONTEND_URL: z.string().url().default("http://localhost:5173"),
    GEMINI_API_KEY: z.string().optional(),
});
function loadEnv() {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
        console.error("[env] Validation failed:", issues);
        throw new Error(`Invalid environment configuration: ${issues}`);
    }
    return parsed.data;
}
export const env = loadEnv();
//# sourceMappingURL=env.js.map