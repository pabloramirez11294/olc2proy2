import { Expression } from "../Modelos/Expression";
import { Retorno, Type } from "../Modelos/Retorno";
import { Environment } from "../Entornos/Environment";
import {Error_} from '../Reportes/Errores';
import { Data } from "../Data/Data";


export class Ternario extends Expression{
    constructor(private condicion:Expression,private left: Expression, private right: Expression, line: number, column: number){
        super(line,column);
    }

    public execute(amb : Environment) : Retorno{
        const data = Data.getInstance();
        const condicion = this.condicion.execute(amb);
        if(condicion.type != Type.BOOLEAN){
            throw new Error_(this.line, this.column, 'Semantico', 'La expresion no regresa un valor booleano: ' + condicion.value+", es de tipo: "+condicion.type ,amb.getNombre());
        }
        const lblsalida = data.newLabel();
        let res = data.newTmp();
        data.addLabel(this.condicion.trueLabel);
        const leftValue = this.left.execute(amb);
        data.addExpression(res,leftValue.value);
        data.addGoto(lblsalida);
        data.addLabel(condicion.falseLabel);     
        const rightValue = this.right.execute(amb);
        data.addExpression(res,rightValue.value);
        data.addLabel(lblsalida);


        return {value:res,type:leftValue.type,esTmp:true};
            
    }
}