import { Instruction } from "../Modelos/Instruction";
import { Expression } from "../Modelos/Expression";
import { Environment } from "../Entornos/Environment";
import { txtConsola } from '../Reportes/Consola';
import {Type} from '../Modelos/Retorno';
import { Arreglo } from '../Estructuras/Arreglo';
export class Console extends Instruction{

    constructor(public value : Array<Expression>, line : number, column : number){
        super(line, column);
    }
    public execute(environment : Environment) {
        this.value.forEach(element => {
            const value = element.execute(environment);
            console.log(value);
           /*TODO C3D para arreglos 
           if(value.type==Type.ARREGLO)
                this.setConsolaA(value.value);
            else    */
                this.setConsola(value);
        });
        txtConsola.consolatxt+="\n";
    }

    setConsola(contenido:any){   
        txtConsola.consolatxt+=contenido.value;
    }
    setConsolaA(contenido:Arreglo){   
        txtConsola.consolatxt+=contenido.toString();
    }

    
}