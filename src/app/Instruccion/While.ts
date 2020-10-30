import { Instruction } from "../Modelos/Instruction";
import { Expression } from "../Modelos/Expression";
import { Environment } from "../Entornos/Environment";
import { Type } from "../Modelos/Retorno";
import {Error_} from '../Reportes/Errores';
import {TipoEscape} from "../Instruccion/BreakContinue";
import { Data } from '../Data/Data';

export class While extends Instruction{

    constructor(public condicion : Expression, public code : Instruction, line : number, column : number){
        super(line, column);
    }

    public execute(amb : Environment) {        
        const data = Data.getInstance();
        const lblWhile = data.newLabel();
        data.addComentario('WHILE inicia');
        data.addLabel(lblWhile);        
        let condicion = this.condicion.execute(amb);
        if(condicion.type == Type.BOOLEAN){
            //sentencia d escape
            amb.break = this.condicion.falseLabel;
            amb.continue = lblWhile;//fin
            data.addLabel(condicion.trueLabel);
            this.code.execute(amb);
            data.addGoto(lblWhile);
            data.addLabel(condicion.falseLabel);         
            data.addComentario('WHILE termina');
            return escape;
        }
        throw new Error_(this.line, this.column, 'Semantico', 'La expresion no regresa un valor booleano: ' + condicion.value+", es de tipo: "+condicion.type ,amb.getNombre());
    }
    
}

export class DoWhile extends Instruction{

    constructor(private condicion : Expression, private code : Instruction, line : number, column : number){
        super(line, column);
    }

    public execute(amb : Environment) {
        let condicion;
        do{
            const code = this.code.execute(amb);
            if(code != null || code != undefined){
                if(code.type == TipoEscape.BREAK)
                    break;
                else if(code.type == TipoEscape.CONTINUE)
                    continue;
                else
                    return code;
            }
            condicion = this.condicion.execute(amb);
            if(condicion.type != Type.BOOLEAN){
                throw new Error_(this.line, this.column, 'Semantico', 'La expresion no regresa un valor booleano: ' + condicion.value+", es de tipo: "+condicion.type ,amb.getNombre());
            }
        }while(condicion.value);

    }
    
}