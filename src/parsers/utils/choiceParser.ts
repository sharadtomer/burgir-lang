import { Parser } from "../base/parser";
import { ParserError } from "../base/parserError";
import { ParserState } from "../base/parserState";

export class ChoiceParser extends Parser {
    private _parsers: Parser[];

    constructor(...parsers: Parser[]) {
        super();
        this._parsers = parsers;
    }

    parse(state: ParserState): ParserState {
        if (state.isError) {
            return state;
        }

        for (let i = 0; i < this._parsers.length; i++) {
            const p = this._parsers[i];

            var nextState = p.parse(state);
            if (!nextState.isError) {
                return nextState;
            }
        }

        return this.updateError(
            state,
            new ParserError(`Unable to match with any parser at index ${state.index}`)
        );
    }
}
