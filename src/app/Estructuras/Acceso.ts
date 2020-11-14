import { Instruction } from "../Modelos/Instruction";
import { Environment, Simbolo } from "../Entornos/Environment";
import { Expression } from '../Modelos/Expression';
import { Retorno } from '../Modelos/Retorno';
import { Arreglo } from './Arreglo';
import { Error_ } from "../Reportes/Errores";
import { Data } from "../Data/Data";

export class Acceso extends Expression{

    constructor(public id: string,private indice : Expression,private ant:Expression|null,
        line : number, column: number){
       super(line, column);
   }

    public execute(amb: Environment):Retorno {
        if(this.ant==null){
            const sim:Simbolo= amb.getVar(this.id);
            if(sim==null)
                throw new Error_(this.line, this.column, 'Semantico',
                    'Asignacion Arreglo: no existe el arreglo:'+this.id,amb.getNombre());

            const data = Data.getInstance();
            data.addComentario('AccesoArreglo Inicia');
            const indice = this.indice.execute(amb); 
            const pos= data.newTmp(),tm1 = data.newTmp(),tm2 = data.newTmp();
            data.addGetStack(pos,sim.valor);
            data.addExpression(pos,pos,'1','+');
            data.addExpression(tm1,pos,indice.value,'+');
            data.addGetHeap(tm2,tm1);

            data.addComentario('AccesoArreglo Termina');
            return {value:tm2,type:sim.tipoArreglo,esTmp:true};
        }
        
        /* TODO acceso arrglo
        if(this.ant!=null){
            const ant=this.ant.execute(amb);
            const arr:Arreglo = ant.value;
            const indice = this.indice.execute(amb);            
            const res = arr.getVal(Number(indice.value));
            return {value:res,type:arr.tipoArreglo};
        }

        const sim:Simbolo = amb.getVar(this.id);
        const arr:Arreglo=sim.valor;
        //TODO ver validaciones de tipo y rango
        const indice = this.indice.execute(amb); 
        const res = arr.getVal(Number(indice.value));
        return {value:res,type:sim.tipoArreglo};    */
        return null;
    }

}