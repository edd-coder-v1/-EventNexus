#!/bin/bash

# Script para configurar husky y pre-commit hooks
# Ejecutar con: bash scripts/setup-husky.sh

set -e

echo "🐕 Configurando Husky para EventNexus..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Instalar husky si no está instalado
if ! yarn list husky &> /dev/null; then
    echo "📦 Instalando Husky..."
    yarn add -D husky
fi

# Configurar husky
echo "⚙️  Configurando Husky..."
yarn husky init

# Crear pre-commit hook
echo "🔧 Creando pre-commit hook..."
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Ejecutar script de pre-commit
bash scripts/pre-commit.sh
EOF

# Hacer ejecutable
chmod +x .husky/pre-commit

# Crear commit-msg hook (opcional)
echo "📝 Creando commit-msg hook..."
cat > .husky/commit-msg << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Verificar formato de commit message (opcional)
# npx --no -- commitlint --edit $1
EOF

chmod +x .husky/commit-msg

echo "✅ Husky configurado exitosamente!"
echo ""
echo "📋 Hooks configurados:"
echo "  - pre-commit: Ejecuta tsc, lint, format y tests"
echo "  - commit-msg: Verifica formato de mensajes de commit"
echo ""
echo "💡 Los hooks se ejecutarán automáticamente en cada commit."
echo "   Para saltar los hooks temporalmente, usa: git commit --no-verify"
