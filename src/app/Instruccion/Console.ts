import { Instruction } from "../Modelos/Instruction";
import { Expression } from "../Modelos/Expression";
import { Environment } from "../Entornos/Environment";
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
        data.addComentario('PRINT inicia');    
        let formato = 'f';
        this.value.forEach(element => {
            const value = element.execute(amb);
            switch(value.type){
                case Type.BOOLEAN:
                    const tmpLbl = data.newLabel();
                    data.addLabel(value.trueLabel);
                    data.addPrintf('d','1');
                    data.addGoto(tmpLbl);
                    data.addLabel(value.falseLabel);
                    data.addPrintf('d','0');
                    data.addLabel(tmpLbl);
                    break;
                case Type.NUMBER:
                    if (!value.esTmp && Number(value.value) % 1 == 0)
                        formato = 'd';
                    data.addPrintf(formato,value.value);
                    break;
                default:
                    throw new Error_(this.line, this.column, "Semantico", "No se puede imprimir un valor de tipo: " + value.type,amb.getNombre());
            }
           /*TODO C3D para arreglos 
           if(value.type==Type.ARREGLO)
                this.setConsolaA(value.value);
            else    */
        });
        data.addComentario('PRINT terminia');  
    }

    
}