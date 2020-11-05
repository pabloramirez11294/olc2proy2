import { Expression } from "../Modelos/Expression";
import { Instruction } from "../Modelos/Instruction";
import { Environment, Simbolo } from "../Entornos/Environment";
import {Type} from "../Modelos/Retorno";
import {Error_} from '../Reportes/Errores';
import { Data } from '../Data/Data';
export class Declaracion extends Instruction{

    public constante:boolean=false;
    constructor(public id: string,public tipo:Type ,public exp : Expression,public asignacion:boolean,
         line : number, column: number){
        super(line, column);
    }

    public execute(amb: Environment) {
        const data = Data.getInstance();
         if(this.exp == undefined){// let a:tipo;
            let defecto;
            if(this.tipo == Type.NUMBER || this.tipo == Type.BOOLEAN)
                defecto = '0';
            else{
                //TODO falta dar valor por defecto para string,array
            }

            const sim:Simbolo = amb.guardar(this.id,this.tipo ,this.line,this.column,this.constante);
            data.addSetStack(sim.valor,defecto);
        }else if(this.asignacion && this.tipo==undefined){//a=val;
            const valor = this.exp.execute(amb);                     
            const sim:Simbolo = amb.getVar(this.id);
            if(valor.type != sim.tipo){
                throw new Error_(this.line, this.column, 'Semantico',
                'ASGINACION: no coincide el tipo con el valor, valor:' + valor.value+", tipo: "+this.tipo ,amb.getNombre());
            }
            if(amb.esGlobal()){
                if(valor.type == Type.BOOLEAN){
                    const templabel = data.newLabel();
                    data.addLabel(valor.trueLabel);
                    data.addSetStack(sim.valor,'1');
                    data.addGoto(templabel);
                    data.addLabel(valor.falseLabel);
                    data.addSetStack(sim.valor,'0');
                    data.addLabel(templabel);
                }else        
                    data.addSetStack(sim.valor,valor.value);
            }else{
                const temp = data.newTmp(); 
                //data.freeTemp(temp);
                data.addExpression(temp,'p',sim.valor.toString(),'+');
                if(valor.type == Type.BOOLEAN){
                    const templabel = data.newLabel();
                    data.addLabel(valor.trueLabel);
                    data.addSetStack(sim.valor,'1');
                    data.addGoto(templabel);
                    data.addLabel(valor.falseLabel);
                    data.addSetStack(sim.valor,'0');
                    data.addLabel(templabel);
                }else        
                    data.addSetStack(sim.valor,valor.value);
            }
            

        }else{//let a:number=val;
            const valor = this.exp.execute(amb);
            if(valor.type != this.tipo){
                throw new Error_(this.line, this.column, 'Semantico',
                'DECLARACION: no coincide el tipo con el valor, valor:' + valor.value+", tipo: "+this.tipo ,amb.getNombre());
            }
            const sim:Simbolo = amb.guardar(this.id, this.tipo,this.line,this.column,this.constante);
            if(amb.esGlobal()){
                if(this.tipo == Type.BOOLEAN){
                    const templabel = data.newLabel();
                    data.addLabel(valor.trueLabel);
                    data.addSetStack(sim.valor,'1');
                    data.addGoto(templabel);
                    data.addLabel(valor.falseLabel);
                    data.addSetStack(sim.valor,'0');
                    data.addLabel(templabel);
                }else
                    data.addSetStack(sim.valor,valor.value);
            }else{
                const temp = data.newTmp(); 
                //data.freeTemp(temp);
                data.addExpression(temp,'p',sim.valor.toString(),'+');
                if(valor.type == Type.BOOLEAN){
                    const templabel = data.newLabel();
                    data.addLabel(valor.trueLabel);
                    data.addSetStack(sim.valor,'1');
                    data.addGoto(templabel);
                    data.addLabel(valor.falseLabel);
                    data.addSetStack(sim.valor,'0');
                    data.addLabel(templabel);
                }else        
                    data.addSetStack(temp,valor.value);
            }

        }

    }
    public getId():string{
        return this.id;
    }
}
