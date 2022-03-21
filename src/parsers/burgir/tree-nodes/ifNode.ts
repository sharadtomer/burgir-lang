import { NodesType } from "../nodeTypes";
import { TreeNode } from "./node";

export class IfNode extends TreeNode {

    condition: TreeNode;
    ifBlock: TreeNode;
    elifBlocks: TreeNode[];
    elseBlock: TreeNode;

    constructor(condition: TreeNode, ifBlock: TreeNode, elifBlocks: TreeNode[] = [], elseBlock: TreeNode = null){
        super(NodesType.If);
        this.condition = condition;
        this.ifBlock = ifBlock;
        this.elifBlocks = elifBlocks;
        this.elseBlock = elseBlock;
    }
}
