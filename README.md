# EventNexus

🚀 **EventNexus** es una librería de gestión de eventos moderna y eficiente para TypeScript/JavaScript que facilita la comunicación entre componentes de manera desacoplada y escalable.

## ✨ Características

- 🎯 **Patrón Singleton** - Una sola instancia global
- ⚡ **Eventos Síncronos y Asíncronos** - Soporte completo para ambos modos
- 🌟 **Eventos Wildcard** - Escucha todos los eventos con `*`
- 🛡️ **Manejo de Errores** - Callbacks personalizables para errores
- ⏱️ **Timeouts y Abort Signals** - Control de tiempo y cancelación
- 🔧 **Modos de Ejecución** - Secuencial y paralelo
- 📦 **TypeScript** - Tipado completo y seguro

## 📦 Instalación

```bash
npm install @eventnexus/core
# o
yarn add @eventnexus/core
```

## 🚀 Uso Básico

### Eventos Síncronos

```typescript
import { NexusEventManager } from '@eventnexus/core';

const eventManager = NexusEventManager.getInstance();

// Registrar un listener
eventManager.register('user:login', {
  handler: (event) => {
    console.log(`Usuario logueado: ${event.payload.name}`);
  }
});

// Emitir un evento
eventManager.emit({
  name: 'user:login',
  payload: { name: 'Juan Pérez', email: 'juan@example.com' }
});
```

### Eventos Asíncronos

```typescript
// Modo secuencial
await eventManager.emitAsync({
  name: 'order:paid',
  payload: { orderId: 'ORD-001', amount: 99.99 }
}, {
  mode: 'sequential',
  stopOnError: true
});

// Modo paralelo
await eventManager.emitAsync({
  name: 'notification:sent',
  payload: { message: 'Orden procesada', recipient: 'user@example.com' }
}, {
  mode: 'parallel',
  timeOutMs: 5000
});
```

### Eventos Wildcard

```typescript
// Escuchar todos los eventos
eventManager.register('*', {
  handler: (event) => {
    console.log(`Evento detectado: ${event.name}`);
  }
});
```


## ⚙️ Configuración

### Modo Debug

```typescript
NexusEventManager.debug = true; // Habilita logs detallados
```

### Manejo de Errores

```typescript
NexusEventManager.onError = (error, info) => {
  console.error(`Error en evento "${info.event}":`, error);
};
```

### Límite de Listeners

```typescript
NexusEventManager.maxListeners = 10; // Límite de listeners por evento
```

## 🎯 Casos de Uso

### E-commerce

```typescript
// Flujo completo de compra
eventManager.emit({ name: 'user:login', payload: userData });
eventManager.emit({ name: 'order:created', payload: orderData });

await eventManager.emitAsync({
  name: 'order:paid',
  payload: paymentData
}, { mode: 'sequential' });

await eventManager.emitAsync({
  name: 'notification:sent',
  payload: notificationData
}, { mode: 'parallel' });
```

### Sistema de Notificaciones

```typescript
// Listener wildcard para logging
eventManager.register('*', {
  handler: (event) => {
    console.log(`[${new Date().toISOString()}] ${event.name}`, event.payload);
  }
});
```



## 📚 API Reference

### NexusEventManager

#### Métodos

- `getInstance()` - Obtiene la instancia singleton
- `register<T>(eventName: string, listener: NexusEventListener<T>)` - Registra un listener
- `emit<T>(event: NexusEvent<T>)` - Emite un evento síncronamente
- `emitAsync<T>(event: NexusEvent<T>, options: EmitAsyncOptions)` - Emite un evento asíncronamente

#### Propiedades Estáticas

- `debug: boolean` - Habilita modo debug
- `maxListeners: number` - Límite de listeners por evento
- `onError?: (error: unknown, info: { event: string; listenerIndex: number }) => void` - Callback de error

### NexusEventsBuilder

#### Métodos

- `getInstance()` - Obtiene la instancia singleton
- `add(eventName: string)` - Crea un nuevo evento y retorna su símbolo
- `get()` - Retorna todos los eventos registrados

### Tipos

```typescript
interface NexusEvent<T> {
  name: string;
  payload: T;
}

interface NexusEventListener<T> {
  handler: (event: NexusEvent<T>) => void | Promise<void>;
}

interface EmitAsyncOptions {
  mode?: 'sequential' | 'parallel';
  stopOnError?: boolean;
  timeOutMs?: number;
  signal?: AbortSignal;
}
```

## 🛠️ Desarrollo

```bash
# Instalar dependencias
yarn install

# Modo desarrollo
yarn dev

# Construir
yarn build

# Linting
yarn lint

# Formatear código
yarn format

# Verificar tipos
yarn typecheck
```

## 📄 Licencia

MIT

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

## 📈 Roadmap

- [ ] Persistencia de eventos
- [ ] Middleware system
- [ ] Event replay
- [ ] Clustering support
- [ ] Metrics y monitoring
