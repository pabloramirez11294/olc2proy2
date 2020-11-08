import { Data } from '../Data/Data';
import { Expression } from "../Modelos/Expression";
import { Retorno, Type } from "../Modelos/Retorno";

export class Literal extends Expression{
    
    constructor(public value : string, line : number, column: number, private type : string){
        super(line, column);
    }

    public execute() : Retorno{
        if(this.type == Type.NUMBER)
            return {value : String(this.value), type : Type.NUMBER,esTmp:false};
        else if(this.type == Type.STRING){
            const data = Data.getInstance();
            const tmp = data.newTmp();
            data.addComentario('Inicia string');
            data.addExpression(tmp, 'h');            
            data.addSetHeap(tmp, this.value.length.toString());
            data.nextHeap();
            for (let i = 0; i < this.value.length; i++) {
                data.addSetHeap('h', this.value.charCodeAt(i));
                data.nextHeap();
            }
            data.addComentario('Fin string');
            return {value : tmp, type : Type.STRING, esTmp:true};
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