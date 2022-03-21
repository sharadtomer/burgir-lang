import { NodesType } from "../nodeTypes";
import { TreeNode } from "./node";

export class AssignmentNode extends TreeNode {

    value: any;
    left: TreeNode;
    right: TreeNode;

    constructor(left: TreeNode, right: TreeNode){
        super(NodesType.Assignment, "=");
        this.left = left;
        this.right = right;
    }
}
