import { Environment } from '../Entornos/Environment';
import { Arreglo } from '../Estructuras/Arreglo';
import { Return } from '../Instruccion/Return';
import { Expression } from "../Modelos/Expression";
import { Retorno, Type } from "../Modelos/Retorno";

export class AsigArreglo extends Expression{
    
    constructor(public value : Expression[],private type : number, line : number, column: number){
        super(line, column);
    }

    public execute(amb:Environment) : Retorno{
       

        let arr = new Array();
        let tipo:Type=Type.ARREGLO;
        if(this.value!=null){
            this.value.forEach(val => {
                const v =val.execute(amb);
                //TODO validar que todos sean del mismo tipo 
                arr.push(v.value);
                tipo=v.type;
            });
        }

        let arreglo = new Arreglo(tipo,arr);
        //TODO
        //return {value:arreglo,type:tipo};
        return null;
    }
}