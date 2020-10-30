import {Error_} from '../Reportes/Errores';
import { Expression } from "../Modelos/Expression";
import { Retorno ,Type} from "../Modelos/Retorno";
import { Environment } from "../Entornos/Environment";
import { Data } from '../Data/Data';

export class Variable extends Expression{

    constructor(private id: string, linea : number, columna: number){
        super(linea,columna);
    }
    public execute(amb:Environment): Retorno{
        const data = Data.getInstance();
        const sim = amb.getVar(this.id);
        if(sim == null)
            throw new Error_(this.line, this.column, 'Semantico', 'VARIABLE: no existe la variable:' + this.id,amb.getNombre());
        if(sim.tipo!=Type.NULL && sim.valor == undefined)
            throw new Error_(this.line, this.column, 'Semantico', 'VARIABLE: no tiene valor asignado:' + this.id,amb.getNombre());
        //TODO 
        const temp = data.newTmp();
        if (sim.global) {
            data.addGetStack(temp, sim.valor);
        }
        return {value: temp,type: sim.tipo,esTmp:true};
    }

}