import config from "../config/config.json";
import { BurgirParser } from "./parsers/burgir/burgir";
import { IOHelper } from "./tools/IOHelper";

export class CLI {

    ioHelper: IOHelper;
    parser: BurgirParser;

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
    `;
    
    constructor() {
        this.ioHelper = new IOHelper();
        this.parser = new BurgirParser();
    }

    async run(){
        // update this method with main cli functionality
        this.parser.parse(this.testCode);
    }

    

}
