import NexusEvent from './NexusEvent.model';

/**
 * Interface representing an event listener within the Nexus system.
 *
 * This interface is designed to manage event handling, allowing for
 * invocation of a specified handler function when an event of type `NexusEvent` occurs.
 *
 * @template T Type of the payload or data associated with the event.
 */
interface NexusEventListener<T> {
  handler: (event: NexusEvent<T>) => void | Promise<void>;
}

export default NexusEventListener;
