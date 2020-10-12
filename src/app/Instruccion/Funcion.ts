import { Instruction } from "../Modelos/Instruction";
import { Instrucciones } from "./Instrucciones";
import { Environment, Simbolo } from "../Entornos/Environment";
import {Type} from "../Modelos/Retorno";
export class Funcion extends Instruction{

    constructor(public id: string, public parametros : Array<Simbolo>, public tipo: Type,
                    public instrucciones: Instrucciones, line : number, column : number){
        super(line, column);
    }

    public execute(environment : Environment) {
        environment.guardarFuncion(this.id, this,this.line,this.column);
    }
}
