import { Expression } from "../Modelos/Expression";
import { Instruction } from "../Modelos/Instruction";
import { Environment, Simbolo } from "../Entornos/Environment";
import {Type} from "../Modelos/Retorno";
import {Error_} from '../Reportes/Errores';
import { Data } from '../Data/Data';
export class Declaracion extends Instruction{

    public constante:boolean=false;
    constructor(public id: string,public tipo:Type ,public exp : Expression,public asignacion:boolean,
         line : number, column: number){
        super(line, column);
    }

    public execute(amb: Environment) {
        const data = Data.getInstance();
         if(this.exp == undefined){// let a:tipo;
            amb.guardar(this.id,this.tipo ,this.line,this.column,this.constante);
        }else if(this.asignacion && this.tipo==undefined){//a=val;
            const valor = this.exp.execute(amb);                     
            const sim:Simbolo = amb.getVar(this.id);
            if(valor.type != sim.tipo){
                throw new Error_(this.line, this.column, 'Semantico',
                'ASGINACION: no coincide el tipo con el valor, valor:' + valor.value+", tipo: "+this.tipo ,amb.getNombre());
            }
            
            data.addSetStack(sim.valor,valor.value);
            

        }else{//let a:number=val;
            const valor = this.exp.execute(amb);
            if(valor.type != this.tipo){
                throw new Error_(this.line, this.column, 'Semantico',
                'DECLARACION: no coincide el tipo con el valor, valor:' + valor.value+", tipo: "+this.tipo ,amb.getNombre());
            }
            const sim:Simbolo = amb.guardar(this.id, this.tipo,this.line,this.column,this.constante);
            if(amb.esGlobal()){
                data.addSetStack(sim.valor,valor.value);
            }

        }

    }
    public getId():string{
        return this.id;
    }
}
