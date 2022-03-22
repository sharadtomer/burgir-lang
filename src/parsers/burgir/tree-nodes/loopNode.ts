import { NodesType } from "../nodeTypes";
import { BlockNode } from "./blockNode";
import { TreeNode } from "./node";

export class LoopNode extends TreeNode {

    condition: TreeNode;
    value: BlockNode;

    constructor(condition: TreeNode, value: BlockNode){
        super(NodesType.Loop);
        this.value = value;
        this.condition = condition;
    }
}
