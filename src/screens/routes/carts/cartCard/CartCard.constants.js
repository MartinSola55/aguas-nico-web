import { State } from '@constants';

// Estados que el repartidor puede marcar en lugar de confirmar la bajada.
const notDeliveredStates = [State.Ausent, State.NotNeeded, State.Holidays, State.Owes];

export { notDeliveredStates };
