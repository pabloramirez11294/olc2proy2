import { Instruction } from "../Modelos/Instruction";
import { Expression } from "../Modelos/Expression";
import { Environment } from "../Entornos/Environment";
import { Type } from "../Modelos/Retorno";
import {Error_} from '../Reportes/Errores';
import { Instrucciones } from './Instrucciones';
import {TipoEscape,Break} from './BreakContinue';
import { Data } from '../Data/Data';
import { strict } from 'assert';

export class Switch extends Instruction{

    constructor(public condicion : Expression, private cases :Map<Expression,Instrucciones>, public defaul : Instrucciones | null,
        line : number, column : number){
        super(line, column);
    }

    public execute(ent : Environment) {
        const condicion = this.condicion.execute(ent);
        if(!condicion == null)
            throw new Error_(this.line, this.column, 'Semantico', 'La expresion no regresa un temporal: ',ent.getNombre());
        const data = Data.getInstance();
        data.addComentario('SWITCH inicia');
        let labels:Array<any> = new Array();

        for(var [clave, valor] of this.cases.entries()){
            const label=data.newLabel();
            const exp = clave.execute(ent);
            labels.push(label);
            data.addIf(condicion.value,exp.value,'==',label);
        }
        //default o salida
        const label=data.newLabel();
        labels.push(label);
        data.addGoto(label);
        //break
        let lbBreak:Array<string> = new Array();
        //agregar labels para las instrucciones
        labels.reverse();
        for(var [clave, valor] of this.cases.entries()){
            data.addLabel(labels.pop());
            const val = valor.execute(ent);
            //TODO verificar que venga return,break
            if(val!=undefined && val.type==TipoEscape.BREAK)
                lbBreak.push(val.trueLabel);
        }
        if(this.defaul != null){
            data.addLabel(labels.pop());
            const val=this.defaul.execute(ent);
            if(val!=undefined)
                    return val;
        }else
            data.addLabel(labels.pop());
        //label del break
        lbBreak.forEach(element => {
            data.addLabel(element);
        });

    }
}
