import { NodesType } from "../NodeTypes";

export class TreeNode {

    type: NodesType;  
    value: any;  

    constructor(type: NodesType, value: any = null){
        this.type = type;
        this.value = value
    }

    
}
