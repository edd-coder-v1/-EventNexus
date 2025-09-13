/**
 * Represents an event in the Nexus system with a specific name and associated payload data.
 *
 * @template T - The type of the payload data associated with the event.
 *
 * @property {string} name - The name of the event.
 * @property {T} payload - The data or information associated with the event.
 */
export interface NexusEvent<T> {
  name: string;
  payload: T;
}
