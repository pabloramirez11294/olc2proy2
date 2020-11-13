import { Expression } from "../Modelos/Expression";
import { Retorno, Type } from "../Modelos/Retorno";
import { Environment } from "../Entornos/Environment";
import {Error_} from '../Reportes/Errores';
import { Data } from "../Data/Data";
import { Variable } from "./Variable";
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
        const data = Data.getInstance(); 
        const variable =  new Variable(this.id,this.line, this.column);
        const sim = variable.execute(amb);
        const tmp = data.newTmp();
        if(sim.type != Type.NUMBER)
            throw new Error_(this.line, this.column, "Semantico", "Para una opración unaria se necesita que: \'"+this.id+"' sea Number.",amb.getNombre());

        if(OperadorOpcion.INCRE==this.type){
            data.addExpression(tmp, sim.value,'1' ,'+');
        }else if(OperadorOpcion.DECRE==this.type){
            data.addExpression(tmp, sim.value,'1' ,'-');
        }
        const id = amb.getVar(this.id);
        data.addSetStack(id.valor,tmp);
        return {value:tmp,esTmp:true,type:sim.type};
    }

}