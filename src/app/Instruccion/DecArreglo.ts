import { Expression } from "../Modelos/Expression";
import { Instruction } from "../Modelos/Instruction";
import { Environment, Simbolo } from "../Entornos/Environment";
import {Type} from "../Modelos/Retorno";
import {Error_} from '../Reportes/Errores';
export class DecArreglo extends Instruction{
    public tamano=false;
    public constante:boolean=false;
    constructor(public id: string,public tipo:Type,public tipoArreglo:Type,public dim:number ,private exp : Expression,
                            private asignacion:boolean,line : number, column: number){
        super(line, column);
    }

    public execute(amb: Environment) { 
        //amb.guardarArr(this.id, undefined, this.tipo,this.tipoArreglo, this.dim,this.line,this.column,this.constante);
        
   /*     if(valor.type!= 5 && valor.type != this.tipo){
            throw new Error_(this.line, this.column, 'Semantico',
            'DECLARACION: no coincide el tipo con el valor, valor:' + valor.value+", tipo: "+this.tipo ,amb.getNombre());
        }*/
        if(this.exp==undefined){
            amb.guardarArr(this.id, undefined, this.tipo,this.tipoArreglo, this.dim,this.line,this.column,this.constante);
        }else{
            const valor = this.exp.execute(amb);
            amb.guardarArr(this.id, valor.value, this.tipo,this.tipoArreglo, this.dim,this.line,this.column,this.constante);    
        }
       
    }
}
