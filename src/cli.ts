import config from "../config/config.json";
import { BurgirParser } from "./parsers/burgir/burgir";
import { IOHelper } from "./tools/IOHelper";
import { JsTranspiler } from "./transpiler/jsTranspiler";
import { program } from "commander";
import path from "path";

export class CLI {

    ioHelper: IOHelper;
    parser: BurgirParser;
    generator: JsTranspiler;

    testCode = `     
    burgir bdaBurgir = 6
    take 1 bites from bdaBurgir

    agr(bdaBurgir > 3){
        take 6 bites from bdaBurgir
    }

    khao jbtk(bdaBurgir > 3){
        add 3 cheese slice to bdaBurgir
        agr(bdaBurgir > 3){
            take 6 bites from bdaBurgir
        }
    }

    deliver bdaBurgir
    `;
    
    constructor() {
        this.ioHelper = new IOHelper();
        this.parser = new BurgirParser();
        this.generator = new JsTranspiler();

        this.initCommands();
    }

    async run(){
        // update this method with main cli functionality
        program.parse();
        
    }

    private async _getJsCode(filePath: string){
        const fileContent = await this.ioHelper.getFileContent(path.resolve(process.cwd(), filePath));

        const parseState = this.parser.parse(fileContent);
        if(parseState.isError){
            throw new Error(parseState.error.message);
        }
        const jsCode = this.generator.getCode(parseState.result);
        return jsCode;
    }

    private async _genarateJs(filePath){
        const code = await this._getJsCode(filePath);

        // write to file
        await this.ioHelper.writeFile(path.resolve(process.cwd(), "output.js"), code);
    }

    private async _runCode(filePath){
        const code = await this._getJsCode(filePath);

        // run code
        eval(code);
    }


    private initCommands() {
        // generate js
        program
            .command("generate")
            .description("generate js code from burgir language")
            .argument("[filePath]")
            .action((filePath) => {
                this._genarateJs(filePath);
            });

        // run code
        program
            .command("run")
            .description("run burgir code")
            .argument("[filePath]")
            .action((filePath) => {
                this._runCode(filePath);
            });
    }

}
