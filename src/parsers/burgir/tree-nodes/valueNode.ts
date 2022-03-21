import { NodesType } from "../nodeTypes";
import { TreeNode } from "./node";

export enum ValueKind {
    Number,
    String,
    Boolean
}

export class ValueNode extends TreeNode {

    valueKind: ValueKind;
    value: any;

    constructor(valueKind: ValueKind, value: any){
        super(NodesType.Value);
        this.valueKind = valueKind;
        this.value = value;
    }
}
