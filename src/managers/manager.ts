type Listener<T> = (items: T[]) => void;

export class Manager<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }
}