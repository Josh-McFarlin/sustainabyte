export default class Node<V> {
  value: V;
  prev: Node<V>;
  next: Node<V>;

  constructor(value: V) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}
