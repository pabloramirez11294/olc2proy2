import { Instruction } from "../Modelos/Instruction";
import { Unario } from "../Expresiones/Unario";
import { Environment } from "../Entornos/Environment";

export class InstrucUnaria extends Instruction{

    constructor(private value : Unario, line : number, column : number){
        super(line, column);
    }
    public execute(environment : Environment) {
        const value = this.value.execute(environment);
    }
}