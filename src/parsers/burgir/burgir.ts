import { Parser } from "../base/parser";
import { ParserError } from "../base/parserError";
import { BetweenParser } from "../utils/betweenParser";
import { ChoiceParser } from "../utils/choiceParser";
import { ManyMaxParser, ManyOneParser, ManyParser, ManySeptParser } from "../utils/manyParser";
import { RegexParser } from "../utils/regexParser";
import { SequenceOfParser } from "../utils/sequenceOfParser";
import { StringParser } from "../utils/stringParser";
import { NodesType } from "./nodeTypes";
import { AssignmentNode } from "./tree-nodes/assignmentNode";
import { BlockNode } from "./tree-nodes/blockNode";
import { DeclarationNode } from "./tree-nodes/decalarationNode";
import { IfNode } from "./tree-nodes/ifNode";
import { IncrementDecrementNode } from "./tree-nodes/IncrementDecrementNode";
import { LoopNode } from "./tree-nodes/loopNode";
import { TreeNode } from "./tree-nodes/node";
import { PrintNode } from "./tree-nodes/printNode";
import { ValueKind, ValueNode } from "./tree-nodes/valueNode";
import { VarNameNode } from "./tree-nodes/varNameNode";


const lazy = (fn) => {
    return new Parser((state) => {
        const p = fn();
        return p.parse(state);
    });
}
export class BurgirParser {

    // value parsers
    numberParser: Parser;
    stringValueParser: Parser;
    booleanValueParser: Parser;
    varNameParser: Parser;
    valueParser: Parser;

    // space
    spaceParser: Parser;
    optionalSpaceParser: Parser;
    lineBreak: Parser;

    // statements
    operatorParser: Parser;
    declarationParser: Parser;
    equationParser: Parser;
    assignmentParser: Parser;
    printStatementParser: Parser;
    continueStatement: Parser;
    breakStatement: Parser;
    incrementStatement: Parser;
    decrementStatement: Parser;
    statementParser: Parser;
    emptyLineStatement: Parser;

    // block
    blockParser: Parser;
    ifParser: Parser;
    whileLoopParser: Parser;

    // language parser
    languageParser: Parser;

    constructor(){
        this._initParser();
    }

    parse(code: string) {
        const res = this.languageParser.run(code);
        return res;
    }

    private _initParser(){
        // value parsers
        this._initNumParser();
        this._initStringParser();
        this._initBoolValueParser();
        this._initVarNameParser();
        this._initValueParser();

        // space parser
        this._initSpaceParser();

        // equation parser
        this._initOperatorParser();
        this._initEquationParser();

        // statement parsers
        this._initDeclarationStatementParser();
        this._initAssignmentParser();
        this._initPrintStatementParser();
        this._initBreakStatement();
        this._initContinueStatement();
        this._initIncrementStatement();
        this._initDecrementStatement();
        this._initStatementParser();

        // block parser
        this._initBlockParser();
        this._initIfParser();
        this._initWhileLoop();

        // language parser
        this._initLanguageParser();
    }

    // number parser
    private _initNumParser(){
        const numRegex = new RegExp("^\\d+(\\.\\d+){0,1}");
        this.numberParser = new RegexParser(numRegex)
            .map((result) => {
                return new ValueNode(ValueKind.Number, parseFloat(result.value));
            });
    }

    // string value parser
    private _initStringParser(){
        this.stringValueParser = new BetweenParser(
            new StringParser('"'),
            new StringParser('"'),
            new RegexParser(/^[^"]*/)
        ).map(result => {
            return new ValueNode(ValueKind.String, `"${result.value.value}"`);
        });
    }

    // boolean value parser
    private _initBoolValueParser(){
        this.booleanValueParser = new ChoiceParser(
            new StringParser("accha burgir"),
            new StringParser("ganda burgir")
        ).map(result => {
            return new ValueNode(ValueKind.Boolean, result.value === "accha burgir");
        });
    }

    // var name parser
    private _initVarNameParser(){
        this.varNameParser = new RegexParser(/^\w[\w\d]*Burgir/)
            .map(result => {
                return new VarNameNode(result.value);
            });
    }

    // value parser, value can be number, string, bool, varname
    private _initValueParser(){
        this.valueParser = new ChoiceParser(
            this.stringValueParser,
            this.numberParser,
            this.booleanValueParser,
            this.varNameParser
        ).map(result => {
            return result;
        });
    }

    // space parser, includes spaces, tabs, linebreaks
    private _initSpaceParser(){
        this.spaceParser = new RegexParser(/^[\s\b]+/)
            .map(res => {
                return new TreeNode(NodesType.Space, " ");
            });

        this.optionalSpaceParser = new RegexParser(/^[ \b]*/)
            .map(res => {
                return new TreeNode(NodesType.Space, " ");
            });

        this.lineBreak = new RegexParser(/^\r?\n/)
            .map(res => {
                return new TreeNode(NodesType.NewLine, "\n");
            });
        
        
    }

    // declaration statement
    private _initDeclarationStatementParser(){
        this.declarationParser = new SequenceOfParser(
            new StringParser("burgir"),
            this.spaceParser,
            this.varNameParser
        ).map(result => {
            return new DeclarationNode(result.value[2].value);
        });
    }

    // operators
    private _initOperatorParser() {
        this.operatorParser = new ChoiceParser(
            new StringParser("+"),
            new StringParser("-"),
            new StringParser("*"),
            new StringParser("/"),
            new StringParser(">="),
            new StringParser("<="),
            new StringParser("=="),
            new StringParser(">"),
            new StringParser("<"),
            new StringParser("&&"),
            new StringParser("||")
        ).map(result => {
            return new TreeNode(NodesType.Operator, result.value);
        });
    }

    // equation parser
    private _initEquationParser(){

        const _tempEqParser = 
                new ManySeptParser(
                    new ChoiceParser(
                        this.valueParser,
                        lazy(() => {
                            return _paranEnclosedEquation;
                        })
                    ),
                    new SequenceOfParser(
                        this.optionalSpaceParser,
                        this.operatorParser,
                        this.optionalSpaceParser
                    ).map(result => {
                        return new TreeNode(NodesType.Operator, result.value[1].value)
                    }),
                    true
                ).map(result => {
                    return new TreeNode(NodesType.Equation, result.value.map(v => v.value).join(" "));
                });
        
        var _paranEnclosedEquation = 
                new BetweenParser(
                    new StringParser("("),
                    new StringParser(")"),
                    new SequenceOfParser(
                        this.optionalSpaceParser,
                        _tempEqParser,
                        this.optionalSpaceParser
                    ).map(result => {
                        return new TreeNode(NodesType.Equation, result.value[1].value)
                    })
                ).map(result => {
                    return new TreeNode(NodesType.Equation, `( ${result.value.value} )`);
                });

        this.equationParser = _tempEqParser;
    }

    // assignment equation
    private _initAssignmentParser(){
        this.assignmentParser = new SequenceOfParser(
            new ChoiceParser(
                this.declarationParser,
                this.varNameParser
            ),
            this.optionalSpaceParser,
            new StringParser("="),
            this.optionalSpaceParser,
            this.equationParser
        ).map(result => {
            return new AssignmentNode(
                result.value[0],
                result.value[4]
            );
        });
    }

    // print statement parser
    private _initPrintStatementParser(){
        this.printStatementParser = new SequenceOfParser(
            new StringParser("deliver"),
            this.spaceParser,
            new ManySeptParser(
                this.equationParser, 
                new SequenceOfParser(
                    this.optionalSpaceParser,
                    new StringParser(","),
                    this.optionalSpaceParser
                )
            )
        ).map(result => {
            return new PrintNode(result.value[2].value);
        });
    }

    // continue statement
    private _initContinueStatement(){
        this.continueStatement = new StringParser("agla khao")
            .map(result => {
                return new TreeNode(NodesType.Continue, null);
            });
    }

    // break statement
    private _initBreakStatement(){
        this.breakStatement = new StringParser("rhne do")
            .map(result => {
                return new TreeNode(NodesType.Break, null);
            });
    }

    // increment statement
    private _initIncrementStatement(){
        this.incrementStatement = new SequenceOfParser(
            new StringParser("add"),
            this.spaceParser,
            this.numberParser,
            this.spaceParser,
            new StringParser("cheese"),
            this.spaceParser,
            new StringParser("slice"),
            this.spaceParser,
            new StringParser("to"),
            this.spaceParser,
            this.varNameParser
        ).map(result => {
            return new IncrementDecrementNode(NodesType.Increment, result.value[2].value, result.value[10].value)
        });
    }

    // decrement statement
    private _initDecrementStatement(){
        this.decrementStatement = new SequenceOfParser(
            new StringParser("take"),
            this.spaceParser,
            this.numberParser,
            this.spaceParser,
            new StringParser("bites"),
            this.spaceParser,
            new StringParser("from"),
            this.spaceParser,
            this.varNameParser
        ).map(result => {
            return new IncrementDecrementNode(NodesType.Decrement, result.value[2].value, result.value[8].value)
        });
    }

    // statement parser
    private _initStatementParser(){
        this.emptyLineStatement = new ManyParser(
            new SequenceOfParser(
                this.optionalSpaceParser,
                this.lineBreak,
                this.optionalSpaceParser
            )  
        );

        this.statementParser = new SequenceOfParser(
            this.optionalSpaceParser,
            new ChoiceParser(
                this.decrementStatement,
                this.incrementStatement,
                this.breakStatement,
                this.continueStatement,
                this.printStatementParser,
                this.assignmentParser,
                this.declarationParser
            ),
            this.optionalSpaceParser
        ).map(result => {
            return new TreeNode(NodesType.Statement, result.value[1]);
        });
    }

    // block parser
    private _initBlockParser(){

        const self = this;

        this.blockParser = new SequenceOfParser(
            this.optionalSpaceParser,
            new StringParser("{"),
            this.optionalSpaceParser,
            this.lineBreak,
            new ManySeptParser(
                // this.statementParser,
                new ChoiceParser(
                    this.statementParser,
                    lazy(() => this.ifParser),
                    lazy(() => this.whileLoopParser)
                ),
                new SequenceOfParser(
                    this.optionalSpaceParser,
                    this.lineBreak,
                    this.optionalSpaceParser
                )                
            ),
            this.lineBreak,
            this.optionalSpaceParser,
            new StringParser("}"),
            this.optionalSpaceParser
        ).map(result => {
            return new BlockNode(result.value[4].value);
        });
    }

    // if statement
    private _initIfParser(){
        const tempIf = new SequenceOfParser(
            this.optionalSpaceParser,
            new StringParser("agr"),
            this.optionalSpaceParser,
            new StringParser("("),
            this.optionalSpaceParser,
            this.equationParser,
            this.optionalSpaceParser,
            new StringParser(")"),
            this.blockParser
        ).map(result => {
            return new IfNode(result.value[5], result.value[8])
        });

        const elif = new SequenceOfParser(
            this.optionalSpaceParser,
            new StringParser("ni"),
            this.spaceParser,
            new StringParser("to"),
            this.spaceParser,
            tempIf
        );

        const elseParser = new SequenceOfParser(
            this.optionalSpaceParser,
            new StringParser("ni"),
            this.spaceParser,
            new StringParser("to"),
            this.optionalSpaceParser,
            this.blockParser
        );

        this.ifParser = new SequenceOfParser(
            tempIf,
            new ManyParser(elif),
            new ManyMaxParser(elseParser, 0, 1),
        ).map(result => {
            const elifBlocks = [];
            for(let i = 0; i < result.value[1].value.length; i++){
                elifBlocks.push(result.value[1].value[i].value[5]);
            }

            let elseBlock = null;
            if(result.value[2].value.length){
                elseBlock = result.value[2].value[0].value[5];
            }
            return new IfNode(result.value[0].condition, result.value[0].ifBlock, elifBlocks, elseBlock);
        });

    }

    // while loop
    private _initWhileLoop(){
        this.whileLoopParser = new SequenceOfParser(
            this.optionalSpaceParser,
            new StringParser("khao"),
            this.optionalSpaceParser,
            new StringParser("jbtk"),
            this.optionalSpaceParser,
            new StringParser("("),
            this.optionalSpaceParser,
            this.equationParser,
            this.optionalSpaceParser,
            new StringParser(")"),
            this.blockParser
        ).map(result => {
            return new LoopNode(result.value[7], result.value[10])
        });
    }

    // language parser
    private _initLanguageParser(){
        this.languageParser = 
        new SequenceOfParser(
            this.emptyLineStatement,
            new ManySeptParser(
                new ChoiceParser(
                    this.ifParser,
                    this.whileLoopParser,
                    this.statementParser
                ),
                
                this.emptyLineStatement
            ),
            this.emptyLineStatement
        ).map(result => {
            return result.value[1];
        });
    }
}

