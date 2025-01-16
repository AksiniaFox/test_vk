type Listener = (...args: any[]) => void;

class EventEmitter {
  private events: { [key: string]: Listener[] } = {};

  on(eventName: string, listener: Listener): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  emit(eventName: string, ...args: any[]): void {
    const listeners = this.events[eventName];
    if (listeners) {
      listeners.forEach((listener) => listener(...args));
    }
  }

  off(eventName: string, listener: Listener): void {
    const listeners = this.events[eventName];
    if (listeners) {
      this.events[eventName] = listeners.filter((l) => l !== listener);
    }
  }
}

// Пример
const emitter = new EventEmitter();

// Подписка
const logData = (data: any) => console.log(data);
emitter.on("data", logData);

// Испускание события
emitter.emit("data", { message: "Hello, world!" });

// Удаление конкретного обработчика
emitter.off("data", logData);

export default EventEmitter;
