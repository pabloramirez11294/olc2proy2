import { Instruction } from "../Modelos/Instruction";
import { Expression } from "../Modelos/Expression";
import { Environment } from "../Entornos/Environment";
import { Type } from "../Modelos/Retorno";
import {Error_} from '../Reportes/Errores';
import { Data } from '../Data/Data';
export class If extends Instruction{

    constructor(public condicion : Expression, public codeIF : Instruction, public codeElse : Instruction | null,
        line : number, column : number){
        super(line, column);
    }
    //TODO falta instrucicones de escape
    public execute(ent : Environment) {
        const data = Data.getInstance();
        data.addComentario('IF inicia');
        const condicion = this.condicion.execute(ent);
        if(condicion.type != Type.BOOLEAN){
            throw new Error_(this.line, this.column, 'Semantico', 'La expresion no regresa un valor booleano: ' + condicion.value+", es de tipo: "+condicion.type ,ent.getNombre());
        }
        data.addLabel(condicion.trueLabel);
        this.codeIF.execute(ent);        
        if(this.codeElse != null){
            const tempLbl = data.newLabel();
            data.addGoto(tempLbl);
            data.addLabel(condicion.falseLabel);
            this.codeElse.execute(ent);            
            data.addLabel(tempLbl);
        }else{
            data.addLabel(condicion.falseLabel);
        }        
        data.addComentario('IF termina');
        return escape;
    }
}
