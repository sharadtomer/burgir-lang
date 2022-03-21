import { NodesType } from "../nodeTypes";
import { TreeNode } from "./node";

export class BlockNode extends TreeNode {

    value: TreeNode[];

    constructor(values: TreeNode[] = []){
        super(NodesType.Block);
        this.value = values;
    }
}
