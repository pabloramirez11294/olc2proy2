import { Expression } from "../Modelos/Expression";
import { Retorno, Type } from "../Modelos/Retorno";
import { Environment } from "../Entornos/Environment";
import { Data } from '../Data/Data';
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
        const data = Data.getInstance();
        const leftValue = this.left.execute(amb);
        const rightValue = this.right.execute(amb);
        if(leftValue.type==Type.BOOLEAN && rightValue.type==Type.BOOLEAN){
            data.addLabel(leftValue.falseLabel);
            data.addLabel(leftValue.trueLabel);
            data.addLabel(rightValue.falseLabel);
            data.addLabel(rightValue.trueLabel);
        }
        let result : Retorno={value:null,type:null};
        if(leftValue.type==Type.ARREGLO && rightValue.type==Type.ARREGLO){
            
        }else{         
            this.mismoTipo(leftValue.type, rightValue.type,amb.getNombre());
            
            this.trueLabel = this.trueLabel == '' ? data.newLabel() : this.trueLabel;
            this.falseLabel = this.falseLabel == '' ? data.newLabel() : this.falseLabel;
            if(this.type == RelationalOption.MENOR){     
                data.addIf(leftValue.value,rightValue.value,'<',this.trueLabel);
            }else if(this.type == RelationalOption.MAYOR){     
                data.addIf(leftValue.value,rightValue.value,'>',this.trueLabel);
            }else if(this.type == RelationalOption.MENORIGUAL){     
                data.addIf(leftValue.value,rightValue.value,'<=',this.trueLabel);
            }else if(this.type == RelationalOption.MAYORIGUAL){     
                data.addIf(leftValue.value,rightValue.value,'>=',this.trueLabel);
            }else if(this.type == RelationalOption.IGUAL){     
                data.addIf(leftValue.value,rightValue.value,'==',this.trueLabel);
            }else if(this.type == RelationalOption.NOIGUAL){     
                data.addIf(leftValue.value,rightValue.value,'!=',this.trueLabel);            
            }
            result.value = null;         
            result.type = Type.BOOLEAN;result.esTmp=false;
            result.trueLabel = this.trueLabel;
            result.falseLabel = this.falseLabel;
            data.addGoto(this.falseLabel);
            return result;
        }               
    }
}