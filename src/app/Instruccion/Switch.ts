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

    public execute(amb : Environment) {
        const condicion = this.condicion.execute(amb);
        if(!condicion == null)
            throw new Error_(this.line, this.column, 'Semantico', 'La expresion no regresa un temporal: ',amb.getNombre());
        const data = Data.getInstance();
        data.addComentario('SWITCH inicia');
        let labels:Array<any> = new Array();

        for(var [clave, valor] of this.cases.entries()){
            const label=data.newLabel();
            const exp = clave.execute(amb);
            labels.push(label);
            data.addIf(condicion.value,exp.value,'==',label);
        }
        //default
        const label=data.newLabel();
        labels.push(label);
        data.addGoto(label);
        //label de salida y sentencia de escape        
        const lblBreak=data.newLabel();
        data.addGoto(lblBreak);
        amb.break = lblBreak;
        //agregar labels para las instrucciones
        for(var [clave, valor] of this.cases.entries()){
            data.addLabel(labels.shift());
            valor.execute(amb);
        }
        //instrucciones default o label de salida
        data.addLabel(labels.pop());
        if(this.defaul != null){
            const val=this.defaul.execute(amb);
        }
        //label break
        data.addLabel(lblBreak);
        data.addComentario('SWITCH termina');
        return escape;
    }
}
