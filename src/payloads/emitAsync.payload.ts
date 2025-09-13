import { Modes } from '../types/modes.type';

interface EmitAsyncOptions {
  mode?:Modes;
  stopOnError?:boolean;
  timeOutMs?:number;
  signal?:AbortSignal;
}

export default EmitAsyncOptions;
