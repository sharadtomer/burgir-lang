import { ParserError } from "../base/parserError";
import { ParserState } from "../base/parserState";
import { RegexParser } from "./regexParser";

export class LettersParser extends RegexParser {
    static _lettersRegex = "^[a-zA-Z]+";

    constructor() {
        super(new RegExp(LettersParser._lettersRegex));
    }

    protected internalErrorMap(state: ParserState, err: ParserError): ParserError {
        return new ParserError(`Error at index ${state.index}, Expected letters`);
    }
}
