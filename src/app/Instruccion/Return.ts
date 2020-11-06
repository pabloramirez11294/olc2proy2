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
        const func = amb.actualFunc;
        const data = Data.getInstance();
        if (func == null)
            throw new Error_(this.line,this.column,'Semántico','return fuera de una funcion',amb.getNombre());

        if (func.tipo != value.type)
            throw new Error_(this.line,this.column,'Semántico','return devuleve diferente tipo',amb.getNombre());

        if(func.tipo == Type.BOOLEAN){
            const templabel = data.newLabel();
            data.addLabel(value.trueLabel);
            data.addSetStack('p', '1');
            data.addGoto(templabel);
            data.addLabel(value.falseLabel);
            data.addSetStack('p', '0');
            data.addLabel(templabel);
        }else if (func.tipo !=  Type.VOID)
            data.addSetStack('p', value.value);

        data.addGoto(amb.return || '');
    }
}