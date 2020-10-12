import { Environment } from "../Entornos/Environment.js";
export class Error_{
    
    constructor(public linea : number, public columna: number, public tipo : string, 
        public descripcion : string, public ambito: string){
            
    }
    public execute() {
        throw new Error_(this.linea , this.columna, this.tipo,this.descripcion,this.ambito);
    }
}

export let errores : Array<Error_> = new Array();

