type Listener = (message: any) => void;

const listeners = new Set<Listener>();

export function subscribe(listener: Listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function publish(message: any) {
  listeners.forEach((listener) => listener(message));
}