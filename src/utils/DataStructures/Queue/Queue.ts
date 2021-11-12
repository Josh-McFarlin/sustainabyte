import DoublyLinkedList from "../DoublyLinkedList";

export default class Queue<V> {
  dll: DoublyLinkedList<V>;

  constructor() {
    this.dll = new DoublyLinkedList<V>();
  }

  get size() {
    return this.dll.size;
  }

  add(value: V): void {
    this.dll.addLast(value);
  }

  remove(): V | null {
    return this.dll.removeFirst();
  }
}
