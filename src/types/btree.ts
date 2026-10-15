export interface BTreeNode {
  id: string;
  keys: number[];
  children: string[]; // IDs of child nodes
  isLeaf: boolean;
  parentId: string | null;
  depth: number;
}

export interface BTree {
  rootId: string | null;
  degree: number; // Minimum degree t (t >= 2). A node has at least t-1 keys (except root) and at most 2t-1 keys.
  nodes: Record<string, BTreeNode>;
}

export type StepPhase =
  | 'IDLE'
  | 'PROBE'
  | 'SPLIT_DETECT'
  | 'SPLIT_PARTITION'
  | 'SPLIT_PROMOTE'
  | 'INSERT_LOCATE'
  | 'KEY_INSERTED'
  | 'SEARCH_FOUND'
  | 'SEARCH_NOT_FOUND'
  | 'DELETE_LOCATE'
  | 'DELETE_LEAF'
  | 'DELETE_BORROW'
  | 'DELETE_MERGE'
  | 'DELETE_INTERNAL'
  | 'COMPLETE';

export type HighlightType =
  | 'default'
  | 'probe'
  | 'split'
  | 'promote'
  | 'insert'
  | 'found'
  | 'notFound'
  | 'delete';

export interface MicroStep {
  stepId: string;
  phase: StepPhase;
  treeSnapshot: BTree;
  description: string;
  activeNodeId: string | null;
  activeKeyIndex?: number | null;
  secondaryNodeId?: string | null;
  elevatedKey?: number | null;
  pseudocodeLine: number;
  highlightType: HighlightType;
  timestamp: number;
}

export interface NodeLayout {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TreeLayout {
  nodes: Record<string, NodeLayout>;
  canvasWidth: number;
  canvasHeight: number;
  contentWidth: number;
  contentHeight: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
