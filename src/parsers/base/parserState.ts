import { ParserError } from "./parserError";
import { ParserResult } from "./parserResult";

// class to represent parse state
export class ParserState {

    inputString: string;
    index: number;
    result: ParserResult;
    isError: boolean;
    error: ParserError;
    
    constructor(){
        this._init();
    }

    // set defaults
    private _init(){
        this.isError = false;
        this.inputString = "";
        this.index = 0;
        this.result = null;
        this.error = null;
    }

    clone(): ParserState{
        const clonedState = new ParserState();

        clonedState.isError = this.isError;
        clonedState.inputString = this.inputString;
        clonedState.index = this.index;
        clonedState.result = this.result;
        clonedState.error = this.error;

        return clonedState;
    }
}