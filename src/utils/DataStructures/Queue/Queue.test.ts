import Queue from "./Queue";

describe("Queue", () => {
  test("empty constructor to set defaults", () => {
    const queue = new Queue();

    expect(queue.size).toEqual(0);
  });

  test("empty queue to return null", () => {
    const queue = new Queue();

    expect(queue.size).toEqual(0);
    expect(queue.remove()).toBeNull();
  });

  test("queue to return value", () => {
    const queue = new Queue();
    queue.add(5);

    expect(queue.size).toEqual(1);
    expect(queue.remove()).toEqual(5);
  });

  test("queue to preserve order", () => {
    const queue = new Queue();
    queue.add(5);
    queue.add(6);
    queue.add(7);
    queue.add(8);

    expect(queue.size).toEqual(4);
    expect(queue.remove()).toEqual(5);
    expect(queue.remove()).toEqual(6);
    expect(queue.remove()).toEqual(7);
    expect(queue.remove()).toEqual(8);
    expect(queue.remove()).toBeNull();
    expect(queue.size).toEqual(0);
  });

  test("queue can peek without removing item", () => {
    const queue = new Queue();
    queue.add(5);

    expect(queue.size).toEqual(1);
    expect(queue.peek()).toEqual(5);
    expect(queue.size).toEqual(1);
  });
});
