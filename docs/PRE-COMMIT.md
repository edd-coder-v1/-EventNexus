# Pre-commit Hooks para EventNexus

Este documento explica cómo usar los pre-commit hooks configurados para EventNexus.

## 🎯 ¿Qué son los Pre-commit Hooks?

Los pre-commit hooks son scripts que se ejecutan automáticamente antes de cada commit para asegurar que el código cumple con ciertos estándares de calidad.

## 🚀 Hooks Configurados

### 1. Pre-commit Hook Básico (Git)

**Ubicación:** `.git/hooks/pre-commit`

**Ejecuta automáticamente:**

- ✅ TypeScript type checking (`yarn typecheck`)
- ✅ ESLint (`yarn lint`)
- ✅ Prettier format check (`yarn format`)
- ✅ Tests (`yarn test`)

### 2. Pre-commit Script Avanzado

**Ubicación:** `scripts/pre-commit.sh`

**Uso:**

```bash
# Ejecutar manualmente
yarn pre-commit

# Con verificación de build
yarn pre-commit:build
```

## 🛠️ Configuración

### Opción 1: Hook de Git (Ya configurado)

El hook básico ya está configurado y se ejecutará automáticamente en cada commit.

### Opción 2: Husky (Recomendado para proyectos grandes)

```bash
# Instalar y configurar Husky
yarn setup-husky

# Esto instalará husky y configurará los hooks automáticamente
```

## 📋 Scripts Disponibles

| Script                  | Descripción                               |
| ----------------------- | ----------------------------------------- |
| `yarn pre-commit`       | Ejecuta todas las verificaciones          |
| `yarn pre-commit:build` | Incluye verificación de build             |
| `yarn check-all`        | Verifica todo sin ejecutar tests          |
| `yarn fix-all`          | Corrige automáticamente linting y formato |
| `yarn setup-husky`      | Configura Husky para hooks avanzados      |

## ⚙️ Personalización

### Modificar el Hook Básico

Edita `.git/hooks/pre-commit` para agregar o quitar verificaciones:

```bash
# Agregar verificación de build
yarn build
if [ $? -ne 0 ]; then
    show_error "Build falló. Corrige los errores antes de hacer commit."
fi
```

### Modificar el Script Avanzado

Edita `scripts/pre-commit.sh` para personalizar las verificaciones.

## 🚫 Saltar Hooks (Solo en Emergencias)

```bash
# Saltar pre-commit hook temporalmente
git commit --no-verify -m "mensaje de commit"

# ⚠️ Solo usar en emergencias
```

## 🔧 Solución de Problemas

### Error: "Permission denied"

```bash
# Hacer ejecutable el hook
chmod +x .git/hooks/pre-commit
chmod +x scripts/pre-commit.sh
```

### Error: "yarn: command not found"

```bash
# Instalar yarn globalmente
npm install -g yarn
```

### Error: "node_modules not found"

```bash
# Instalar dependencias
yarn install
```

### Hook no se ejecuta

```bash
# Verificar que el hook existe y es ejecutable
ls -la .git/hooks/pre-commit

# Debería mostrar algo como: -rwxr-xr-x
```

## 📊 Verificaciones Incluidas

### 1. TypeScript Type Checking

- Verifica tipos de TypeScript
- Detecta errores de compilación
- Comando: `yarn typecheck`

### 2. ESLint

- Verifica reglas de código
- Detecta problemas de estilo
- Comando: `yarn lint`

### 3. Prettier

- Verifica formato de código
- Asegura consistencia visual
- Comando: `yarn format`

### 4. Tests

- Ejecuta suite de pruebas
- Verifica funcionalidad
- Comando: `yarn test`

### 5. Build (opcional)

- Verifica que el proyecto compila
- Detecta errores de build
- Comando: `yarn build`

## 💡 Mejores Prácticas

1. **Siempre ejecuta los hooks** antes de hacer commit
2. **Corrige los errores** antes de continuar
3. **No uses `--no-verify`** a menos que sea absolutamente necesario
4. **Mantén los hooks actualizados** con las mejores prácticas del proyecto
5. **Documenta cambios** en los hooks para el equipo

## 🎉 Beneficios

- ✅ **Código consistente** - Todos los commits siguen los mismos estándares
- ✅ **Menos errores** - Se detectan problemas antes de que lleguen al repositorio
- ✅ **Mejor calidad** - El código siempre está formateado y libre de errores
- ✅ **Desarrollo más rápido** - Menos tiempo corrigiendo problemas en CI/CD
- ✅ **Colaboración mejorada** - Todos los desarrolladores siguen las mismas reglas

## 📚 Recursos Adicionales

- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Pre-commit Best Practices](https://pre-commit.com/)

---

¿Tienes preguntas sobre los pre-commit hooks? Abre un issue en el repositorio.
