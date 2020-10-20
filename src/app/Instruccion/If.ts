import { Instruction } from "../Modelos/Instruction";
import { Expression } from "../Modelos/Expression";
import { Environment } from "../Entornos/Environment";
import { Type } from "../Modelos/Retorno";
import {Error_} from '../Reportes/Errores';
export class If extends Instruction{

    constructor(public condicion : Expression, public codeIF : Instruction, public codeElse : Instruction | null,
        line : number, column : number){
        super(line, column);
    }

    public execute(ent : Environment) {
        const condicion = this.condicion.execute(ent);
        if(condicion.type != Type.BOOLEAN){
            throw new Error_(this.line, this.column, 'Semantico', 'La expresion no regresa un valor booleano: ' + condicion.value+", es de tipo: "+condicion.type ,ent.getNombre());
        }
        /*TODO c3d if
        if(condicion.value == true){
            return this.codeIF.execute(ent);
        }else{
            return this.codeElse?.execute(ent);
        }*/
    }
}
