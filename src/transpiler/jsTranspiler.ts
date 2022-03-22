import { ParserResult } from "../parsers";
import { NodesType } from "../parsers/burgir/nodeTypes";
import { AssignmentNode } from "../parsers/burgir/tree-nodes/assignmentNode";
import { BlockNode } from "../parsers/burgir/tree-nodes/blockNode";
import { IfNode } from "../parsers/burgir/tree-nodes/ifNode";
import { IncrementDecrementNode } from "../parsers/burgir/tree-nodes/IncrementDecrementNode";
import { LoopNode } from "../parsers/burgir/tree-nodes/loopNode";
import { TreeNode } from "../parsers/burgir/tree-nodes/node";
import { PrintNode } from "../parsers/burgir/tree-nodes/printNode";

export class JsTranspiler {

    constructor(){

    }

    getCode(ast: ParserResult){
        return this._getBlockStatementsCode(ast.value);
    }

    private _getBlockStatementsCode(nodes: TreeNode[]){
        let code = ``;

        for(let i = 0; i < nodes.length; i++){
            const node = nodes[i];
            switch(node.type){

                // statements
                case NodesType.Statement: {
                    code += this._getStatementCode(node);
                    break;
                }
                
                // if block
                case NodesType.If: {
                    code += this._getIfElseBlockCode(node as IfNode);
                    break;
                }

                // loop code
                case NodesType.Loop: {
                    code += this._getLoopCode(node as LoopNode);
                    break;
                }
            }

            code += "\n";
        }

        return code;
    }

    // get block code
    private _getBlockCode(node: BlockNode){
        let code = ``;

        code += `{\n`;
        code += this._getBlockStatementsCode(node.value);
        code += `}`;

        return code;
    }

    // generate code for single if statement
    private _getStatementCode(statement: TreeNode) {
        let code = ``;

        statement = statement.value;
        switch(statement.type){
            case NodesType.Decrement: {
                code += `${(statement as IncrementDecrementNode).variable} -= ${(statement as IncrementDecrementNode).value};`;
                break;
            }

            case NodesType.Increment: {
                code += `${(statement as IncrementDecrementNode).variable} += ${(statement as IncrementDecrementNode).value};`;
                break;
            }

            case NodesType.Break: {
                code += `break;`;
                break;
            }

            case NodesType.Continue: {
                code += `continue;`;
                break;
            }

            case NodesType.Print: {
                code += `console.log(${(statement as PrintNode).value.map(n => n.value).join(", ")});`;
                break;
            }

            case NodesType.Assignment: {
                let leftNode = (statement as AssignmentNode).left.value;
                if((statement as AssignmentNode).left.type === NodesType.Declaration){
                    leftNode = `var ${leftNode}`;
                }

                let rightNode = (statement as AssignmentNode).right.value;
                code += `${leftNode} = ${rightNode};`;
                break;
            }

            case NodesType.Declaration: {
                code += `var ${statement.value};`;
                break;
            }
        }

        return code;
    }

    // generate code for if-else-block
    private _getIfElseBlockCode(node: IfNode){
        let code = ``;

        code += this._getIfCode(node);
        for(let i = 0; i < node.elifBlocks.length; i++){
            code += this._getElIfCode(node.elifBlocks[i] as IfNode);
        }

        if(node.elseBlock){
            code += this._getElseCode(node);
        }

        return code;
    }

    // get else code
    private _getElseCode(node: IfNode){
        let code = ``;
        code += `else ${this._getBlockCode(node.elseBlock)}`;
        return code;
    }

    // get elif code
    private _getElIfCode(node: IfNode){
        let code = ``;
        code += `else ${this._getIfCode(node)}`;
        return code;
    }

    // generate code for if block
    private _getIfCode(node: IfNode){
        let code = ``;

        code += `if( ${node.condition.value} )`;
        code += this._getBlockCode(node.ifBlock);

        return code;
    }

    // generate code for loop
    private _getLoopCode(node: LoopNode) {
        let code = ``;

        code += `while( ${node.condition.value} )`;
        code += this._getBlockCode(node.value);

        return code;
    }

    
}
