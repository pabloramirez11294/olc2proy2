import { Instruction } from "../Modelos/Instruction";
import { Expression } from "../Modelos/Expression";
import { Environment } from "../Entornos/Environment";
import { Retorno, Type } from "../Modelos/Retorno";
import { Data } from "../Data/Data";
import { Error_ } from '../Reportes/Errores';
export class Return extends Instruction{

    constructor(public exp:Expression,line : number, column : number){
        super(line, column);
    }

    public execute(amb : Environment) {
        const value = this.exp?.execute(amb) || {value:undefined,esTmp:false,type:Type.VOID};
        const symFunc = amb.actualFunc;
        const generator = Data.getInstance();
        if (symFunc == null)
            throw new Error_(this.line,this.column,'Semántico','return fuera de una funcion',amb.getNombre());

        if (symFunc.tipo != value.type)
            throw new Error_(this.line,this.column,'Semántico','return devuleve diferente tipo',amb.getNombre());

        

        if (symFunc.tipo !=  Type.VOID)
            generator.addSetStack('p', value.value);

        generator.addGoto(amb.return || '');
    }
}