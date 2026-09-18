#!/bin/bash
# Quick Setup Script para Ferretería JRC

echo "🚀 Iniciando setup de Ferretería JRC..."

# 1. Instalar dependencias del servidor
echo ""
echo "📦 Instalando dependencias del servidor..."
cd server
npm install

if [ $? -ne 0 ]; then
  echo "❌ Error instalando dependencias del servidor"
  exit 1
fi

# 2. Crear archivo .env
echo ""
echo "⚙️ Configurando variables de entorno..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Archivo .env creado. Edítalo si necesitas cambiar la configuración."
else
  echo "✅ Archivo .env ya existe"
fi

# 3. Volver a la raíz
cd ..

# 4. Crear .gitignore en la raíz si no existe
if [ ! -f .gitignore ]; then
  echo "node_modules/" > .gitignore
  echo "dist/" >> .gitignore
  echo ".env" >> .gitignore
  echo ".DS_Store" >> .gitignore
  echo "*.log" >> .gitignore
fi

echo ""
echo "✅ Setup completado exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Instalar MailHog (para desarrollo):"
echo "   - Windows: Descarga desde https://github.com/mailhog/MailHog/releases"
echo "   - Mac: brew install mailhog && mailhog"
echo "   - Linux: Descarga el binario desde GitHub"
echo ""
echo "2. Iniciar el servidor (en una terminal):"
echo "   cd server"
echo "   npm run dev"
echo ""
echo "3. Iniciar el frontend (en otra terminal):"
echo "   npm run dev"
echo ""
echo "4. Abre en el navegador:"
echo "   http://localhost:5173/portal"
echo ""
echo "¡Listo para empezar! 🎉"
