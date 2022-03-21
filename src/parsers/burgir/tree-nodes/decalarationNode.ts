import { NodesType } from "../nodeTypes";
import { TreeNode } from "./node";

export class DeclarationNode extends TreeNode {

    value: any;

    constructor(name: string){
        super(NodesType.Declaration);
        this.value = name;
    }
}
