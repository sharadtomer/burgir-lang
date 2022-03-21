import { NodesType } from "../nodeTypes";
import { TreeNode } from "./node";

export class PrintNode extends TreeNode {

    value: TreeNode[];

    constructor(values: TreeNode[] = []){
        super(NodesType.Print);
        this.value = values;
    }
}
