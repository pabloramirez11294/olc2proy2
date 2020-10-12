import { Expression } from "../Modelos/Expression";
import { Retorno, Type } from "../Modelos/Retorno";
import { Environment } from "../Entornos/Environment";
import {Error_} from '../Reportes/Errores';


export class Ternario extends Expression{
    constructor(private condicion:Expression,private left: Expression, private right: Expression, line: number, column: number){
        super(line,column);
    }

    public execute(amb : Environment) : Retorno{
        const condicion = this.condicion.execute(amb);
        if(condicion.type != Type.BOOLEAN){
            throw new Error_(this.line, this.column, 'Semantico', 'La expresion no regresa un valor booleano: ' + condicion.value+", es de tipo: "+condicion.type ,amb.getNombre());
        }
              
        
        if(condicion.value){
            const leftValue = this.left.execute(amb);
            return leftValue;
        }else{
             const rightValue = this.right.execute(amb);
             return rightValue;
        }
            
    }
}