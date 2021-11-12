import DoublyLinkedList from "./DoublyLinkedList";

describe("DoublyLinkedList", () => {
  test("empty constructor to set defaults", () => {
    const dll = new DoublyLinkedList();

    expect(dll.head).toBeNull();
    expect(dll.tail).toBeNull();
    expect(dll.size).toEqual(0);
  });

  test("constructor to set value", () => {
    const dll = new DoublyLinkedList(5);

    expect(dll.head).not.toBeNull();
    expect(dll.head.value).toEqual(5);
    expect(dll.tail).not.toBeNull();
    expect(dll.tail.value).toEqual(5);
    expect(dll.head).toBe(dll.tail);
    expect(dll.size).toEqual(1);
  });

  test("head to be set", () => {
    const dll = new DoublyLinkedList();
    dll.addFirst(5);

    expect(dll.size).toEqual(1);
    expect(dll.head.value).toEqual(5);
    expect(dll.head).toBe(dll.tail);
  });

  test("addFirst to set head", () => {
    const dll = new DoublyLinkedList(5);
    dll.addFirst(4);

    expect(dll.size).toEqual(2);
    expect(dll.head.value).toEqual(4);
    expect(dll.head.next.value).toEqual(5);
    expect(dll.tail.value).toEqual(5);
    expect(dll.head).not.toBe(dll.tail);
  });

  test("addLast to set tail", () => {
    const dll = new DoublyLinkedList(5);
    dll.addLast(6);

    expect(dll.size).toEqual(2);
    expect(dll.head.value).toEqual(5);
    expect(dll.head.next.value).toEqual(6);
    expect(dll.tail.value).toEqual(6);
    expect(dll.head).not.toBe(dll.tail);
  });

  test("removeFirst to set head", () => {
    const dll = new DoublyLinkedList(5);
    dll.addFirst(4);
    const first = dll.removeFirst();

    expect(first).toEqual(4);
    expect(dll.size).toEqual(1);
    expect(dll.head.value).toEqual(5);
    expect(dll.head.next).toBeNull();
    expect(dll.head).toBe(dll.tail);
  });

  test("removeLast to set tail", () => {
    const dll = new DoublyLinkedList(5);
    dll.addLast(6);
    const last = dll.removeLast();

    expect(last).toEqual(6);
    expect(dll.size).toEqual(1);
    expect(dll.head.value).toEqual(5);
    expect(dll.head.next).toBeNull();
    expect(dll.head).toBe(dll.tail);
  });

  test("size not to be negative", () => {
    const dll = new DoublyLinkedList(5);
    dll.addLast(6);
    dll.addLast(7);
    dll.addLast(8);

    expect(dll.size).toEqual(4);
    expect(dll.removeFirst()).toEqual(5);
    expect(dll.removeFirst()).toEqual(6);
    expect(dll.removeFirst()).toEqual(7);
    expect(dll.head).toBe(dll.tail);
    expect(dll.removeFirst()).toEqual(8);
    expect(dll.head).toBeNull();
    expect(dll.size).toEqual(0);
    expect(dll.removeFirst()).toBeNull();
    expect(dll.size).toEqual(0);
  });
});
