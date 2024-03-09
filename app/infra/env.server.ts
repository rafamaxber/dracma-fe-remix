import { z } from 'zod'

const envSchema = z.object({
  DRACMA_API_URL: z.string().url(),
  CLOUDFLARE_ENDPOINT: z.string().url(),
  COOKIE_SECRET: z.string(),
  COOKIE_THEME_SECRET_KEY: z.string(),
  CLOUDFLARE_TOKEN_KEY: z.string(),
  CLOUDFLARE_ACCESS_KEY: z.string(),
  CLOUDFLARE_BUCKET: z.string(),
  CLOUDFLARE_SECREAT_ACCESS_KEY: z.string(),
  NODE_ENV: z.string(),

  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
