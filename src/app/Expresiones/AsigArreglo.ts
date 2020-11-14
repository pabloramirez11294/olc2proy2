import { Data } from '../Data/Data';
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
        const data = Data.getInstance();
        data.addComentario('AsigArreglo[,,] Inicia');

        if(this.value!=null){
            const size = this.value.length;
            const tmepSize = data.newTmp(),tmp1 = data.newTmp();
            data.addExpression(tmepSize,'h');
            data.addSetHeap('h',size.toString());
            data.addExpression('h','h',size.toString(),'+');
            data.nextHeap();
            data.addExpression(tmp1,tmepSize);
            let v:Retorno;
            this.value.forEach(val => {
                v =val.execute(amb);
                //TODO validar que todos sean del mismo tipo 
                data.addExpression(tmp1,tmp1,'1','+');
                data.addSetHeap(tmp1,v.value);
            });
            data.addComentario('AsigArreglo[,,] Termina');
            return {value:tmepSize,type:v.type,esTmp:false};
        }

        
        return {value:'-1',type:Type.NULL,esTmp:false};
    }
}