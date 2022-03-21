import { Parser } from "../base/parser";
import { ParserError } from "../base/parserError";
import { ParserResult } from "../base/parserResult";
import { ParserState } from "../base/parserState";

export class StringParser extends Parser {
    private matchString: string;

    constructor(value: string) {
        super();
        this.matchString = value;
    }

    parse(state: ParserState): ParserState {
        if (state.isError) {
            return state;
        }

        const inp = state.inputString.substring(state.index);

        if (inp.length < this.matchString.length) {
            return this.updateError(
                state,
                new ParserError(
                    `Unexpected end of input, expected ${this.matchString}, found end of input`
                )
            );
        }

        if (inp.startsWith(this.matchString)) {
            return this.updateState(
                state,
                state.index + this.matchString.length,
                new ParserResult(this.matchString)
            );
        }

        return this.updateError(
            state,
            new ParserError(`No match found, expected ${this.matchString} but got ${inp}`)
        );
    }
}
