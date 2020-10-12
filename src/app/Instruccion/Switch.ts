import { Instruction } from "../Modelos/Instruction";
import { Expression } from "../Modelos/Expression";
import { Environment } from "../Entornos/Environment";
import { Type } from "../Modelos/Retorno";
import {Error_} from '../Reportes/Errores';
import { Instrucciones } from './Instrucciones';
import {TipoEscape,Break} from './BreakContinue';

export class Switch extends Instruction{

    constructor(public condicion : Expression, private cases :Map<Expression,Instrucciones>, public defaul : Instrucciones | null,
        line : number, column : number){
        super(line, column);
    }

    public execute(ent : Environment) {
        const condicion = this.condicion.execute(ent);
        let noBreak:boolean=false;
        let defau:boolean=true;
        for(var [clave, valor] of this.cases.entries()){
            const con = clave.execute(ent);
            if(condicion.type!=con.type)
                throw new Error_(this.line, this.column, "Semantico", "Error en switch los valores deben de ser del mismo tipo.",ent.getNombre());
            if(condicion.value==con.value || noBreak){   
                defau=false;             
                const val=valor.execute(ent);
                if(val!=undefined && val.type==TipoEscape.BREAK){
                    defau=false;
                    break;
                }else if(val!=undefined)
                    return val;
                else{
                    noBreak=true;
                    defau=true;
                }
            }
        }
        if(defau){
            const val=this.defaul.execute(ent);
            if(val!=undefined)
                    return val;
        }
      //  console.log(this.cases);
        
    }
}
