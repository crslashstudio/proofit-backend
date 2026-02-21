import "dotenv/config";
import { z } from "zod";
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    PORT: z.ZodDefault<z.ZodNumber>;
    SUPABASE_URL: z.ZodString;
    SUPABASE_ANON_KEY: z.ZodString;
    SUPABASE_SERVICE_ROLE_KEY: z.ZodString;
    DATABASE_URL: z.ZodString;
    TIKTOK_APP_KEY: z.ZodOptional<z.ZodString>;
    TIKTOK_APP_SECRET: z.ZodOptional<z.ZodString>;
    TIKTOK_REDIRECT_URI: z.ZodOptional<z.ZodString>;
    GEMINI_API_KEY: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    DATABASE_URL: string;
    TIKTOK_APP_KEY?: string | undefined;
    TIKTOK_APP_SECRET?: string | undefined;
    TIKTOK_REDIRECT_URI?: string | undefined;
    GEMINI_API_KEY?: string | undefined;
}, {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    DATABASE_URL: string;
    NODE_ENV?: "development" | "production" | "test" | undefined;
    PORT?: number | undefined;
    TIKTOK_APP_KEY?: string | undefined;
    TIKTOK_APP_SECRET?: string | undefined;
    TIKTOK_REDIRECT_URI?: string | undefined;
    GEMINI_API_KEY?: string | undefined;
}>;
export type Env = z.infer<typeof envSchema>;
export declare const env: {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    DATABASE_URL: string;
    TIKTOK_APP_KEY?: string | undefined;
    TIKTOK_APP_SECRET?: string | undefined;
    TIKTOK_REDIRECT_URI?: string | undefined;
    GEMINI_API_KEY?: string | undefined;
};
export {};
//# sourceMappingURL=env.d.ts.map