
import { Type } from "../Modelos/Retorno";
import {Error_} from '../Reportes/Errores';
import {Funcion} from '../Instruccion/Funcion';
import { Recoverable } from "repl";
export class Simbolo{
    public tipoArreglo:Type;
    public dim:number;
    public valor :number;
    public id : string;
    public tipo : Type;
    public constante:boolean;
    global: boolean;
    constructor(valor: number, id: string, tipo: Type,public ambito:string,public linea:string,public columna:string,
                                                                                constante:boolean,global:boolean){
        this.valor = valor;
        this.id = id;
        this.tipo = tipo;
        this.constante = constante;
        this.global = global;
    }
}
export class SimboloFunc{
    tipo: Type;
    id: string;
    size: number;
    params: Array<Parametro>;

    constructor(public func: Funcion,public idUnico: string) {
        this.tipo = func.tipo;
        this.id = func.id;
        this.size = func.parametros.length;
        this.params = func.parametros;
    }
}

export class Parametro {
    constructor(public id: string,public tipo: Type) {
        this.id = id.toLowerCase();
    }

    
}
export class Environment{
    private funciones : Map<string, SimboloFunc>;
    private variables : Map<string, Simbolo>;
    size: number;
    //sentencias de escape
    break: string | null;
    continue: string | null;
    return: string | null;

    constructor(public anterior : Environment | null,private nombre:string){
        this.variables = new Map();  
        this.funciones = new Map();      
        this.nombre = nombre;
        this.size = anterior?.size || 0
        //escape
        this.break = anterior?.break || null;
        this.return = anterior?.return || null;
        this.continue = anterior?.continue || null;
        this.actualFunc = anterior?.actualFunc || null;
    }

    public getNombre():string{
        return this.nombre;
    }
    public setNombre(nombre:string){
        this.nombre=nombre.toLowerCase();
    }

    public guardar(id: string, type: Type,linea:number,columna:number,constante:boolean):Simbolo{
        id = id.toLowerCase();
        if(this.variables.has(id))
            throw new Error_(linea, columna, 'Semantico',
            'DECLARACION: ya existe la variable: '+id ,this.getNombre());
        const sim = new Simbolo(this.size++, id, type,this.getNombre(),linea.toString(),columna.toString(),constante, this.anterior == null);
        this.variables.set(id,sim );
        return sim;
    }
    public guardarArr(id: string, valor: any, type: Type,tipoArreglo:Type,dim:number,linea:number,columna:number,constante:boolean){
        id = id.toLowerCase();
        if(this.variables.has(id))
            throw new Error_(linea, columna, 'Semantico',
            'DECLARACION: ya existe la variable: '+id ,this.getNombre());
        
        //let sim:Simbolo=new Simbolo(valor, id, type,this.getNombre(),linea.toString(),columna.toString(),constante);
  // sim.tipoArreglo=tipoArreglo;
    //    sim.dim=dim;
       // this.variables.set(id,sim);
    }
    
    //para el tipo       nombVar = exp;
    public asignar(id: string, valor: any,type: Type,linea:number,columna:number){
        id = id.toLowerCase();
        const sim:Simbolo = this.getVar(id); 
        if(sim==null)
            throw new Error_(linea, columna, 'Semantico','ASIGNACIÓN: no existe la variable:' + id,this.getNombre());
        if(sim.constante)
            throw new Error_(linea, columna, 'Semantico','ASIGNACIÓN: es una constante: ' + id,this.getNombre());
        
        
        if(sim.tipo==undefined){
            sim.tipo=type;
        }
        if(type!= sim.tipo && sim.tipo!=Type.NULL && (type!=Type.ARREGLO && sim.tipo!= Type.ARREGLO))
            throw new Error_(linea, columna,  'Semantico',
                'ASIGNACIÓN: no coincide el tipo con el valor asginado, Tipovalor:' + type+", tipo: "+sim.tipo ,this.getNombre());        
        sim.valor=valor;
        this.variables.set(id,sim);
    }
    
    public getVar(id: string) : Simbolo | undefined | null{
        id = id.toLowerCase();
        let env : Environment | null = this;
        while(env != null){
            if(env.variables.has(id)){
                return env.variables.get(id);
            }
            env = env.anterior;
        }
        return null;
    }   

    public getTablaSimbolos():Map<string, Simbolo>{
        return this.variables;
    }

    
    public getGlobal() : Environment{
        let env : Environment | null = this;
        while(env?.anterior != null){
            env = env.anterior;
        }
        return env;
    }

    public esGlobal() : Boolean{
        return this.anterior==null;
    }
    //FUNCIONES
    public guardarFuncion(idUnico: string, funcion : Funcion,linea:number,columna:number){
        const aux = this.getGlobal().funciones;
        if(aux.has(funcion.id.toLowerCase()))
            throw new Error_(linea, columna, 'Semantico',
                'Error: ya existe la funcion: '+funcion.id.toLowerCase() ,this.getNombre());
        this.funciones.set(funcion.id.toLowerCase(), new SimboloFunc(funcion,idUnico));
    }
    public getFunciones():Map<string, SimboloFunc>{
        return this.funciones;
    }
    public getFuncion(id: string) : SimboloFunc | undefined{
        id = id.toLowerCase();
        let env : Environment | null = this;
        while(env != null){
            if(env.funciones.has(id)){
                return env.funciones.get(id);
            }
            env = env.anterior;
        }
        return undefined;
    }
    idFuncion : string;
    actualFunc: SimboloFunc | null;
    setAmbFuncion(idFuncion: string, actualFunc : SimboloFunc, retorno : string){
        this.size = 1; 
        this.idFuncion = idFuncion;
        this.return = retorno;
        this.actualFunc = actualFunc;
    }
    
}