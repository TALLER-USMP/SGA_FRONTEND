import EventEmitter from "eventemitter3";

const eventBus = new EventEmitter();

export const emitEvent = (event: string, data?: any) => {
  eventBus.emit(event, data);
};

export const onEvent = (event: string, handler: (data?: any) => void) => {
  eventBus.on(event, handler);
  return () => eventBus.off(event, handler); // Cleanup
};

export const offEvent = (event: string, handler: (data?: any) => void) => {
  eventBus.off(event, handler);
};
