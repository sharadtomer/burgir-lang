import { NodesType } from "../nodeTypes";
import { TreeNode } from "./node";

export class VarNameNode extends TreeNode {

    value: any;

    constructor(name: string){
        super(NodesType.VarName);
        this.value = name;
    }
}
