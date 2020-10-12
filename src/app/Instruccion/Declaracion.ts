import { Expression } from "../Modelos/Expression";
import { Instruction } from "../Modelos/Instruction";
import { Environment, Simbolo } from "../Entornos/Environment";
import {Type} from "../Modelos/Retorno";
import {Error_} from '../Reportes/Errores';
export class Declaracion extends Instruction{

    public constante:boolean=false;
    constructor(public id: string,public tipo:Type ,public exp : Expression,public asignacion:boolean,
         line : number, column: number){
        super(line, column);
    }

    public execute(amb: Environment) {

        if(this.exp == undefined && this.tipo==undefined){//let a;
            amb.guardar(this.id,undefined,undefined ,this.line,this.column,this.constante);
        }else if(!this.asignacion && this.exp != undefined && this.tipo==undefined){// let a=val;
            const valor = this.exp.execute(amb);
            amb.guardar(this.id, valor.value, valor.type,this.line,this.column,this.constante);
        }else if(this.exp == undefined){// let a:tipo;
            amb.guardar(this.id,undefined,this.tipo ,this.line,this.column,this.constante);
        }else if(this.asignacion && this.tipo==undefined){//a=val;
            const valor = this.exp.execute(amb);                         
            amb.asignar(this.id ,valor.value,valor.type,this.line,this.column);
        }else{//let a:number=val;
            const valor = this.exp.execute(amb);
            if(valor.type != this.tipo){
                throw new Error_(this.line, this.column, 'Semantico',
                'DECLARACION: no coincide el tipo con el valor, valor:' + valor.value+", tipo: "+this.tipo ,amb.getNombre());
            }
            amb.guardar(this.id, valor.value, this.tipo,this.line,this.column,this.constante);
        }

    }
    public getId():string{
        return this.id;
    }
}
