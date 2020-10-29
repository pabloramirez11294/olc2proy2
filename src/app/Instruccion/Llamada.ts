import { Instruction } from "../Modelos/Instruction";
import { Environment, Simbolo } from "../Entornos/Environment";
import { Expression } from "../Modelos/Expression";
import { Error_ } from '../Reportes/Errores';
import { Retorno, Type } from "../Modelos/Retorno";
export class Llamada extends Instruction{

    constructor(private id: string, private parametros : Array<Expression>, line : number, column : number){
        super(line, column);
    }

    public execute(amb : Environment):Retorno {
        const nombreAmbito:string="func_"+this.id;
        const func = amb.getFuncion(this.id);
        if(func == undefined || func==null)
            throw new Error_(this.line,this.column,'Semántico','No existe la función: '+this.id,amb.getNombre());
        if(this.parametros.length!=func.parametros.length)
            throw new Error_(this.line,this.column,'Semántico','La función: '+this.id+
                    " ,no tiene la misma cantidad de parametros.",amb.getNombre());
        const nuevoAmb = new Environment(amb.getGlobal(),nombreAmbito);
        for(let i=0;i<func.parametros.length;i++){
            const sim:Simbolo=func.parametros[i];
            const param:Expression=this.parametros[i];
            const valor=param.execute(amb);
            /*
            if(sim.tipo!=valor.type)
                throw new Error_(this.line,this.column,'Semántico','Error los tipos no coinciden del parametro: '+sim.id,nombreAmbito);
            //TODO hacer mas validaciones, cambia al tipo del valor
            if(valor.type==Type.ARREGLO){ 
                sim.valor=valor;
                nuevoAmb.guardarArr(sim.id, sim.valor.value, sim.tipo,sim.tipoArreglo,sim.dim,this.line,this.column,false);
            }else{                  
                sim.valor=valor;
                nuevoAmb.guardar(sim.id, sim.valor.value, sim.tipo,this.line,this.column,false);
            }*/
        }
        //retornar
        const resultado=func.instrucciones.execute(nuevoAmb);
        if(func.tipo!=Type.VOID && (resultado==null || resultado==undefined))
            throw new Error_(this.line,this.column,'Semántico','Error la función: '+func.id+" no retorna nada.",nombreAmbito);
        if(resultado?.type==Type.NULL){
            return;
        }
        return resultado;
    }
}