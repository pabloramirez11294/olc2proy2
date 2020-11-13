import { Instruction } from "../Modelos/Instruction";
import { Expression } from "../Modelos/Expression";
import { Environment } from "../Entornos/Environment";
import { Type } from "../Modelos/Retorno";
import {Error_} from '../Reportes/Errores';
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
        if(condicion.type != Type.BOOLEAN)
            throw new Error_(this.line, this.column, 'Semantico', 'DoWhile expresion no regresa un valor boolean: ' + condicion.value+", es de tipo: "+condicion.type ,amb.getNombre());

        //sentencia de escape
        amb.break = this.condicion.falseLabel;
        amb.continue = lblWhile;//fin
        data.addLabel(condicion.trueLabel);
        this.code.execute(amb);
        data.addGoto(lblWhile);
        data.addLabel(condicion.falseLabel);         
        data.addComentario('WHILE termina');
    }
    
}

export class DoWhile extends Instruction{

    constructor(private condicion : Expression, private code : Instruction, line : number, column : number){
        super(line, column);
    }

    public execute(amb : Environment) {
        const data = Data.getInstance();
        data.addComentario('DoWhile inicia');
        amb.continue = this.condicion.trueLabel = data.newLabel();
        amb.break = this.condicion.falseLabel = data.newLabel();
        data.addLabel(this.condicion.trueLabel);
        this.code.execute(amb);
        const condicion = this.condicion.execute(amb);
        if(condicion.type != Type.BOOLEAN)
            throw new Error_(this.line, this.column, 'Semantico', 'DoWhile expresion no regresa un valor boolean: ' + condicion.value+", es de tipo: "+condicion.type ,amb.getNombre());

        data.addLabel(condicion.falseLabel);
        data.addComentario('DoWhile termina');
    }
    
}