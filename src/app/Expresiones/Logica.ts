import { Expression } from "../Modelos/Expression";
import { Retorno, Type } from "../Modelos/Retorno";
import { Environment } from "../Entornos/Environment";
import {Error_} from '../Reportes/Errores';
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
        const leftValue = this.left.execute(amb);
        let rightValue;
        if(this.right!=null)
            rightValue = this.right.execute(amb);
        let result : Retorno={value:null,type:null};
        
        if(this.type == LogicaOpcion.NOT){     
            //TODO result.value = !leftValue.value;         
            result.type = Type.BOOLEAN;
        }else if(leftValue.type!=Type.BOOLEAN || rightValue.type!= Type.BOOLEAN)
            throw new Error_(this.line, this.column, "Semantico", "Error con operaciones logicas tienen que ser booleanos",amb.getNombre());
        if(this.type == LogicaOpcion.AND){     
            result.value = leftValue.value && rightValue.value;         
            result.type = Type.BOOLEAN;
        }else if(this.type == LogicaOpcion.OR){     
            result.value = leftValue.value || rightValue.value;         
            result.type = Type.BOOLEAN;
        }
        return result;
    }
}