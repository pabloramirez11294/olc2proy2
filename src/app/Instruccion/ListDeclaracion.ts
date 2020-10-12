import { Instruction } from "../Modelos/Instruction";
import { Environment } from "../Entornos/Environment";
import {Declaracion} from './Declaracion';
export class ListDeclaracion extends Instruction{


    constructor(public lista: Array<Declaracion>, line : number, column: number){
        super(line, column);
    }

    public execute(amb: Environment) {
        this.lista.forEach(element => {
            element.execute(amb);
        });
    }


}