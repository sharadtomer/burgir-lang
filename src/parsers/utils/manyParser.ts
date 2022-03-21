import { Parser } from "../base/parser";
import { ParserError } from "../base/parserError";
import { ParserResult } from "../base/parserResult";
import { ParserState } from "../base/parserState";

export class ManyParser extends Parser {
    private _parser: Parser;
    private _minCount: number;

    constructor(parser: Parser, minCount = 0) {
        super();
        this._parser = parser;
        this._minCount = minCount;
    }

    parse(state: ParserState): ParserState {
        if (state.isError) {
            return state;
        }

        const results: ParserResult[] = [];
        let nextState = state;

        while (!nextState.isError) {
            nextState = this._parser.parse(nextState);
            if (!nextState.isError) {
                results.push(nextState.result);
                state = nextState;
            }
        }

        if (results.length < this._minCount) {
            return this.updateError(
                state,
                new ParserError(
                    `expected ${this._minCount} counts, but got ${results.length} counts`
                )
            );
        } else {
            return this.updateResult(state, new ParserResult(results));
        }
    }
}

export class ManyOneParser extends ManyParser {
    constructor(parser: Parser) {
        super(parser, 1);
    }
}

export class ManySeptParser extends Parser {
    private _parser: Parser;
    private _septByParser: Parser;

    private _minCount: number;

    public ManySeptParser(parser: Parser, septBy: Parser, minCount = -1) {
        this._parser = parser;
        this._septByParser = septBy;
        this._minCount = minCount;
    }

    parse(state: ParserState): ParserState {
        if (state.isError) {
            return state;
        }

        const results: ParserResult[] = [];
        let nextState = state;

        while (!nextState.isError) {
            nextState = this._parser.parse(nextState);
            if (!nextState.isError) {
                results.push(nextState.result);
                state = nextState;
            }

            nextState = this._septByParser.parse(nextState);
        }

        if (results.length < this._minCount) {
            return this.updateError(
                state,
                new ParserError(
                    `expected ${this._minCount} counts, but got ${results.length} counts`
                )
            );
        } else {
            return this.updateResult(state, new ParserResult(results));
        }
    }
}

export class ManyMaxParser extends Parser {
    private _parser: Parser;
    private _minCount: number;
    private _maxCount: number;

    public ManyMaxParser(parser: Parser, minCount = 0, maxCount = 1) {
        this._parser = parser;
        this._minCount = minCount;
        this._maxCount = maxCount;
    }

    parse(state: ParserState): ParserState {
        if (state.isError) {
            return state;
        }

        const results: ParserResult[] = [];
        var nextState = state;

        while (!nextState.isError) {
            nextState = this._parser.parse(nextState);
            if (!nextState.isError) {
                results.push(nextState.result);
                state = nextState;
            }
        }

        if (results.length < this._minCount) {
            return this.updateError(
                state,
                new ParserError(
                    `expected min ${this._minCount} counts, but got ${results.length} counts`
                )
            );
        } else if (results.length > this._maxCount) {
            return this.updateError(
                state,
                new ParserError(
                    `expected max ${this._minCount} counts, but got ${results.length} counts`
                )
            );
        } else {
            return this.updateResult(state, new ParserResult(results));
        }
    }
}
