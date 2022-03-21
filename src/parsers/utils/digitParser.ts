import { ParserError } from "../base/parserError";
import { ParserState } from "../base/parserState";
import { RegexParser } from "./regexParser";

export class DigitsParser extends RegexParser {
    static _digitsRegex = "^[0-9]+";

    constructor() {
        super(new RegExp(DigitsParser._digitsRegex));
    }

    protected internalErrorMap(state: ParserState, err: ParserError): ParserError {
        return new ParserError(`Error at index ${state.index}, Expected digits`);
    }
}
