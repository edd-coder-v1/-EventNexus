import { clearTimeout } from 'node:timers';

import NexusEvent from './models/NexusEvent.model';
import NexusEventListener from './models/NexusEventListener.model';
import EmitAsyncOptions from './payloads/emitAsync.payload';
import NexusEventManagerRepository from './repositories/NexusEventManager.repositories';

/**
 * NexusEventManager is a singleton class responsible for managing event listeners
 * and dispatching events in a structured and efficient manner.
 * It supports synchronous and asynchronous event emissions, wildcard events,
 * and configurable error handling.
 *
 * This class also provides static configuration properties for customizing behavior,
 * such as debugging, maximum listeners, and error handling callbacks.
 */
class NexusEventManager implements NexusEventManagerRepository {
  /**
   * A variable that indicates if debugging mode is active.
   * When set to `true`, additional debugging information or logs
   * may be output to assist with troubleshooting or development.
   * Default value is `false`.
   */
  static debug: boolean = false;

  /**
   * Represents the maximum number of listeners that can be assigned to an event emitter.
   * This value is used to prevent potential memory leaks by limiting the number of allowed listeners.
   * A value of `Infinity` indicates that there is no limit to the number of listeners.
   *
   * @type {number}
   */
  static maxListeners: number = Infinity;

  /**
   * Callback function that is triggered when an error occurs.
   *
   * @callback onError
   * @param {unknown} err - The error object describing the issue encountered.
   * @param {Object} info - Additional information about the error occurrence.
   * @param {string} info.event - The event name during which the error was encountered.
   * @param {number} info.listenerIndex - The index of the listener where the error occurred.
   */
  static onError?: (
    err: unknown,
    info: { event: string; listenerIndex: number }
  ) => void;

  /**
   * NexusEventManager is an instance responsible for managing event-driven communication
   * within the system. It facilitates the subscription, publishing, and management
   * of events, enabling loosely coupled interactions between different components or modules.
   *
   * The instance supports the registration of event listeners, event triggering, and
   * listener removal, ensuring a flexible and scalable approach to event handling.
   */
  private static instance: NexusEventManager;

  /**
   * A map representing the collection of event listeners.
   *
   * The `listeners` map associates a string-based event type with a set of
   * event listener functions. Each event type is a key in the map, and the
   * associated value is a `Set` that contains `NexusEventListener` instances.
   *
   * The `NexusEventListener` is a function or a callback that handles events
   * for the associated event type. The generic `unknown` type allows the
   * listeners to process events with different types of payloads dynamically.
   *
   * This structure ensures that multiple listeners can be registered for the
   * same event type, and the use of `Set` prevents duplicate listeners for
   * the same event.
   */
  private listeners: Map<string, Set<NexusEventListener<unknown>>> = new Map();

  /**
   * Private constructor for the class. Prevents direct instantiation of the class from outside.
   *
   * @return {void} No value is returned as this is a constructor.
   */
  private constructor() {}

  /**
   * Retrieves the singleton instance of the NexusEventManager class.
   * If the instance does not already exist, it initializes and returns a new instance.
   *
   * @return {NexusEventManager} The singleton instance of NexusEventManager.
   */
  static getInstance(): NexusEventManager {
    if (!NexusEventManager.instance) {
      NexusEventManager.instance = new NexusEventManager();
    }
    return NexusEventManager.instance;
  }

  /**
   * Registers an event listener for a specified event.
   *
   * @param {string} eventName - The name of the event to register the listener for.
   * @param {NexusEventListener<T>} listener - The listener function to be executed when the event is triggered.
   * @return {void} This method does not return a value.
   */
  register<T>(eventName: string, listener: NexusEventListener<T>): void {
    const name = eventName.trim();
    const set =
      this.listeners.get(name) ?? new Set<NexusEventListener<unknown>>();
    set.add(listener as unknown as NexusEventListener<unknown>);

    if (
      NexusEventManager.maxListeners !== Infinity &&
      set.size > NexusEventManager.maxListeners
    ) {
      if (NexusEventManager.debug) {
        console.debug(
          `[EventManager] Listener count for "${name}" = ${set.size} > max (${NexusEventManager.maxListeners})`
        );
      }
    }
    this.listeners.set(name, set);
  }

  /**
   * Dispatches a specific event to all registered listeners for that event
   * name and any wildcard listeners.
   *
   * @param {NexusEvent<T>} event - The event instance to emit, carrying data and a name identifying the event type.
   * @return {void} No return value.
   */
  emit<T>(event: NexusEvent<T>): void {
    if (NexusEventManager.debug)
      console.debug('[EventManager] dispatch:', event);

    const name = String(event.name).trim();
    const specific = this.listeners.get(name);

    const wildcard = this.listeners.get('*');

    let idx = 0;

    const run = (set?: Set<NexusEventListener<unknown>>) => {
      if (!set || set.size === 0) return;

      for (const l of Array.from(set)) {
        try {
          (l as NexusEventListener<T>).handler(event);
        } catch (e) {
          NexusEventManager.onError?.(e, { event: name, listenerIndex: idx });
          if (NexusEventManager.debug)
            console.error('[EventManager] Listener error on', name, e);
        } finally {
          idx++;
        }
      }
    };
    run(specific);
    if (wildcard) run(wildcard);
  }

  /**
   * Emits an event asynchronously, invoking all associated listeners for the specified event name.
   * Listeners can be executed either sequentially or concurrently based on the provided options.
   *
   * @param {NexusEvent<T>} event - The event object to be emitted, which contains the event-specific data.
   * @param {EmitAsyncOptions} options - Configuration options for how the event should be emitted.
   * This includes:
   * - `mode` ("sequential" or "concurrent"): Determines whether to invoke listeners sequentially or concurrently.
   * - `stopOnError` (boolean): In sequential mode, determines whether to stop execution if an error occurs.
   * - `timeOutMs` (number): Optional timeout in milliseconds to wait for each listener to complete.
   * - `signal` (AbortSignal): Optional signal to abort the operation if triggered.
   *
   * @return {Promise<void>} A promise that resolves once all listeners have been executed,
   * or rejects if an error occurs during execution in sequential mode with `stopOnError` set to true.
   */
  async emitAsync<T>(
    event: NexusEvent<T>,
    options: EmitAsyncOptions
  ): Promise<void> {
    if (NexusEventManager.debug)
      console.debug('[EventManager] dispatch (async):', event);

    const {
      mode = 'sequential',
      stopOnError = false,
      timeOutMs,
      signal,
    } = options;
    const name = String(event.name).trim();
    const specific = this.listeners.get(name);
    const wildcard = this.listeners.get('*');
    const snapshot: Array<NexusEventListener<T>> = [
      ...(specific ? Array.from(specific) : []),
      ...(wildcard ? Array.from(wildcard) : []),
    ] as Array<NexusEventListener<T>>;

    const runOne = async (listener: NexusEventListener<T>, idx: number) => {
      try {
        const promise = Promise.resolve(listener.handler(event));
        await NexusEventManager.withTimeout(promise, timeOutMs, signal);
      } catch (e) {
        NexusEventManager.onError?.(e, { event: name, listenerIndex: idx });
        if (NexusEventManager.debug)
          console.error(
            '[EventManager] Listener error on',
            name,
            e,
            '(idx:',
            idx,
            ')'
          );
        if (mode === 'sequential' && stopOnError) {
          throw e;
        }
      }
    };

    if (mode === 'sequential') {
      for (let i = 0; i < snapshot.length; i++) {
        await runOne(snapshot[i], i);
      }
    } else {
      await Promise.all(snapshot.map((l, i) => runOne(l, i)));
    }
  }

  /**
   * Wraps a given promise with a timeout and/or an abortion signal, which allows the promise to be rejected
   * if the specified timeout duration is reached or if the operation is aborted via the provided signal.
   *
   * @param {Promise<T>} p - The promise to wrap with a timeout or abort signal.
   * @param {number} [timeoutMs] - The maximum time in milliseconds the promise is allowed to run before being rejected.
   * @param {AbortSignal} [signal] - An optional signal that allows cancellation of the operation.
   * @return {Promise<T>} A new promise that resolves or rejects based on the original promise, timeout, or abort signal.
   */
  private static withTimeout<T>(
    p: Promise<T>,
    timeoutMs?: number,
    signal?: AbortSignal
  ): Promise<T> {
    if (!timeoutMs && !signal) return p;

    return new Promise((resolve, reject) => {
      let timer: NodeJS.Timeout;
      const onAbort = () => {
        clearTimeout(timer);
        reject(new Error('Aborted'));
      };
      if (signal) {
        if (signal.aborted) return onAbort();
        signal.addEventListener('abort', onAbort);
      }

      if (timeoutMs && Number.isFinite(timeoutMs)) {
        timer = setTimeout(() => {
          reject(new Error('Timeout'));
        }, timeoutMs);
      }
      p.then(
        v => {
          clearTimeout(timer);
          signal?.removeEventListener('abort', onAbort);
          resolve(v);
        },
        e => {
          clearTimeout(timer);
          signal?.removeEventListener('abort', onAbort);
          reject(e);
        }
      );
    });
  }
}

export default NexusEventManager;
