import { Expression } from "../Modelos/Expression";
import { Retorno, Type } from "../Modelos/Retorno";
import { Environment } from "../Entornos/Environment";
import {Error_} from '../Reportes/Errores';
import { Data } from '../Data/Data';
export enum LogicaOpcion{
    AND,
    OR,
    NOT
}

export class Logica extends Expression{
    constructor(private left: Expression, private right: Expression, private type : LogicaOpcion, line: number, column: number){
        super(line,column);
    }

    public execute(amb : Environment) : Retorno{
        const data = Data.getInstance();
        this.trueLabel = this.trueLabel == '' ? data.newLabel() : this.trueLabel;
        this.falseLabel = this.falseLabel == '' ? data.newLabel() : this.falseLabel;
        let result : Retorno={value:null,type:null};
        
        
        if(this.type == LogicaOpcion.NOT){
            this.left.trueLabel = this.falseLabel;
            this.left.falseLabel = this.trueLabel;
            const leftValue = this.left.execute(amb);
            result.trueLabel = this.trueLabel;
            result.falseLabel = this.falseLabel;
        }else if(this.type == LogicaOpcion.AND){     
            this.left.trueLabel = data.newLabel();
            this.right.trueLabel = this.trueLabel;
            this.left.falseLabel = this.right.falseLabel = this.falseLabel;

            const leftValue = this.left.execute(amb);
            data.addLabel(this.left.trueLabel);
            const rightValue = this.right.execute(amb);

            this.verificacion(leftValue,rightValue,amb);
            result.trueLabel = this.trueLabel;
            result.falseLabel = this.right.falseLabel;
            
            
        }else if(this.type == LogicaOpcion.OR){    
            this.left.trueLabel = this.right.trueLabel = this.trueLabel;
            this.left.falseLabel = data.newLabel();
            this.right.falseLabel = this.falseLabel;

            const leftValue = this.left.execute(amb);
            data.addLabel(this.left.falseLabel);
            const rightValue = this.right.execute(amb);

            this.verificacion(leftValue,rightValue,amb);
            result.trueLabel = this.trueLabel;
            result.falseLabel = this.right.falseLabel;
        }        
        result.value = '';         
        result.type = Type.BOOLEAN;
        result.esTmp=false;
        return result;
    }

    verificacion(leftValue,rightValue,amb:Environment){
        if(leftValue.type!=Type.BOOLEAN || rightValue?.type!= Type.BOOLEAN)
                throw new Error_(this.line, this.column, "Semantico", "Error con operaciones logicas tienen que ser booleanos",amb.getNombre());                
    }
}