import { Parser } from "../base/parser";
import { ParserResult } from "../base/parserResult";
import { ParserState } from "../base/parserState";

export class SequenceOfParser extends Parser {
    private _parsers: Parser[] = [];

    constructor(...parsers: Parser[]) {
        super();
        this._parsers = parsers;
    }

    parse(state: ParserState): ParserState {
        if (state.isError) {
            return state;
        }

        const results: ParserResult[] = [];
        var nextState = state;

        for (let i = 0; i < this._parsers.length; i++) {
            const p = this._parsers[i];
            nextState = p.parse(nextState);
            if (!nextState.isError) {
                results.push(nextState.result);
            } else {
                return this.updateError(state, nextState.error);
            }
        }

        return this.updateResult(nextState, new ParserResult(results));
    }
}
