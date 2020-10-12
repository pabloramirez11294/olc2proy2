import { Instruction } from "../Modelos/Instruction";
import { Environment, Simbolo } from "../Entornos/Environment";
import { Expression } from '../Modelos/Expression';
import { Retorno } from '../Modelos/Retorno';
import { Arreglo } from './Arreglo';

export class Acceso extends Expression{

    constructor(public id: string,private indice : Expression,private ant:Expression|null,
        line : number, column: number){
       super(line, column);
   }

    public execute(amb: Environment):Retorno {
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
        return {value:res,type:sim.tipoArreglo};    
    }

}