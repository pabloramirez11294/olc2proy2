import { Expression } from "../Modelos/Expression";
import { Retorno, Type } from "../Modelos/Retorno";
import { Environment } from "../Entornos/Environment";
export enum RelationalOption{
    MENOR,
    MAYOR,
    MENORIGUAL,
    MAYORIGUAL,
    IGUAL,
    NOIGUAL
}

export class Relacional extends Expression{
    constructor(public left: Expression, public right: Expression, public type : RelationalOption, line: number, column: number){
        super(line,column);
    }

    public execute(amb : Environment) : Retorno{
        const leftValue = this.left.execute(amb);
        const rightValue = this.right.execute(amb);
        let result : Retorno={value:null,type:null};
        if(leftValue.type==Type.ARREGLO && rightValue.type==Type.ARREGLO){
            
        }else            
            this.mismoTipo(leftValue.type, rightValue.type,amb.getNombre());
        /*TODO c3d relacional
        if(this.type == RelationalOption.MENOR){     
            result.value = leftValue.value < rightValue.value;         
            result.type = Type.BOOLEAN;
        }else if(this.type == RelationalOption.MAYOR){     
            result.value = leftValue.value > rightValue.value;         
            result.type = Type.BOOLEAN;
        }else if(this.type == RelationalOption.MENORIGUAL){     
            result.value = leftValue.value <= rightValue.value;         
            result.type = Type.BOOLEAN;
        }else if(this.type == RelationalOption.MAYORIGUAL){     
            result.value = leftValue.value >= rightValue.value;         
            result.type = Type.BOOLEAN;
        }else if(this.type == RelationalOption.IGUAL){     
            result.value = leftValue.value == rightValue.value;         
            result.type = Type.BOOLEAN;
        }else if(this.type == RelationalOption.NOIGUAL){     
            result.value = leftValue.value != rightValue.value;         
            result.type = Type.BOOLEAN;
        }*/
        return result;
    }
}