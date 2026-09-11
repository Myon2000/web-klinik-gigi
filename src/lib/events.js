import { EventEmitter } from 'events';

const globalForEvents = globalThis;

/**
 * Event emitter singleton untuk broadcast data realtime antar request
 */
export const appointmentEvents =
  globalForEvents.appointmentEvents || new EventEmitter();

appointmentEvents.setMaxListeners(100);

if (process.env.NODE_ENV !== 'production') {
  globalForEvents.appointmentEvents = appointmentEvents;
}

export default appointmentEvents;
