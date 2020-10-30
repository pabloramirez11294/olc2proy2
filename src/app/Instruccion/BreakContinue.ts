import { Data } from '../Data/Data';
import { Environment } from '../Entornos/Environment';
import { Instruction } from "../Modelos/Instruction";
import { Return } from './Return';
import {Error_} from '../Reportes/Errores';

export enum TipoEscape{
    BREAK=100,
    CONTINUE=101
}
export class Break extends Instruction{

    constructor(line : number, column : number){
        super(line, column);
    }
    
    public execute(amb:Environment){
        if(amb.break == null){ 
            throw new Error_(this.line, this.column, 'Semantico', 'Break en un ambito incorrecto' ,amb.getNombre());
        }
        Data.getInstance().addGoto(amb.break);
    }
}

export class Continue extends Instruction{

    constructor(line : number, column : number){
        super(line, column);
    }

    public execute(amb:Environment){
        if(amb.continue == null){ 
            throw new Error_(this.line, this.column, 'Semantico', 'Continue en un ambito incorrecto' ,amb.getNombre());
        }
        Data.getInstance().addGoto(amb.continue);
    }
}