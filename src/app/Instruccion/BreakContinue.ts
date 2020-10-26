import { Data } from '../Data/Data';
import { Instruction } from "../Modelos/Instruction";
import { Return } from './Return';

export enum TipoEscape{
    BREAK=100,
    CONTINUE=101
}
export class Break extends Instruction{

    constructor(line : number, column : number){
        super(line, column);
    }
    
    public execute(){
        const data = Data.getInstance();
        const label = data.newLabel();
        data.addGoto(label);
        return { type : TipoEscape.BREAK , trueLabel: label};
    }
}

export class Continue extends Instruction{

    constructor(line : number, column : number){
        super(line, column);
    }

    public execute() {
        return {line : this.line, column: this.column, type : TipoEscape.CONTINUE};
    }
}