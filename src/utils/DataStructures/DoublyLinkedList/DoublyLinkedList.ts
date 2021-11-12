import Node from "../Node";

export default class DoublyLinkedList<V> {
  head: Node<V> | null;
  tail: Node<V> | null;
  size: number;

  constructor();
  constructor(value: V);
  constructor(value?: V) {
    if (value) {
      this.head = new Node<V>(value);
      this.tail = this.head;
      this.size = 1;
    } else {
      this.head = null;
      this.tail = null;
      this.size = 0;
    }
  }

  addFirst(value: V): void {
    const newNode = new Node<V>(value);
    newNode.next = this.head;

    if (this.size > 0) {
      this.head.prev = newNode;
    } else {
      this.tail = newNode;
    }

    this.head = newNode;
    this.size += 1;
  }

  addLast(value: V): void {
    const newNode = new Node<V>(value);
    newNode.prev = this.tail;

    if (this.size > 0) {
      this.tail.next = newNode;
    } else {
      this.head = newNode;
    }

    this.tail = newNode;
    this.size += 1;
  }

  removeFirst(): V | null {
    if (this.size === 0) {
      return null;
    }

    const val = this.head.value;
    this.head = this.head.next;

    if (this.head != null) {
      this.head.prev = null;
    } else {
      this.head = null;
      this.tail = null;
    }

    this.size -= 1;

    return val;
  }

  removeLast(): V | null {
    if (this.size === 0) {
      return null;
    }

    const val = this.tail.value;
    this.tail = this.tail.prev;

    if (this.tail != null) {
      this.tail.next = null;
    } else {
      this.head = null;
      this.tail = null;
    }

    this.size -= 1;

    return val;
  }
}
