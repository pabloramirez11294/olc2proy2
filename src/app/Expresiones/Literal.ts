import { Expression } from "../Modelos/Expression";
import { Retorno, Type } from "../Modelos/Retorno";

export class Literal extends Expression{
    
    constructor(public value : any, line : number, column: number, private type : number){
        super(line, column);
    }

    public execute() : Retorno{
        if(this.type == Type.NUMBER)
            return {value : String(this.value), type : Type.NUMBER};
        else if(this.type == Type.STRING){
            //TODO c3d para string
            //return {value : this.value, type : Type.STRING};
        }else if(this.type == Type.BOOLEAN){
            //TODO c3d para boolean
            //return {value : this.value, type : Type.BOOLEAN};
        }else if(this.type == Type.NULL)
            return {value : this.value, type : Type.NULL};
    }
}