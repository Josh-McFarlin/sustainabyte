import QueueSet from "./QueueSet";

describe("QueueSet", () => {
  test("queue to add distinct values", () => {
    const queue = new QueueSet();

    expect(queue.size).toEqual(0);
    queue.add("Hello");
    queue.add("World");
    expect(queue.size).toEqual(2);
  });

  test("queue to not add repeat values", () => {
    const queue = new QueueSet();

    expect(queue.size).toEqual(0);
    queue.add("Hello");
    queue.add("Hello");
    expect(queue.size).toEqual(1);
    queue.add("World");
    expect(queue.size).toEqual(2);
  });

  test("queue has works", () => {
    const queue = new QueueSet();

    queue.add("Hello");
    expect(queue.has("Hello")).toEqual(true);
    expect(queue.has("World")).toEqual(false);
  });
});
