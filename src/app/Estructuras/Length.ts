import {Error_} from '../Reportes/Errores';
import { Expression } from "../Modelos/Expression";
import { Retorno ,Type} from "../Modelos/Retorno";
import { Environment ,Simbolo} from "../Entornos/Environment";
import { Arreglo } from './Arreglo';
import { Instruction } from '../Modelos/Instruction';

export class Length extends Expression{

    constructor(private id: Expression, linea : number, columna: number){
        super(linea,columna);
    }
    public execute(amb:Environment): Retorno{
        //TODO validadciones
        const res:Arreglo = this.id.execute(amb).value;
        return {value: res.length(),type: Type.NUMBER};
    }

}

export class Push extends Instruction{
    constructor(private idExp: Expression,private id: string,private value:Expression, linea : number, columna: number){
        super(linea,columna);
    }
    public execute(amb:Environment){
        //TODO validadciones
        if(this.idExp==undefined){
            const sim:Simbolo= amb.getVar(this.id);
            const arr:Arreglo = sim.valor;        
            const val= this.value.execute(amb);
            arr.push(val.value);
        }else{
            const res:Arreglo = this.idExp.execute(amb).value;
            const val= this.value.execute(amb);
            res.push(val.value);
        }
        
    }

}
export class Pop extends Expression{
    constructor(private idExp: Expression,private id: string, linea : number, columna: number){
        super(linea,columna);
    }
    public execute(amb:Environment): Retorno{
        //TODO validadciones
        if(this.idExp==undefined){
            const sim:Simbolo= amb.getVar(this.id);
            const arr:Arreglo = sim.valor;      
            return {value: arr.pop(),type: arr.tipoArreglo};
        }else{
            const res:Arreglo = this.idExp.execute(amb).value;
            return {value: res.pop(),type: res.tipoArreglo};
        }
        
    }

}