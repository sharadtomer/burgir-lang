import { Parser } from "../base/parser";
import { ParserError } from "../base/parserError";
import { ParserResult } from "../base/parserResult";
import { ParserState } from "../base/parserState";

export class RegexParser extends Parser {
    private regex: RegExp;

    constructor(regex: RegExp) {
        super();
        this.regex = regex;
    }

    parse(state: ParserState): ParserState {
        if (state.isError) {
            return state;
        }

        const inp = state.inputString.substring(state.index);
        var match = this.regex.exec(inp);

        if (match) {
            return this.updateState(
                state,
                state.index + match[0].length,
                new ParserResult(match[0])
            );
        }

        return this.updateError(
            state,
            new ParserError(
                `No match found, expected pattern ${this.regex}, found ${state.inputString}`
            )
        );
    }
}
