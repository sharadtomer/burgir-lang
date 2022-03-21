import { NodesType } from "../nodeTypes";
import { TreeNode } from "./node";

export class IncrementDecrementNode extends TreeNode {

    value: any;
    variable: string;

    constructor(type: NodesType, value: any, variableName: string){
        super(NodesType.Increment);

        this.type = type;
        this.value = value;
        this.variable = variableName;
    }
}
