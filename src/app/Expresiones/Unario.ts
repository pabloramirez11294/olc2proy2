import { Expression } from "../Modelos/Expression";
import { Retorno, Type } from "../Modelos/Retorno";
import { Environment } from "../Entornos/Environment";
import {Error_} from '../Reportes/Errores';
export enum OperadorOpcion{
    INCRE,
    DECRE,
    NEGACION    
}

export class Unario extends Expression{
    constructor(private id: string, private type : OperadorOpcion, line: number, column: number){
        super(line,column);
    }
    public execute(amb:Environment):Retorno{   
        const id = amb.getVar(this.id);
        let result : Retorno;
        if(id == null)
            throw new Error_(this.line, this.column, 'Semantico', 'VARIABLE: no existe la variable:\'' + this.id+"'",amb.getNombre());
        
        if(id.tipo != Type.NUMBER)
            throw new Error_(this.line, this.column, "Semantico", "Para una opración unaria se necesita que: \'"+this.id+"' sea Number.",amb.getNombre());

        if(OperadorOpcion.INCRE==this.type){
            //TODO result = {value: id.valor++,type:id.tipo};
        }else if(OperadorOpcion.DECRE==this.type){
            //TODO result = {value: id.valor--,type:id.tipo};
        }

        return result;
    }

}