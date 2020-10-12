import { Instruction } from "../Modelos/Instruction";
import { Expression } from "../Modelos/Expression";
import { Environment } from "../Entornos/Environment";
import { Retorno, Type } from "../Modelos/Retorno";
export class Return extends Instruction{

    constructor(public exp:Expression,line : number, column : number){
        super(line, column);
    }

    public execute(env : Environment): Retorno {
        if(this.exp==undefined){
            return {value:null, type :Type.NULL };
        }
        const resultado = this.exp.execute(env);
        return {value:resultado.value, type :resultado.type };
    }
}