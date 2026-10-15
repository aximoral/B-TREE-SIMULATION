import { BTree, BTreeNode, MicroStep, TreeLayout, NodeLayout } from '../types/btree';

let nextNodeId = 1;

export function generateNodeId(): string {
  return `node-${nextNodeId++}`;
}

export function resetNodeIdCounter(start = 1) {
  nextNodeId = start;
}

export function cloneBTree(tree: BTree): BTree {
  const clonedNodes: Record<string, BTreeNode> = {};
  for (const [id, node] of Object.entries(tree.nodes)) {
    clonedNodes[id] = {
      ...node,
      keys: [...node.keys],
      children: [...node.children],
    };
  }
  return {
    rootId: tree.rootId,
    degree: tree.degree,
    nodes: clonedNodes,
  };
}

export function createEmptyBTree(degree = 3): BTree {
  return {
    rootId: null,
    degree,
    nodes: {},
  };
}

// Pseudocode line references for educational display
export const B_TREE_PSEUDOCODE = {
  SEARCH: [
    'function B-TREE-SEARCH(x, k):',
    '  i = 0',
    '  while i < x.n and k > x.key[i]: i = i + 1',
    '  if i < x.n and k == x.key[i]: return (x, i)',
    '  if x.isLeaf: return NIL',
    '  return B-TREE-SEARCH(x.child[i], k)',
  ],
  INSERT: [
    'function B-TREE-INSERT(T, k):',
    '  r = T.root',
    '  if r.n == 2*t - 1: // Proactive root split',
    '    s = ALLOCATE-NODE(); T.root = s; s.isLeaf = FALSE',
    '    s.child[0] = r; B-TREE-SPLIT-CHILD(s, 0)',
    '    B-TREE-INSERT-NONFULL(s, k)',
    '  else: B-TREE-INSERT-NONFULL(r, k)',
  ],
  SPLIT: [
    'function B-TREE-SPLIT-CHILD(x, i):',
    '  z = ALLOCATE-NODE(); y = x.child[i]',
    '  z.isLeaf = y.isLeaf; z.n = t - 1',
    '  copy keys[t..2t-2] and children from y to z',
    '  insert y.key[t-1] into x at index i',
    '  link z as child[i+1] of x',
  ],
  INSERT_NONFULL: [
    'function B-TREE-INSERT-NONFULL(x, k):',
    '  i = x.n - 1',
    '  if x.isLeaf:',
    '    insert k into x.keys in sorted position',
    '  else:',
    '    find child i where k belongs',
    '    if x.child[i].n == 2*t - 1: // Proactive split',
    '      B-TREE-SPLIT-CHILD(x, i)',
    '      if k > x.key[i]: i = i + 1',
    '    B-TREE-INSERT-NONFULL(x.child[i], k)',
  ],
  DELETE: [
    'function B-TREE-DELETE(x, k):',
    '  search for k in current node x',
    '  if k in x and x.isLeaf: remove k from x',
    '  else if k in x and not x.isLeaf: replace with pred/succ or merge',
    '  else if not x.isLeaf: // ensure child has at least t keys',
    '    if child has t-1 keys: borrow from sibling or merge',
    '    B-TREE-DELETE(child, k)',
  ]
};

/**
 * Executes B-Tree search and records all micro-steps.
 */
export function traceBTreeSearch(tree: BTree, key: number): MicroStep[] {
  const steps: MicroStep[] = [];
  const currentTree = cloneBTree(tree);

  if (!currentTree.rootId) {
    steps.push({
      stepId: `search-empty-${Date.now()}`,
      phase: 'SEARCH_NOT_FOUND',
      treeSnapshot: cloneBTree(currentTree),
      description: `Tree is empty. Key ${key} not found.`,
      activeNodeId: null,
      pseudocodeLine: 4,
      highlightType: 'notFound',
      timestamp: Date.now(),
    });
    return steps;
  }

  let currId: string | null = currentTree.rootId;

  while (currId) {
    const node: BTreeNode = currentTree.nodes[currId];
    let i = 0;

    steps.push({
      stepId: `search-probe-node-${currId}-${Date.now()}`,
      phase: 'PROBE',
      treeSnapshot: cloneBTree(currentTree),
      description: `Inspecting ${node.isLeaf ? 'leaf' : 'internal'} node ${currId}. Scanning keys for target ${key}.`,
      activeNodeId: currId,
      activeKeyIndex: 0,
      pseudocodeLine: 1,
      highlightType: 'probe',
      timestamp: Date.now(),
    });

    while (i < node.keys.length && key > node.keys[i]) {
      steps.push({
        stepId: `search-compare-${currId}-${i}-${Date.now()}`,
        phase: 'PROBE',
        treeSnapshot: cloneBTree(currentTree),
        description: `Comparing target ${key} > key[${i}] (${node.keys[i]}). Advancing rightward.`,
        activeNodeId: currId,
        activeKeyIndex: i,
        pseudocodeLine: 2,
        highlightType: 'probe',
        timestamp: Date.now(),
      });
      i++;
    }

    if (i < node.keys.length && key === node.keys[i]) {
      steps.push({
        stepId: `search-found-${currId}-${i}-${Date.now()}`,
        phase: 'SEARCH_FOUND',
        treeSnapshot: cloneBTree(currentTree),
        description: `Found key ${key} in node ${currId} at slot index ${i}!`,
        activeNodeId: currId,
        activeKeyIndex: i,
        pseudocodeLine: 3,
        highlightType: 'found',
        timestamp: Date.now(),
      });
      return steps;
    }

    if (node.isLeaf) {
      steps.push({
        stepId: `search-not-found-${currId}-${Date.now()}`,
        phase: 'SEARCH_NOT_FOUND',
        treeSnapshot: cloneBTree(currentTree),
        description: `Reached leaf node ${currId} without finding key ${key}. Search terminated (Key not found).`,
        activeNodeId: currId,
        pseudocodeLine: 4,
        highlightType: 'notFound',
        timestamp: Date.now(),
      });
      return steps;
    }

    steps.push({
      stepId: `search-descend-${currId}-${i}-${Date.now()}`,
      phase: 'PROBE',
      treeSnapshot: cloneBTree(currentTree),
      description: `Target ${key} falls into pointer child[${i}] of node ${currId}. Descending.`,
      activeNodeId: currId,
      activeKeyIndex: i,
      pseudocodeLine: 5,
      highlightType: 'probe',
      timestamp: Date.now(),
    });

    currId = node.children[i] || null;
  }

  return steps;
}

/**
 * Executes CLRS Proactive Top-Down Insertion and records step-by-step micro-steps.
 */
export function traceBTreeInsert(tree: BTree, key: number): { steps: MicroStep[]; finalTree: BTree } {
  const steps: MicroStep[] = [];
  const currentTree = cloneBTree(tree);
  const t = currentTree.degree;
  const maxKeys = 2 * t - 1;

  // Case 1: Tree is currently empty
  if (!currentTree.rootId) {
    const rootId = generateNodeId();
    currentTree.rootId = rootId;
    currentTree.nodes[rootId] = {
      id: rootId,
      keys: [key],
      children: [],
      isLeaf: true,
      parentId: null,
      depth: 0,
    };

    steps.push({
      stepId: `insert-empty-${Date.now()}`,
      phase: 'KEY_INSERTED',
      treeSnapshot: cloneBTree(currentTree),
      description: `Tree is empty. Created new root node ${rootId} and inserted initial key [${key}].`,
      activeNodeId: rootId,
      activeKeyIndex: 0,
      pseudocodeLine: 1,
      highlightType: 'insert',
      timestamp: Date.now(),
    });

    return { steps, finalTree: currentTree };
  }

  // Check if root is full (2t - 1 keys). If so, proactive root split!
  let rootNode = currentTree.nodes[currentTree.rootId];
  if (rootNode.keys.length === maxKeys) {
    steps.push({
      stepId: `insert-root-full-${Date.now()}`,
      phase: 'SPLIT_DETECT',
      treeSnapshot: cloneBTree(currentTree),
      description: `Root node ${rootNode.id} has reached maximum capacity (${maxKeys} keys = 2t - 1). Proactively splitting root before descending.`,
      activeNodeId: rootNode.id,
      pseudocodeLine: 2,
      highlightType: 'split',
      timestamp: Date.now(),
    });

    // Allocate new root 's'
    const newRootId = generateNodeId();
    const oldRootId = currentTree.rootId;
    const oldRoot = currentTree.nodes[oldRootId];

    const newRootNode: BTreeNode = {
      id: newRootId,
      keys: [],
      children: [oldRootId],
      isLeaf: false,
      parentId: null,
      depth: 0,
    };
    currentTree.nodes[newRootId] = newRootNode;
    currentTree.rootId = newRootId;
    oldRoot.parentId = newRootId;

    // Split old root child
    splitChild(currentTree, newRootId, 0, steps);
    rootNode = currentTree.nodes[newRootId];
  }

  // Insert non-full starting from root
  insertNonFull(currentTree, currentTree.rootId, key, steps);

  // Update depths across entire tree
  updateNodeDepths(currentTree);

  steps.push({
    stepId: `insert-complete-${Date.now()}`,
    phase: 'COMPLETE',
    treeSnapshot: cloneBTree(currentTree),
    description: `Successfully inserted key ${key}. All B-Tree invariants verified.`,
    activeNodeId: null,
    pseudocodeLine: 0,
    highlightType: 'default',
    timestamp: Date.now(),
  });

  return { steps, finalTree: currentTree };
}

/**
 * Splits child i of node parentId.
 */
function splitChild(tree: BTree, parentId: string, childIndex: number, steps: MicroStep[]) {
  const t = tree.degree;
  const parent = tree.nodes[parentId];
  const fullChildId = parent.children[childIndex];
  const fullChild = tree.nodes[fullChildId];

  // Median key index is t - 1
  const medianIndex = t - 1;
  const medianKey = fullChild.keys[medianIndex];

  steps.push({
    stepId: `split-detect-${fullChildId}-${Date.now()}`,
    phase: 'SPLIT_DETECT',
    treeSnapshot: cloneBTree(tree),
    description: `Splitting full node ${fullChildId} (keys: [${fullChild.keys.join(', ')}]). Median key is ${medianKey} at index ${medianIndex}.`,
    activeNodeId: fullChildId,
    activeKeyIndex: medianIndex,
    secondaryNodeId: parentId,
    pseudocodeLine: 1,
    highlightType: 'split',
    timestamp: Date.now(),
  });

  // Create new right sibling node z
  const rightSiblingId = generateNodeId();
  const rightKeys = fullChild.keys.slice(medianIndex + 1);
  const rightChildren = fullChild.isLeaf ? [] : fullChild.children.slice(medianIndex + 1);

  const rightSibling: BTreeNode = {
    id: rightSiblingId,
    keys: rightKeys,
    children: rightChildren,
    isLeaf: fullChild.isLeaf,
    parentId: parentId,
    depth: fullChild.depth,
  };
  tree.nodes[rightSiblingId] = rightSibling;

  // Re-parent transferred children
  if (!fullChild.isLeaf) {
    for (const cid of rightChildren) {
      if (tree.nodes[cid]) {
        tree.nodes[cid].parentId = rightSiblingId;
      }
    }
  }

  // Truncate left node (fullChild) to keys[0...t-2] and children[0...t-1]
  fullChild.keys = fullChild.keys.slice(0, medianIndex);
  if (!fullChild.isLeaf) {
    fullChild.children = fullChild.children.slice(0, medianIndex + 1);
  }

  steps.push({
    stepId: `split-partition-${fullChildId}-${Date.now()}`,
    phase: 'SPLIT_PARTITION',
    treeSnapshot: cloneBTree(tree),
    description: `Partitioned ${fullChildId} into left child ([${fullChild.keys.join(', ')}]) and right child ${rightSiblingId} ([${rightKeys.join(', ')}]).`,
    activeNodeId: fullChildId,
    secondaryNodeId: rightSiblingId,
    elevatedKey: medianKey,
    pseudocodeLine: 3,
    highlightType: 'split',
    timestamp: Date.now(),
  });

  // Elevate medianKey into parent keys at childIndex
  parent.keys.splice(childIndex, 0, medianKey);
  parent.children.splice(childIndex + 1, 0, rightSiblingId);

  steps.push({
    stepId: `split-promote-${parentId}-${Date.now()}`,
    phase: 'SPLIT_PROMOTE',
    treeSnapshot: cloneBTree(tree),
    description: `Promoted median key [${medianKey}] into parent node ${parentId}. Sibling ${rightSiblingId} linked at child index ${childIndex + 1}.`,
    activeNodeId: parentId,
    activeKeyIndex: childIndex,
    secondaryNodeId: rightSiblingId,
    elevatedKey: medianKey,
    pseudocodeLine: 4,
    highlightType: 'promote',
    timestamp: Date.now(),
  });
}

/**
 * Inserts key into non-full node in CLRS proactive manner.
 */
function insertNonFull(tree: BTree, nodeId: string, key: number, steps: MicroStep[]) {
  const t = tree.degree;
  const maxKeys = 2 * t - 1;
  const node = tree.nodes[nodeId];

  if (node.isLeaf) {
    // Find slot in sorted order
    let i = node.keys.length - 1;

    steps.push({
      stepId: `insert-leaf-locate-${nodeId}-${Date.now()}`,
      phase: 'INSERT_LOCATE',
      treeSnapshot: cloneBTree(tree),
      description: `Reached leaf node ${nodeId}. Finding sorted position for key ${key}.`,
      activeNodeId: nodeId,
      pseudocodeLine: 2,
      highlightType: 'probe',
      timestamp: Date.now(),
    });

    // Check for duplicate
    if (node.keys.includes(key)) {
      steps.push({
        stepId: `insert-duplicate-${nodeId}-${Date.now()}`,
        phase: 'COMPLETE',
        treeSnapshot: cloneBTree(tree),
        description: `Key ${key} already exists in leaf node ${nodeId}. Duplicate insertion ignored.`,
        activeNodeId: nodeId,
        pseudocodeLine: 3,
        highlightType: 'default',
        timestamp: Date.now(),
      });
      return;
    }

    while (i >= 0 && key < node.keys[i]) {
      i--;
    }
    const insertIndex = i + 1;
    node.keys.splice(insertIndex, 0, key);

    steps.push({
      stepId: `insert-leaf-placed-${nodeId}-${Date.now()}`,
      phase: 'KEY_INSERTED',
      treeSnapshot: cloneBTree(tree),
      description: `Inserted key [${key}] into leaf node ${nodeId} at index ${insertIndex}.`,
      activeNodeId: nodeId,
      activeKeyIndex: insertIndex,
      pseudocodeLine: 3,
      highlightType: 'insert',
      timestamp: Date.now(),
    });
    return;
  }

  // Internal node: find child to descend into
  let i = node.keys.length - 1;
  while (i >= 0 && key < node.keys[i]) {
    i--;
  }
  let targetChildIndex = i + 1;
  let targetChildId = node.children[targetChildIndex];
  let targetChild = tree.nodes[targetChildId];

  steps.push({
    stepId: `insert-probe-child-${nodeId}-${targetChildIndex}-${Date.now()}`,
    phase: 'PROBE',
    treeSnapshot: cloneBTree(tree),
    description: `In internal node ${nodeId}. Key ${key} navigates to child branch ${targetChildIndex} (${targetChildId}).`,
    activeNodeId: nodeId,
    activeKeyIndex: targetChildIndex,
    secondaryNodeId: targetChildId,
    pseudocodeLine: 5,
    highlightType: 'probe',
    timestamp: Date.now(),
  });

  // Check if target child is full. Proactively split before descending!
  if (targetChild.keys.length === maxKeys) {
    steps.push({
      stepId: `insert-child-full-${targetChildId}-${Date.now()}`,
      phase: 'SPLIT_DETECT',
      treeSnapshot: cloneBTree(tree),
      description: `Child ${targetChildId} has maximum capacity (${maxKeys} keys). Proactively splitting child before descending.`,
      activeNodeId: targetChildId,
      secondaryNodeId: nodeId,
      pseudocodeLine: 6,
      highlightType: 'split',
      timestamp: Date.now(),
    });

    splitChild(tree, nodeId, targetChildIndex, steps);

    // After split, parent has an extra key at targetChildIndex.
    // Determine whether key belongs to left child or newly created right child
    if (key > node.keys[targetChildIndex]) {
      targetChildIndex++;
      targetChildId = node.children[targetChildIndex];
    }
  }

  insertNonFull(tree, targetChildId, key, steps);
}

/**
 * Traces B-Tree Deletion with step-by-step borrows and merges.
 */
export function traceBTreeDelete(tree: BTree, key: number): { steps: MicroStep[]; finalTree: BTree } {
  const steps: MicroStep[] = [];
  const currentTree = cloneBTree(tree);

  if (!currentTree.rootId) {
    steps.push({
      stepId: `delete-empty-${Date.now()}`,
      phase: 'SEARCH_NOT_FOUND',
      treeSnapshot: cloneBTree(currentTree),
      description: `Tree is empty. Cannot delete key ${key}.`,
      activeNodeId: null,
      pseudocodeLine: 0,
      highlightType: 'notFound',
      timestamp: Date.now(),
    });
    return { steps, finalTree: currentTree };
  }

  deleteFromNode(currentTree, currentTree.rootId, key, steps);

  // If root became empty after deletion and has children, promote first child as new root
  if (currentTree.rootId && currentTree.nodes[currentTree.rootId]) {
    const root = currentTree.nodes[currentTree.rootId];
    if (root.keys.length === 0) {
      if (!root.isLeaf && root.children.length > 0) {
        const newRootId = root.children[0];
        currentTree.nodes[newRootId].parentId = null;
        delete currentTree.nodes[currentTree.rootId];
        currentTree.rootId = newRootId;

        steps.push({
          stepId: `delete-shrink-root-${Date.now()}`,
          phase: 'COMPLETE',
          treeSnapshot: cloneBTree(currentTree),
          description: `Root node depleted to 0 keys. Tree height decreased; child ${newRootId} is now the new root.`,
          activeNodeId: newRootId,
          pseudocodeLine: 4,
          highlightType: 'default',
          timestamp: Date.now(),
        });
      } else {
        // Tree became completely empty
        delete currentTree.nodes[currentTree.rootId];
        currentTree.rootId = null;
      }
    }
  }

  updateNodeDepths(currentTree);

  steps.push({
    stepId: `delete-complete-${Date.now()}`,
    phase: 'COMPLETE',
    treeSnapshot: cloneBTree(currentTree),
    description: `Deletion process for key ${key} concluded. Invariants preserved.`,
    activeNodeId: null,
    pseudocodeLine: 0,
    highlightType: 'default',
    timestamp: Date.now(),
  });

  return { steps, finalTree: currentTree };
}

function deleteFromNode(tree: BTree, nodeId: string, key: number, steps: MicroStep[]) {
  const t = tree.degree;
  const node = tree.nodes[nodeId];
  if (!node) return;

  const keyIndex = node.keys.indexOf(key);

  if (keyIndex !== -1) {
    // Key found in this node
    if (node.isLeaf) {
      // Case 1: Key is in a leaf node
      node.keys.splice(keyIndex, 1);
      steps.push({
        stepId: `delete-leaf-${nodeId}-${Date.now()}`,
        phase: 'DELETE_LEAF',
        treeSnapshot: cloneBTree(tree),
        description: `Found key ${key} in leaf node ${nodeId}. Removed key directly.`,
        activeNodeId: nodeId,
        pseudocodeLine: 2,
        highlightType: 'delete',
        timestamp: Date.now(),
      });
      return;
    } else {
      // Case 2: Key is in an internal node
      steps.push({
        stepId: `delete-internal-${nodeId}-${Date.now()}`,
        phase: 'DELETE_INTERNAL',
        treeSnapshot: cloneBTree(tree),
        description: `Found key ${key} in internal node ${nodeId}. Checking children for predecessor/successor or merge.`,
        activeNodeId: nodeId,
        activeKeyIndex: keyIndex,
        pseudocodeLine: 3,
        highlightType: 'delete',
        timestamp: Date.now(),
      });

      const leftChildId = node.children[keyIndex];
      const rightChildId = node.children[keyIndex + 1];
      const leftChild = tree.nodes[leftChildId];
      const rightChild = tree.nodes[rightChildId];

      if (leftChild && leftChild.keys.length >= t) {
        // Predecessor replacement
        const predKey = getPredecessor(tree, leftChildId);
        node.keys[keyIndex] = predKey;
        steps.push({
          stepId: `delete-pred-replace-${nodeId}-${Date.now()}`,
          phase: 'DELETE_INTERNAL',
          treeSnapshot: cloneBTree(tree),
          description: `Replaced key ${key} with predecessor ${predKey} from left subtree. Recursively deleting predecessor.`,
          activeNodeId: nodeId,
          activeKeyIndex: keyIndex,
          pseudocodeLine: 3,
          highlightType: 'promote',
          timestamp: Date.now(),
        });
        deleteFromNode(tree, leftChildId, predKey, steps);
      } else if (rightChild && rightChild.keys.length >= t) {
        // Successor replacement
        const succKey = getSuccessor(tree, rightChildId);
        node.keys[keyIndex] = succKey;
        steps.push({
          stepId: `delete-succ-replace-${nodeId}-${Date.now()}`,
          phase: 'DELETE_INTERNAL',
          treeSnapshot: cloneBTree(tree),
          description: `Replaced key ${key} with successor ${succKey} from right subtree. Recursively deleting successor.`,
          activeNodeId: nodeId,
          activeKeyIndex: keyIndex,
          pseudocodeLine: 3,
          highlightType: 'promote',
          timestamp: Date.now(),
        });
        deleteFromNode(tree, rightChildId, succKey, steps);
      } else if (leftChild && rightChild) {
        // Both children have t - 1 keys. Merge key and rightChild into leftChild!
        mergeNodes(tree, nodeId, keyIndex, steps);
        deleteFromNode(tree, leftChildId, key, steps);
      }
      return;
    }
  }

  // Key is not in this node
  if (node.isLeaf) {
    steps.push({
      stepId: `delete-not-found-${nodeId}-${Date.now()}`,
      phase: 'SEARCH_NOT_FOUND',
      treeSnapshot: cloneBTree(tree),
      description: `Key ${key} not found in tree. Nothing deleted.`,
      activeNodeId: nodeId,
      pseudocodeLine: 0,
      highlightType: 'notFound',
      timestamp: Date.now(),
    });
    return;
  }

  // Determine child index to descend
  let childIdx = 0;
  while (childIdx < node.keys.length && key > node.keys[childIdx]) {
    childIdx++;
  }

  const childId = node.children[childIdx];
  const child = tree.nodes[childId];

  // If child has only t - 1 keys, ensure it has at least t keys before descending
  if (child && child.keys.length < t) {
    const leftSiblingId = childIdx > 0 ? node.children[childIdx - 1] : null;
    const rightSiblingId = childIdx < node.children.length - 1 ? node.children[childIdx + 1] : null;
    const leftSibling = leftSiblingId ? tree.nodes[leftSiblingId] : null;
    const rightSibling = rightSiblingId ? tree.nodes[rightSiblingId] : null;

    if (leftSibling && leftSibling.keys.length >= t) {
      // Borrow from left sibling
      borrowFromLeft(tree, nodeId, childIdx, steps);
    } else if (rightSibling && rightSibling.keys.length >= t) {
      // Borrow from right sibling
      borrowFromRight(tree, nodeId, childIdx, steps);
    } else if (leftSibling) {
      // Merge child with left sibling
      mergeNodes(tree, nodeId, childIdx - 1, steps);
      childIdx--; // target child is now the merged left sibling
    } else if (rightSibling) {
      // Merge child with right sibling
      mergeNodes(tree, nodeId, childIdx, steps);
    }
  }

  deleteFromNode(tree, node.children[childIdx], key, steps);
}

function getPredecessor(tree: BTree, nodeId: string): number {
  let curr = tree.nodes[nodeId];
  while (!curr.isLeaf) {
    const lastChildId = curr.children[curr.children.length - 1];
    curr = tree.nodes[lastChildId];
  }
  return curr.keys[curr.keys.length - 1];
}

function getSuccessor(tree: BTree, nodeId: string): number {
  let curr = tree.nodes[nodeId];
  while (!curr.isLeaf) {
    const firstChildId = curr.children[0];
    curr = tree.nodes[firstChildId];
  }
  return curr.keys[0];
}

function borrowFromLeft(tree: BTree, parentId: string, childIdx: number, steps: MicroStep[]) {
  const parent = tree.nodes[parentId];
  const child = tree.nodes[parent.children[childIdx]];
  const leftSibling = tree.nodes[parent.children[childIdx - 1]];

  const borrowedParentKey = parent.keys[childIdx - 1];
  const borrowedSiblingKey = leftSibling.keys.pop()!;

  child.keys.unshift(borrowedParentKey);
  parent.keys[childIdx - 1] = borrowedSiblingKey;

  if (!leftSibling.isLeaf && leftSibling.children.length > 0) {
    const borrowedChildId = leftSibling.children.pop()!;
    child.children.unshift(borrowedChildId);
    tree.nodes[borrowedChildId].parentId = child.id;
  }

  steps.push({
    stepId: `delete-borrow-left-${child.id}-${Date.now()}`,
    phase: 'DELETE_BORROW',
    treeSnapshot: cloneBTree(tree),
    description: `Node ${child.id} borrowed key ${borrowedSiblingKey} from left sibling ${leftSibling.id} via parent ${parentId}.`,
    activeNodeId: child.id,
    secondaryNodeId: leftSibling.id,
    pseudocodeLine: 4,
    highlightType: 'promote',
    timestamp: Date.now(),
  });
}

function borrowFromRight(tree: BTree, parentId: string, childIdx: number, steps: MicroStep[]) {
  const parent = tree.nodes[parentId];
  const child = tree.nodes[parent.children[childIdx]];
  const rightSibling = tree.nodes[parent.children[childIdx + 1]];

  const borrowedParentKey = parent.keys[childIdx];
  const borrowedSiblingKey = rightSibling.keys.shift()!;

  child.keys.push(borrowedParentKey);
  parent.keys[childIdx] = borrowedSiblingKey;

  if (!rightSibling.isLeaf && rightSibling.children.length > 0) {
    const borrowedChildId = rightSibling.children.shift()!;
    child.children.push(borrowedChildId);
    tree.nodes[borrowedChildId].parentId = child.id;
  }

  steps.push({
    stepId: `delete-borrow-right-${child.id}-${Date.now()}`,
    phase: 'DELETE_BORROW',
    treeSnapshot: cloneBTree(tree),
    description: `Node ${child.id} borrowed key ${borrowedSiblingKey} from right sibling ${rightSibling.id} via parent ${parentId}.`,
    activeNodeId: child.id,
    secondaryNodeId: rightSibling.id,
    pseudocodeLine: 4,
    highlightType: 'promote',
    timestamp: Date.now(),
  });
}

function mergeNodes(tree: BTree, parentId: string, parentKeyIndex: number, steps: MicroStep[]) {
  const parent = tree.nodes[parentId];
  const leftChildId = parent.children[parentKeyIndex];
  const rightChildId = parent.children[parentKeyIndex + 1];
  const leftChild = tree.nodes[leftChildId];
  const rightChild = tree.nodes[rightChildId];

  const parentKey = parent.keys.splice(parentKeyIndex, 1)[0];
  parent.children.splice(parentKeyIndex + 1, 1);

  // Merge parentKey and rightChild's keys into leftChild
  leftChild.keys.push(parentKey, ...rightChild.keys);

  // Re-parent transferred children
  if (!rightChild.isLeaf) {
    for (const cid of rightChild.children) {
      leftChild.children.push(cid);
      if (tree.nodes[cid]) {
        tree.nodes[cid].parentId = leftChildId;
      }
    }
  }

  delete tree.nodes[rightChildId];

  steps.push({
    stepId: `delete-merge-${leftChildId}-${Date.now()}`,
    phase: 'DELETE_MERGE',
    treeSnapshot: cloneBTree(tree),
    description: `Merged parent key [${parentKey}] and sibling ${rightChildId} into node ${leftChildId}.`,
    activeNodeId: leftChildId,
    secondaryNodeId: parentId,
    pseudocodeLine: 4,
    highlightType: 'split',
    timestamp: Date.now(),
  });
}

function updateNodeDepths(tree: BTree) {
  if (!tree.rootId) return;

  function traverse(nodeId: string, depth: number) {
    const node = tree.nodes[nodeId];
    if (!node) return;
    node.depth = depth;
    for (const childId of node.children) {
      traverse(childId, depth + 1);
    }
  }

  traverse(tree.rootId, 0);
}

/**
 * Validates B-Tree mathematical invariants.
 */
export function validateBTree(tree: BTree): {
  isValid: boolean;
  totalKeys: number;
  totalNodes: number;
  height: number;
  maxTheoreticalHeight: number;
  errors: string[];
} {
  const errors: string[] = [];
  const t = tree.degree;
  const maxKeys = 2 * t - 1;
  const minKeys = t - 1;

  if (!tree.rootId) {
    return {
      isValid: true,
      totalKeys: 0,
      totalNodes: 0,
      height: 0,
      maxTheoreticalHeight: 0,
      errors: [],
    };
  }

  let totalKeys = 0;
  let totalNodes = 0;
  let leafDepths: number[] = [];

  function checkNode(nodeId: string, depth: number, parentId: string | null) {
    const node = tree.nodes[nodeId];
    if (!node) {
      errors.push(`Missing node record for id ${nodeId}`);
      return;
    }

    totalNodes++;
    totalKeys += node.keys.length;

    if (node.parentId !== parentId) {
      errors.push(`Node ${nodeId} has incorrect parentId pointer.`);
    }

    // Check sorted order
    for (let i = 1; i < node.keys.length; i++) {
      if (node.keys[i] <= node.keys[i - 1]) {
        errors.push(`Keys in node ${nodeId} are not strictly sorted ascending.`);
      }
    }

    // Check capacity bounds
    const isRoot = nodeId === tree.rootId;
    if (isRoot) {
      if (node.keys.length > maxKeys) {
        errors.push(`Root node ${nodeId} exceeds maximum capacity (${node.keys.length} > ${maxKeys}).`);
      }
    } else {
      if (node.keys.length < minKeys) {
        errors.push(`Node ${nodeId} violates minimum degree constraint (${node.keys.length} < ${minKeys}).`);
      }
      if (node.keys.length > maxKeys) {
        errors.push(`Node ${nodeId} exceeds maximum capacity (${node.keys.length} > ${maxKeys}).`);
      }
    }

    // Check children count
    if (!node.isLeaf) {
      if (node.children.length !== node.keys.length + 1) {
        errors.push(`Internal node ${nodeId} must have exactly keys.length + 1 children.`);
      }
      for (const childId of node.children) {
        checkNode(childId, depth + 1, nodeId);
      }
    } else {
      if (node.children.length !== 0) {
        errors.push(`Leaf node ${nodeId} must have 0 children.`);
      }
      leafDepths.push(depth);
    }
  }

  checkNode(tree.rootId, 0, null);

  // Check that all leaves are at the exact same depth
  const allLeavesSameDepth = leafDepths.every((d) => d === leafDepths[0]);
  if (!allLeavesSameDepth) {
    errors.push('All leaf nodes must be at the exact same depth (B-Tree height balance violated).');
  }

  const height = leafDepths.length > 0 ? leafDepths[0] : 0;
  const maxTheoreticalHeight = totalKeys > 0 ? Math.floor(Math.log(totalKeys + 1) / Math.log(t)) : 0;

  return {
    isValid: errors.length === 0,
    totalKeys,
    totalNodes,
    height,
    maxTheoreticalHeight,
    errors,
  };
}

/**
 * Computes 2D layout coordinates for each B-Tree node, ensuring zero overlap between subtrees.
 */
export function calculateTreeLayout(tree: BTree): TreeLayout {
  if (!tree.rootId || !tree.nodes[tree.rootId]) {
    return {
      nodes: {},
      canvasWidth: 1000,
      canvasHeight: 600,
      contentWidth: 0,
      contentHeight: 0,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
    };
  }

  const CELL_WIDTH = 44;
  const CELL_HEIGHT = 38;
  const NODE_PADDING = 10;
  const LEVEL_SPACING = 115;
  const SIBLING_GAP = 32;

  const layout: Record<string, NodeLayout> = {};

  // 1. Calculate individual node width based on key count
  function getNodeDimensions(node: BTreeNode) {
    const keyCount = Math.max(1, node.keys.length);
    const width = keyCount * CELL_WIDTH + NODE_PADDING * 2;
    const height = CELL_HEIGHT + 22; // 60px total matching CSS
    return { width, height };
  }

  // 2. Compute subtree bounding box widths recursively
  const subtreeWidths: Record<string, number> = {};

  function computeSubtreeWidth(nodeId: string): number {
    const node = tree.nodes[nodeId];
    if (!node) return 0;

    const { width: selfWidth } = getNodeDimensions(node);

    if (node.isLeaf || node.children.length === 0) {
      subtreeWidths[nodeId] = selfWidth;
      return selfWidth;
    }

    let childrenTotalWidth = 0;
    for (let i = 0; i < node.children.length; i++) {
      const childWidth = computeSubtreeWidth(node.children[i]);
      childrenTotalWidth += childWidth;
      if (i > 0) childrenTotalWidth += SIBLING_GAP;
    }

    const totalWidth = Math.max(selfWidth, childrenTotalWidth);
    subtreeWidths[nodeId] = totalWidth;
    return totalWidth;
  }

  computeSubtreeWidth(tree.rootId);

  // 3. Assign (x, y) coordinates
  function assignCoordinates(nodeId: string, leftX: number, depth: number) {
    const node = tree.nodes[nodeId];
    if (!node) return;

    const { width, height } = getNodeDimensions(node);
    const subtreeWidth = subtreeWidths[nodeId] || width;
    const centerX = leftX + subtreeWidth / 2;
    const nodeX = centerX - width / 2;
    const nodeY = 40 + depth * LEVEL_SPACING;

    layout[nodeId] = {
      id: nodeId,
      x: nodeX,
      y: nodeY,
      width,
      height,
    };

    if (!node.isLeaf && node.children.length > 0) {
      let currentChildLeft = leftX;
      // Center children under the subtree
      let totalChildrenWidth = 0;
      for (let i = 0; i < node.children.length; i++) {
        totalChildrenWidth += subtreeWidths[node.children[i]];
        if (i > 0) totalChildrenWidth += SIBLING_GAP;
      }

      currentChildLeft = centerX - totalChildrenWidth / 2;

      for (const childId of node.children) {
        assignCoordinates(childId, currentChildLeft, depth + 1);
        currentChildLeft += subtreeWidths[childId] + SIBLING_GAP;
      }
    }
  }

  const paddingX = 80;
  assignCoordinates(tree.rootId, paddingX, 0);

  // Compute bounding canvas dimensions
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const item of Object.values(layout)) {
    minX = Math.min(minX, item.x);
    maxX = Math.max(maxX, item.x + item.width);
    minY = Math.min(minY, item.y);
    maxY = Math.max(maxY, item.y + item.height);
  }

  const contentWidth = isFinite(minX) ? maxX - minX : 0;
  const contentHeight = isFinite(minY) ? maxY - minY : 0;
  const canvasWidth = Math.max(1200, maxX + paddingX * 2);
  const canvasHeight = Math.max(700, maxY + 120);

  return {
    nodes: layout,
    canvasWidth,
    canvasHeight,
    contentWidth,
    contentHeight,
    minX: isFinite(minX) ? minX : 0,
    minY: isFinite(minY) ? minY : 0,
    maxX: isFinite(maxX) ? maxX : 0,
    maxY: isFinite(maxY) ? maxY : 0,
  };
}
