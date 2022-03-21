import { NodesType } from "../nodeTypes";
import { TreeNode } from "./node";

export class LoopNode extends TreeNode {

    condition: TreeNode;
    value: TreeNode[];

    constructor(condition: TreeNode, values: TreeNode[] = []){
        super(NodesType.Loop);
        this.value = values;
        this.condition = condition;
    }
}
