import { Data } from '../Data/Data';
import { Expression } from "../Modelos/Expression";
import { Retorno, Type } from "../Modelos/Retorno";

export class Literal extends Expression{
    
    constructor(public value : any, line : number, column: number, private type : string){
        super(line, column);
    }

    public execute() : Retorno{
        if(this.type == Type.NUMBER)
            return {value : String(this.value), type : Type.NUMBER,esTmp:false};
        else if(this.type == Type.STRING){
            //TODO c3d para string
            //return {value : this.value, type : Type.STRING};
        }else if(this.type == Type.BOOLEAN){
            const data = Data.getInstance();
            this.trueLabel = this.trueLabel == '' ? data.newLabel() : this.trueLabel;
            this.falseLabel = this.falseLabel == '' ? data.newLabel() : this.falseLabel;
            this.value=='1' ? data.addGoto(this.trueLabel) : data.addGoto(this.falseLabel);
            return {value : this.value, type : Type.BOOLEAN , trueLabel: this.trueLabel,esTmp:false,falseLabel:this.falseLabel};
        }else if(this.type == Type.NULL)
            return {value : this.value, type : Type.NULL,esTmp:false};
    }
}