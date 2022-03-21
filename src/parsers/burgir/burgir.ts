import { Parser } from "../base/parser";
import { ParserError } from "../base/parserError";
import { BetweenParser } from "../utils/betweenParser";
import { ChoiceParser } from "../utils/choiceParser";
import { RegexParser } from "../utils/regexParser";
import { SequenceOfParser } from "../utils/sequenceOfParser";
import { StringParser } from "../utils/stringParser";
import { ValueKind, ValueNode } from "./tree-nodes/valueNode";
import { VarNameNode } from "./tree-nodes/varNameNode";

export class BurgirParser {

    numberParser: Parser;
    stringValueParser: Parser;
    booleanValueParser: Parser;
    varNameParser: Parser;
    valueParser: Parser;


    constructor(){
        this._initParser();
    }

    parse(code: string): string {
        const res = this.valueParser.run(code);
        return "";
    }

    private _initParser(){
        this._initNumParser();
        this._initStringParser();
        this._initBoolValueParser();
        this._initVarNameParser();
        this._initValueParser();
    }

    // number parser
    private _initNumParser(){
        const numRegex = new RegExp("^\\d+(\\.\\d+){0,1}");
        this.numberParser = new RegexParser(numRegex)
            .map((result) => {
                return new ValueNode(ValueKind.Number, parseFloat(result.value));
            })
            .mapError((err) => {
                return new ParserError(`Expected number `);
            });
    }

    // string value parser
    private _initStringParser(){
        this.stringValueParser = new BetweenParser(
            new StringParser('"'),
            new StringParser('"'),
            new RegexParser(/^[^"]*/)
        ).map(result => {
            return new ValueNode(ValueKind.String, result.value.value);
        }).mapError(err => {
            return new ParserError(`Expected string`)
        });
    }

    // boolean value parser
    private _initBoolValueParser(){
        this.booleanValueParser = new ChoiceParser(
            new StringParser("accha burgir"),
            new StringParser("ganda burgir")
        ).map(result => {
            return new ValueNode(ValueKind.Boolean, result.value === "accha burgir");
        }).mapError(err => {
            return new ParserError(`Expected boolean`);
        });
    }

    // var name parser
    private _initVarNameParser(){
        this.varNameParser = new RegexParser(/^\w[\w\d]*Burgir/)
            .map(result => {
                return new VarNameNode(result.value);
            })
            .mapError(err => {
                return new ParserError(`Expected varname`);
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
        }).mapError(err => {
            return new ParserError("Expected value");
        })
    }
}

