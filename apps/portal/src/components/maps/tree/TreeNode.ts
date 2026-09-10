export interface TreeNode {

  id: number;

  name: string;

  type?: string;

  nodeType?: string;

  hidden?: boolean;

  open?: boolean;

  children?: TreeNode[];
}
