import { ParserError } from "./parserError";
import { ParserResult } from "./parserResult";
import { ParserState } from "./parserState";

export type ParserTransformFn = (initialState: ParserState) => ParserState;
export type ResultTransformFn = (initialState: ParserResult) => ParserResult;
export type ErrorTransformFn = (initialState: ParserError) => ParserError;

// Main parser class
export class Parser {

    protected parserFn: ParserTransformFn;

    constructor(parserFn: ParserTransformFn = null){
        this.parserFn = parserFn;
    }

    // main parse method, responsible to transform input state to output state
    parse(inputState: ParserState): ParserState{
        if(this.parserFn){
            return this.parserFn(inputState);
        }else {
            return inputState;
        }        
    }

    // run method, used to start parsing new string, creates initial state
    run(inputStr: string): ParserState{
        const initialState = new ParserState();
        initialState.inputString = inputStr;

        return this.parse(initialState);
    }

    // utils to easily return new modify states
    updateState(state: ParserState, index: number, result: ParserResult): ParserState {
        
        var newState = state.clone();
        newState.index = index;
        newState.result = this.internalResultMap(state, index, result);

        return newState;
    }

    updateResult(state: ParserState, result: ParserResult): ParserState {
        
        var newState = state.clone();
        newState.result = this.internalResultMap(state, state.index, result);

        return newState;
    }

    updateError(state: ParserState, err: ParserError): ParserState {
        
        var newState = state.clone();
        newState.error = this.internalErrorMap(state, err);
        newState.isError = true;

        return newState;
    }

    // override in inherited class to return custom result and error
    protected internalResultMap(state: ParserState, index: number, result: ParserResult): ParserResult{
        return result;
    }

    protected internalErrorMap(state: ParserState, err: ParserError): ParserError{
        return err;
    }

    // map the output to another form
    map(mapFn: ResultTransformFn): Parser{
        const mainParser = this;
        return new Parser((state) => {
            const newState = mainParser.parse(state);
            if(newState.isError){
                return newState;
            }

            newState.result = mapFn(newState.result);
            return newState;
        });
    }

    // map the error to another form
    mapError(mapFn: ErrorTransformFn): Parser{
        const mainParser = this;
        return new Parser((state) => {
            const newState = mainParser.parse(state);
            if(newState.isError){
                newState.error = mapFn(newState.error);
            }

            return newState;
        });
    }
}