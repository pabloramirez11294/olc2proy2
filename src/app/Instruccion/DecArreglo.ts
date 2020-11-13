import { Expression } from "../Modelos/Expression";
import { Instruction } from "../Modelos/Instruction";
import { Environment, Simbolo } from "../Entornos/Environment";
import {Type} from "../Modelos/Retorno";
import {Error_} from '../Reportes/Errores';
import { Data } from "../Data/Data";
export class DecArreglo extends Instruction{
    public tamano=false;
    public constante:boolean=false;
    constructor(public id: string,public tipo:Type,public tipoArreglo:Type,public dim:number ,private exp : Expression,
                            private asignacion:boolean,line : number, column: number){
        super(line, column);
    }

    public execute(amb: Environment) { 
        const data = Data.getInstance();
        data.addComentario('DecArreglo Inicia');
        const sim:Simbolo = amb.guardar(this.id, this.tipo,this.line,this.column,this.constante);

        if(this.exp==undefined){
           // amb.guardarArr(this.id, undefined, this.tipo,this.tipoArreglo, this.dim,this.line,this.column,this.constante);
        }else if(this.tamano){
             //newarrya
            const size = this.exp.execute(amb);
            if(size.type != Type.NUMBER){
                throw new Error_(this.line, this.column, 'Semantico',
                    'DECLARACION Arreglo: tiene que ser Number el new Array',amb.getNombre());
            }
            const tmepSize = data.newTmp();
            data.addExpression(tmepSize,'h');
            data.addSetHeap('h',size.value);
            data.addExpression('h','h',size.value,'+');
            data.nextHeap();
            //declaracion
            if(this.tipoArreglo==Type.NUMBER || this.tipoArreglo==Type.STRING){           
                const newTemp = data.newTmp();
                const label=data.newLabel() ,label2=data.newLabel();
                data.addExpression(newTemp,tmepSize,'1','+')
                data.addLabel(label)
                data.addIf(newTemp,'h','==',label2);
                if(this.dim>0){
                    if(this.tipoArreglo ==Type.NUMBER){
                        data.addSetHeap(newTemp,'0');
                    }else if(this.tipoArreglo == Type.STRING){
                        data.addSetHeap(newTemp,'-1');
                    }
                }else{
                    data.addSetHeap(newTemp,'-1');
                }
                data.addExpression(newTemp,newTemp,'1','+');
                data.addGoto(label);
                data.addLabel(label2);
                data.addSetStack(sim.valor,tmepSize);
                sim.tipoArreglo=this.tipoArreglo;
                sim.dim=this.dim;
            }

        }else{
            const valor = this.exp.execute(amb);
            //declaracion
            if(this.tipoArreglo==Type.NUMBER || this.tipoArreglo==Type.STRING){           
                
                data.addSetStack(sim.valor,valor.value);
                sim.tipoArreglo=this.tipoArreglo;
                sim.dim=this.dim;
            }
        }
        data.addComentario('DecArreglo Termina');
    }
}
