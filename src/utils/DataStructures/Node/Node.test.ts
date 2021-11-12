import Node from "./Node";

describe("Node", () => {
  test("constructor to set value", () => {
    const node = new Node(5);

    expect(node.next).toBeNull();
    expect(node.prev).toBeNull();
    expect(node.value).toEqual(5);
  });

  test("next node to be set", () => {
    const node = new Node(5);
    const nextNode = new Node(6);

    node.next = nextNode;

    expect(node.next).toBe(nextNode);
  });

  test("prev node to be set", () => {
    const node = new Node(5);
    const prevNode = new Node(4);

    node.prev = prevNode;

    expect(node.prev).toBe(prevNode);
  });
});
