import {Error_} from '../Reportes/Errores';
import { Expression } from "../Modelos/Expression";
import { Retorno ,Type} from "../Modelos/Retorno";
import { Environment ,Simbolo} from "../Entornos/Environment";
import { Arreglo } from './Arreglo';
import { Instruction } from '../Modelos/Instruction';
import { Data } from '../Data/Data';

export class Length extends Expression{

    constructor(private id: Expression, linea : number, columna: number){
        super(linea,columna);
    }
    public execute(amb:Environment): Retorno{
        //TODO validadciones
        let res:Retorno;
        const sim = this.id.execute(amb);
        const data = Data.getInstance();
        if(sim.type == Type.STRING){
            const tmp = data.newTmp();
            data.addGetHeap(tmp,sim.value);
            res = {value:tmp,esTmp:true,type:Type.NUMBER};
        }

        /*const res:Arreglo = this.id.execute(amb).value;
        return {value: res.length(),type: Type.NUMBER};*/
        return res;
    }

}

