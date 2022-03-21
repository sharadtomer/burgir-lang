import { Parser } from "../base/parser";
import { ParserResult } from "../base/parserResult";
import { ParserState } from "../base/parserState";
import { SequenceOfParser } from "./sequenceOfParser";

export class BetweenParser extends SequenceOfParser {
    
    constructor(left: Parser, right: Parser, content: Parser) {
        super(left, content, right);
    }

    protected internalResultMap(
        state: ParserState,
        index: number,
        result: ParserResult
    ): ParserResult {
        return new ParserResult(result.value[1]);
    }
}
