# 🧪 Guía de Pruebas para EventNexus

Esta guía te muestra cómo probar tu librería EventNexus de manera práctica y efectiva.

## 🚀 Formas de Probar la Librería

### 1. Prueba Rápida (Recomendada)

```bash
# Instalar dependencias de testing
yarn install

# Ejecutar script de prueba completo
yarn test
```

### 2. Prueba con Build

```bash
# Construir la librería y probarla
yarn test:build
```

### 3. Demo Interactivo

```bash
# Ejecutar demo en carpeta separada
yarn test:demo
```

## 📋 Qué se Prueba

### ✅ Funcionalidades Básicas

- **EventsBuilder**: Creación de eventos con símbolos únicos
- **Eventos Síncronos**: Emisión y recepción de eventos inmediatos
- **Eventos Asíncronos**: Modo secuencial y paralelo
- **Eventos Wildcard**: Escuchar todos los eventos con `*`

### ✅ Características Avanzadas

- **Manejo de Errores**: Gestión de errores en listeners
- **Timeouts**: Cancelación de operaciones lentas
- **Abort Signals**: Cancelación manual de operaciones
- **Debug Mode**: Logging detallado para desarrollo

### ✅ Escenarios Reales

- **E-commerce**: Flujo completo de compra
- **Notificaciones**: Sistema de alertas
- **Autenticación**: Login/logout de usuarios

## 🎯 Casos de Uso Probados

### 1. Sistema de E-commerce

```typescript
// Usuario se loguea
eventManager.emit({
  name: 'user:login',
  payload: { name: 'Juan', email: 'juan@example.com' },
});

// Crea una orden
eventManager.emit({
  name: 'order:created',
  payload: { orderId: 'ORD-001', total: 99.99 },
});

// Procesa pago (asíncrono)
await eventManager.emitAsync(
  {
    name: 'order:paid',
    payload: { orderId: 'ORD-001', amount: 99.99 },
  },
  { mode: 'sequential' }
);
```

### 2. Sistema de Notificaciones

```typescript
// Listener wildcard para todas las notificaciones
eventManager.register('*', {
  handler: event => {
    console.log(`Notificación: ${event.name}`);
  },
});

// Enviar notificación
eventManager.emit({
  name: 'notification:sent',
  payload: { message: 'Tu orden está lista', recipient: 'user@example.com' },
});
```

### 3. Manejo de Errores

```typescript
// Configurar manejo de errores personalizado
NexusEventManager.onError = (error, info) => {
  console.error(`Error en ${info.event}:`, error);
};

// Listener que puede fallar
eventManager.register('risky:operation', {
  handler: event => {
    if (Math.random() > 0.5) {
      throw new Error('Operación falló');
    }
    console.log('Operación exitosa');
  },
});
```

## 🔧 Configuración de Debug

Para ver más detalles durante las pruebas:

```typescript
// Habilitar modo debug
NexusEventManager.debug = true;

// Configurar callback de error personalizado
NexusEventManager.onError = (error, info) => {
  console.error(
    `Error en evento "${info.event}" (listener ${info.listenerIndex}):`,
    error
  );
};
```

## 📊 Interpretando los Resultados

### ✅ Salida Exitosa

```
🚀 Iniciando demostración de EventNexus...

📋 1. Probando EventsBuilder:
================================
✅ Eventos creados: ['user:login', 'user:logout', 'order:created', 'order:paid']

📡 2. Probando eventos síncronos:
==================================
👤 Usuario logueado: Juan Pérez (juan@example.com)
🛒 Nueva orden: #ORD-001 - $99.99
🔔 [WILDCARD] Evento: "user:login"
🔔 [WILDCARD] Evento: "order:created"

🎉 ¡Demostración completada!
```

### ⚠️ Errores Esperados

- **Timeouts**: `⏰ Timeout: Timeout` (operación cancelada por tiempo)
- **Errores de Listener**: `❌ Error en evento "test:error"` (manejo de errores)

## 🛠️ Personalizar las Pruebas

Puedes modificar `test-library.ts` para:

1. **Agregar nuevos casos de uso**
2. **Cambiar los datos de prueba**
3. **Probar diferentes configuraciones**
4. **Simular escenarios específicos**

## 📝 Notas Importantes

- Las pruebas son **no destructivas** - no modifican archivos
- Se ejecutan en **modo debug** para máxima visibilidad
- Incluyen **delays simulados** para probar operaciones asíncronas
- Cubren **casos de error** para validar robustez

## 🎯 Próximos Pasos

Después de ejecutar las pruebas:

1. **Revisa la salida** para verificar que todo funciona
2. **Modifica los datos** para probar diferentes escenarios
3. **Agrega tus propios casos** de uso específicos
4. **Integra** la librería en tu proyecto real

¡Tu librería EventNexus está lista para usar! 🚀
