import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el .env del servidor"
  )
}

if (serviceRoleKey.startsWith("sb_publishable_")) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY no puede ser una clave publishable. Configura una clave secret/service_role de Supabase en server/.env"
  )
}

export const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})