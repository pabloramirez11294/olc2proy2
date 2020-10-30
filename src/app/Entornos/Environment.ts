
import { Type } from "../Modelos/Retorno";
import {Error_} from '../Reportes/Errores';
import {Funcion} from '../Instruccion/Funcion';
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
export class Environment{
    private funciones : Map<string, Funcion>;
    private variables : Map<string, Simbolo>;
    pos: number;

    constructor(public anterior : Environment | null,private nombre:string){
        this.variables = new Map();  
        this.funciones = new Map();      
        this.nombre = nombre;
        this.pos = 0;
    }

    public getNombre():string{
        return this.nombre;
    }
    public setNombre(nombre:string){
        this.nombre=nombre;
    }

    public guardar(id: string, type: Type,linea:number,columna:number,constante:boolean):Simbolo{
        if(this.variables.has(id))
            throw new Error_(linea, columna, 'Semantico',
            'DECLARACION: ya existe la variable: '+id ,this.getNombre());
        const sim = new Simbolo(this.pos++, id, type,this.getNombre(),linea.toString(),columna.toString(),constante, this.anterior == null);
        this.variables.set(id,sim );
        return sim;
    }
    public guardarArr(id: string, valor: any, type: Type,tipoArreglo:Type,dim:number,linea:number,columna:number,constante:boolean){
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

    public guardarFuncion(id: string, funcion : Funcion,linea:number,columna:number){
        let global:Environment=this.getGlobal();
        if(global.funciones.has(id))
            throw new Error_(linea, columna, 'Semantico',
                'Error: ya existe la funcion: '+id ,this.getNombre());
        this.funciones.set(id, funcion);
    }
    public getFunciones():Map<string, Funcion>{
        return this.funciones;
    }
    public getFuncion(id: string) : Funcion | undefined{
        let env : Environment | null = this;
        while(env != null){
            if(env.funciones.has(id)){
                return env.funciones.get(id);
            }
            env = env.anterior;
        }
        return undefined;
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
    
}