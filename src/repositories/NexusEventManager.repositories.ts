import NexusEvent from '../models/NexusEvent.model';
import NexusEventListener from '../models/NexusEventListener.model';
import EmitAsyncOptions from '../payloads/emitAsync.payload';

/**
 * Abstract class representing a repository for managing and handling events in the Nexus architecture.
 * Provides methods for registering event listeners and emitting events.
 */
abstract class NexusEventManagerRepository {

  abstract register<T>(eventName:string, listener:NexusEventListener<T>):void;
  abstract emit<T>(event:NexusEvent<T>):void;
  abstract emitAsync<T>(event:NexusEvent<T>, options:EmitAsyncOptions):Promise<void>;

}

export default NexusEventManagerRepository;
