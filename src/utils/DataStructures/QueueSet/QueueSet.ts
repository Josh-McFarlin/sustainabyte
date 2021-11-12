import Queue from "../Queue";

export default class QueueSet<V> extends Queue<V> {
  values: Set<V>;

  constructor() {
    super();
    this.values = new Set<V>();
  }

  add(value: V): void {
    if (!this.values.has(value)) {
      super.add(value);
      this.values.add(value);
    }
  }

  remove(): V | null {
    const value = super.remove();

    if (value != null) {
      this.values.delete(value);
    }

    return value;
  }

  has(value: V): boolean {
    return this.values.has(value);
  }
}
