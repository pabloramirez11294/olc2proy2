import { Instruction } from "../Modelos/Instruction";
import { Environment, Simbolo } from "../Entornos/Environment";
import { Expression } from '../Modelos/Expression';
import { Retorno, Type } from '../Modelos/Retorno';
import { Arreglo } from './Arreglo';
import { Error_ } from "../Reportes/Errores";
import { Data } from "../Data/Data";

export class AccesoAsig extends Instruction{

    constructor(public id: string,private indice : Array<Expression>,public val: Expression,
        line : number, column: number){
       super(line, column);
   }

    public execute(amb: Environment) {
        const sim:Simbolo= amb.getVar(this.id);
        if(sim==null)
            throw new Error_(this.line, this.column, 'Semantico',
                    'Asignacion Arreglo: no existe el arreglo:'+this.id,amb.getNombre());
        const data = Data.getInstance();
        data.addComentario('AsigArreglo Inicia');
        const valor = this.val.execute(amb);  
        const indice = this.indice[0].execute(amb); 
        const pos= data.newTmp(),tm1 = data.newTmp();
        data.addExpression(pos,String(sim.valor+1));
        data.addExpression(tm1,pos,indice.value,'+');
        data.addSetHeap(tm1,valor.value);


        data.addComentario('AsigArreglo Termina');
      /*  const sim:Simbolo= amb.getVar(this.id);
        const arr:Arreglo = sim.valor;
        const val = this.val.execute(amb);
        //TODO ver validaciones de tipo y rango
        let res=arr;
        for(let i=0;i<this.indice.length-1;i++){
            const indi = this.indice[i].execute(amb);
            res=res.getVal(Number(indi.value));
        }
        const indi = this.indice[this.indice.length-1].execute(amb);
        
        //si no se le había asginado un tipoarreglo entonces se le coloca el del valor

        if(sim.tipoArreglo==Type.ARREGLO)
            sim.tipoArreglo=val.type;
        res.arr[Number(indi.value)]=val.value;*/
    }


    /*

    
        if(this.ant!=null){
            const ant=this.ant.execute(amb);
            const dim = ant.type-1;
            if(dim != 0){
                const arr:Arreglo = ant.value;
                const indice = this.indice.execute(amb);            
                const res = arr.getVal(Number(indice.value));
                return {value:res,type:ant.type-1};
            }else{
                const arr:Arreglo = ant.value;
                const indice = this.indice.execute(amb);            
                const res = this.val.execute(amb).value;
                arr.setVal(Number(indice.value),res);
                return;
            }
            
        }
        const sim:Simbolo= amb.getVar(this.id);
        const arr:Arreglo = sim.valor;
        //TODO ver validaciones de tipo y rango
        const indice = this.indice.execute(amb); 
        const res = arr.getVal(Number(indice.value));
        return {value:res,type:sim.dim-1};    









    --------------------------
    const sim:Simbolo= amb.getVar(this.id);
        const arr:Arreglo = sim.valor;
        //TODO ver validaciones de tipo y rango
        let res=arr;
        for(let i=0;i<sim.dim-1;i++){
            const indi = this.indice[i].execute(amb);
            res=arr.getVal(Number(indi.value));
        }
        const indi = this.indice[sim.dim-1].execute(amb);
        const val = this.val.execute(amb);
        res.arr[Number(indi.value)]=val.value;
    */

}