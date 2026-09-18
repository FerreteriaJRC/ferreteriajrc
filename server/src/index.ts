import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { initializeDatabase } from "./db.js"
import authRoutes from "./routes/auth.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Inicializar base de datos
initializeDatabase()

// Rutas
app.use("/api/auth", authRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" })
})

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Error:", err)
  res.status(500).json({ error: "Internal server error" })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`)
})
