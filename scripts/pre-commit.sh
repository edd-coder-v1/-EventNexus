#!/bin/bash

# Pre-commit script para EventNexus
# Este script puede ser usado con husky o ejecutado manualmente

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar errores
show_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Función para mostrar éxito
show_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para mostrar advertencias
show_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Función para mostrar información
show_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo -e "${BLUE}🚀 EventNexus Pre-commit Hook${NC}"
echo "=================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    show_error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
fi

# Verificar que yarn esté instalado
if ! command -v yarn &> /dev/null; then
    show_error "Yarn no está instalado. Por favor instala Yarn primero."
fi

# Verificar que las dependencias estén instaladas
if [ ! -d "node_modules" ]; then
    show_warning "node_modules no encontrado. Instalando dependencias..."
    yarn install
    if [ $? -ne 0 ]; then
        show_error "Error al instalar dependencias."
    fi
fi

echo ""
show_info "Ejecutando verificaciones de código..."
echo ""

# 1. TypeScript type checking
echo "🔧 TypeScript type checking..."
yarn typecheck
if [ $? -ne 0 ]; then
    show_error "TypeScript type checking falló. Corrige los errores antes de hacer commit."
fi
show_success "TypeScript type checking pasó"

# 2. ESLint
echo "🧹 ESLint..."
yarn lint
if [ $? -ne 0 ]; then
    show_error "ESLint falló. Corrige los errores de linting antes de hacer commit."
fi
show_success "ESLint pasó"

# 3. Prettier format check
echo "🎨 Verificando formato de código..."
yarn format
if [ $? -ne 0 ]; then
    show_warning "El código no está formateado correctamente."
    echo "💡 Ejecuta 'yarn format:fix' para corregir automáticamente el formato."
    show_error "Corrige el formato antes de hacer commit."
fi
show_success "Formato de código correcto"

# 4. Tests
echo "🧪 Ejecutando tests..."
yarn test
if [ $? -ne 0 ]; then
    show_error "Los tests fallaron. Corrige los errores antes de hacer commit."
fi
show_success "Tests pasaron"

# 5. Build check (opcional, más lento)
if [ "$1" = "--with-build" ]; then
    echo "🏗️  Verificando build..."
    yarn build
    if [ $? -ne 0 ]; then
        show_error "El build falló. Corrige los errores antes de hacer commit."
    fi
    show_success "Build exitoso"
fi

echo ""
echo -e "${GREEN}🎉 ¡Todos los checks pasaron! El commit puede proceder.${NC}"
echo -e "${BLUE}💡 Tip: Usa '--with-build' para incluir verificación de build${NC}"
echo ""

exit 0
