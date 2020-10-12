import { Instruction } from "../Modelos/Instruction";

export enum TipoEscape{
    BREAK=100,
    CONTINUE=101
}
export class Break extends Instruction{

    constructor(line : number, column : number){
        super(line, column);
    }

    public execute() {
        return {line : this.line, column: this.column, type : TipoEscape.BREAK};
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