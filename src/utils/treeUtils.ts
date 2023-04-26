export function bfs_search(key: string, id: string, tree: any) {
  const queue = [];

  queue.unshift(tree);
  const arr = [];
  while (queue.length > 0) {
    const curNode = queue.pop();

    if (curNode.attributes[key] === id) {
      // whatever is of level 1 change to level 2 and replace
      arr.push(curNode);
    }

    const len = curNode.children.length;

    for (let i = 0; i < len; i++) {
      queue.unshift(curNode.children[i]);
    }
  }
  return arr;
}
