import { Instruction } from "../Modelos/Instruction";
import { Expression } from "../Modelos/Expression";
import { Environment, Simbolo } from "../Entornos/Environment";
import { Type } from "../Modelos/Retorno";
import {Error_} from '../Reportes/Errores';
import {TipoEscape} from "../Instruccion/BreakContinue";
import {Declaracion} from "../Instruccion/Declaracion";
import { Instrucciones } from './Instrucciones';
import { Arreglo } from '../Estructuras/Arreglo';
import { Data } from "../Data/Data";
import { Variable } from "@angular/compiler/src/render3/r3_ast";

export class For extends Instruction{

    constructor(private declaracion:Declaracion,public condicion : Expression,private Actualizacion:Expression, public code : Instrucciones, line : number, column : number){
        super(line, column);
    }

    public execute(amb : Environment) {
        //declaración
        const data = Data.getInstance();
        const lblFor = data.newLabel();
        data.addComentario('For inicia');
        const ambFor:Environment=new Environment(amb,amb.getNombre()+"_for");
        this.declaracion.execute(ambFor);        
        //condición
        data.addLabel(lblFor); 
        let condicion = this.condicion.execute(ambFor);
        if(condicion.type != Type.BOOLEAN){
            throw new Error_(this.line, this.column, 'Semantico', 'La expresion no regresa un valor booleano: ' + condicion.value+", es de tipo: "+condicion.type ,ambFor.getNombre());
        }        
        ambFor.continue = this.condicion.trueLabel;
        ambFor.break = this.condicion.falseLabel;
        data.addLabel(this.condicion.trueLabel);
        this.code.execute(ambFor);
        this.Actualizacion.execute(ambFor);
        data.addGoto(lblFor);
        data.addLabel(condicion.falseLabel);  
        //for
        
        

        data.addComentario('For termina');
    }
    
}

export class ForOf extends Instruction{

    constructor(private declaracion:string,private arr : Expression, private code : Instrucciones, line : number, column : number){
        super(line, column);
    }

    public execute(amb : Environment) {
        const data = Data.getInstance();
        const lblFor = data.newLabel();
        data.addComentario('ForOf inicia');
        const ambFor:Environment=new Environment(amb,amb.getNombre()+"_for");
         
        const vari:Declaracion = new Declaracion(this.declaracion,Type.NUMBER,undefined,false,this.line,this.column);
        vari.execute(ambFor);
        const sim = ambFor.getVar(this.declaracion);
        //arreglo
        const arr = this.arr.execute(amb);
        const tmepSize = data.newTmp();
        const newTemp = data.newTmp();
        const cont=data.newTmp() ,tmp2=data.newTmp(),verdaLabl=data.newLabel(),falseLabl=data.newLabel();
        ambFor.continue = verdaLabl;
        ambFor.break = falseLabl;
        data.addGetHeap(tmepSize,arr.value);
        data.addExpression(newTemp,arr.value,'1','+');
        data.addExpression(cont,'0');


        data.addLabel(lblFor);
        
        data.addIf(cont,tmepSize,'<',verdaLabl);
        data.addGoto(falseLabl);
        data.addLabel(verdaLabl);
        
        
        
        data.addExpression(tmp2,newTemp,cont,'+');
        data.addGetHeap(tmp2,tmp2);
        data.addSetStack(sim.valor,tmp2);
        data.addExpression(cont,cont,'1','+');
        this.code.execute(ambFor);

        data.addGoto(lblFor);
        data.addLabel(falseLabl);
        data.addComentario('ForOf termina');
       
    }
    
}


export class ForIn extends Instruction{

    constructor(private declaracion:string,private arr : Expression, private code : Instrucciones, line : number, column : number){
        super(line, column);
    }

    public execute(amb : Environment) {
        const data = Data.getInstance();
        const lblFor = data.newLabel();
        data.addComentario('ForOf inicia');
        const ambFor:Environment=new Environment(amb,amb.getNombre()+"_for");
         
        const vari:Declaracion = new Declaracion(this.declaracion,Type.NUMBER,undefined,false,this.line,this.column);
        vari.execute(ambFor);
        const sim = ambFor.getVar(this.declaracion);
        //arreglo
        const arr = this.arr.execute(amb);
        const tmepSize = data.newTmp();
        const cont=data.newTmp() ,verdaLabl=data.newLabel(),falseLabl=data.newLabel();
        ambFor.continue = verdaLabl;
        ambFor.break = falseLabl;
        data.addGetHeap(tmepSize,arr.value);
       
        data.addExpression(cont,'0');


        data.addLabel(lblFor);
        
        data.addIf(cont,tmepSize,'<',verdaLabl);
        data.addGoto(falseLabl);
        data.addLabel(verdaLabl);
        
        
        
        
        data.addSetStack(sim.valor,cont);
        data.addExpression(cont,cont,'1','+');
        this.code.execute(ambFor);

        data.addGoto(lblFor);
        data.addLabel(falseLabl);
        data.addComentario('ForOf termina');
       
    }
    
}