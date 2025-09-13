#!/usr/bin/env tsx

/**
 * Script de prueba para la librería EventNexus
 *
 * Este script demuestra todas las funcionalidades de la librería:
 * - EventsBuilder con símbolos únicos
 * - Eventos síncronos y asíncronos
 * - Eventos wildcard
 * - Manejo de errores
 * - Timeouts y abort signals
 * - Escenario real de aplicación
 */

import { NexusEventManager } from './src/index';

// Función para simular delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Función principal de demostración
async function runDemo() {
  console.log('🚀 Iniciando demostración de EventNexus...\n');

  // Crear instancias
  const eventManager = NexusEventManager.getInstance();

  // Configurar el modo debug
  NexusEventManager.debug = true;

  // Configurar manejo de errores personalizado
  NexusEventManager.onError = (error, info) => {
    console.error(`❌ Error en evento "${info.event}" (listener ${info.listenerIndex}):`, error);
  };

  // ========================================
  // 1. PROBAR EVENTS BUILDER
  // ========================================
  console.log('📋 1. Probando EventsBuilder:');
  console.log('================================');

  console.log('');

  // ========================================
  // 2. PROBAR EVENTOS BÁSICOS
  // ========================================
  console.log('📡 2. Probando eventos síncronos:');
  console.log('==================================');

  // Registrar listeners
  eventManager.register('user:login', {
    handler: (event) => {
      console.log(`👤 Usuario logueado: ${event.payload.name} (${event.payload.email})`);
    }
  });

  eventManager.register('order:created', {
    handler: (event) => {
      console.log(`🛒 Nueva orden: #${event.payload.orderId} - $${event.payload.total}`);
    }
  });

  // Emitir eventos
  eventManager.emit({
    name: 'user:login',
    payload: { name: 'Juan Pérez', email: 'juan@example.com' }
  });

  eventManager.emit({
    name: 'order:created',
    payload: { orderId: 'ORD-001', total: 99.99 }
  });

  console.log('');

  // ========================================
  // 3. PROBAR EVENTOS WILDCARD
  // ========================================
  console.log('🌟 3. Probando eventos wildcard (*):');
  console.log('====================================');

  eventManager.register('*', {
    handler: (event) => {
      console.log(`🔔 [WILDCARD] Evento: "${event.name}"`);
    }
  });

  eventManager.emit({
    name: 'user:logout',
    payload: { userId: 'user-123' }
  });

  console.log('');

  // ========================================
  // 4. PROBAR EVENTOS ASÍNCRONOS
  // ========================================
  console.log('⚡ 4. Probando eventos asíncronos:');
  console.log('==================================');

  eventManager.register('order:paid', {
    handler: async (event) => {
      console.log(`💳 Procesando pago para orden #${event.payload.orderId}...`);
      await delay(1000);
      console.log(`✅ Pago completado para orden #${event.payload.orderId}`);
    }
  });

  // Modo secuencial
  console.log('🔄 Modo secuencial:');
  await eventManager.emitAsync({
    name: 'order:paid',
    payload: { orderId: 'ORD-002', amount: 149.99 }
  }, {
    mode: 'sequential'
  });

  console.log('');

  // ========================================
  // 5. PROBAR MANEJO DE ERRORES
  // ========================================
  console.log('⚠️  5. Probando manejo de errores:');
  console.log('==================================');

  eventManager.register('test:error', {
    handler: (_event) => {
      console.log(`🧪 Procesando evento de prueba...`);
      throw new Error('Error simulado para testing');
    }
  });

  eventManager.register('test:error', {
    handler: (_event) => {
      console.log(`✅ Segundo listener ejecutado`);
    }
  });

  eventManager.emit({
    name: 'test:error',
    payload: { test: true }
  });

  console.log('');

  // ========================================
  // 6. PROBAR TIMEOUTS
  // ========================================
  console.log('⏱️  6. Probando timeouts:');
  console.log('==========================');

  eventManager.register('slow:operation', {
    handler: async (_event) => {
      console.log(`🐌 Iniciando operación lenta...`);
      await delay(2000);
      console.log(`✅ Operación completada`);
    }
  });

  try {
    await eventManager.emitAsync({
      name: 'slow:operation',
      payload: { data: 'test' }
    }, {
      mode: 'sequential',
      timeOutMs: 1000
    });
  } catch (error) {
    console.log(`⏰ Timeout: ${error.message}`);
  }

  console.log('');

  // ========================================
  // 7. ESCENARIO REAL: E-COMMERCE
  // ========================================
  console.log('🛍️  7. Escenario real: E-commerce');
  console.log('==================================');

  // Simular flujo de compra
  console.log('🛒 Simulando compra...\n');

  // Login
  eventManager.emit({
    name: 'user:login',
    payload: { name: 'Ana López', email: 'ana@example.com' }
  });

  // Crear orden
  eventManager.emit({
    name: 'order:created',
    payload: { orderId: 'ORD-003', total: 299.99 }
  });

  // Procesar pago
  await eventManager.emitAsync({
    name: 'order:paid',
    payload: { orderId: 'ORD-003', amount: 299.99 }
  }, {
    mode: 'sequential'
  });

  // Logout
  eventManager.emit({
    name: 'user:logout',
    payload: { userId: 'user-456' }
  });

  console.log('\n✅ Flujo completado!');

  console.log('\n🎉 ¡Demostración completada!');
  console.log('\n📊 Funcionalidades probadas:');
  console.log('• ✅ Eventos síncronos');
  console.log('• ✅ Eventos asíncronos');
  console.log('• ✅ Eventos wildcard (*)');
  console.log('• ✅ Manejo de errores');
  console.log('• ✅ Timeouts');
  console.log('• ✅ Escenario real');
}

// Ejecutar la demostración
runDemo().catch(console.error);
