import { Instruction } from "../Modelos/Instruction";
import { Expression } from "../Modelos/Expression";
import { Environment } from "../Entornos/Environment";
import { txtConsola } from '../Reportes/Consola';
import {Type} from '../Modelos/Retorno';
import {Error_} from '../Reportes/Errores';
import { Arreglo } from '../Estructuras/Arreglo';
import { Data } from '../Data/Data';
export class Console extends Instruction{

    constructor(public value : Array<Expression>, line : number, column : number){
        super(line, column);
    }
    public execute(amb : Environment) {
        const data = Data.getInstance();        
        let formato = 'f';
        this.value.forEach(element => {
            const value = element.execute(amb);
            switch(value.type){
                case Type.NUMBER:
                    if (!value.esTmp && Number(value.value) % 1 == 0)
                        formato = 'd';
                    data.addPrintf(formato,value.value);
                    break;
                case Type.BOOLEAN:
                    formato = 'd';
                    const tmp = data.newLabel();
                    data.addLabel(value.trueLabel);
                    data.addPrintf(formato,"1");
                    data.addGoto(tmp);
                    data.addLabel(value.falseLabel);
                    data.addPrintf(formato,"0");
                    data.addLabel(tmp);
                    break;
                default: 
                    throw new Error_(this.line, this.column, "Semantico", "No se puede imprimir un valor de tipo: " + value.type,amb.getNombre());
            }
           /*TODO C3D para arreglos 
           if(value.type==Type.ARREGLO)
                this.setConsolaA(value.value);
            else    */
        });
        txtConsola.consolatxt+="\n";
    }

    
}