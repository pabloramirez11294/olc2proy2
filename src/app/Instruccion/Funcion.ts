import { Instruction } from "../Modelos/Instruction";
import { Instrucciones } from "./Instrucciones";
import { Environment, Simbolo } from "../Entornos/Environment";
import {Type} from "../Modelos/Retorno";
import {Error_} from '../Reportes/Errores';
import { Data } from '../Data/Data';
export class Funcion extends Instruction{
    private pasada;
    constructor(public id: string, public parametros : Array<Simbolo>, public tipo: Type,
                    public instrucciones: Instrucciones, line : number, column : number){
        super(line, column);
        this.pasada = true;
    }

    public execute(amb : Environment) {
        //analisis inicial
        if(this.pasada){
            this.pasada = false;
            this.analisisParams(amb);
            let idFunction = this.setIdFunction(amb);
            if(this.id=='nativa_potencia')
                idFunction='nativa_potencia';
            amb.guardarFuncion(idFunction, this,this.line,this.column);
            return;
        }
        //c3d
        const nombreAmbito:string="func_"+this.id;
        const sim = amb.getFuncion(this.id);
        const data = Data.getInstance();
        const nuevoAmb = new Environment(amb,nombreAmbito);
        const returnLbl = data.newLabel();
        const listTmp =new Set( data.getListTmp());

        nuevoAmb.setAmbFuncion(this.id,sim,returnLbl);
        this.parametros.forEach((param)=>{
            nuevoAmb.guardar(param.id,param.tipo,Number(param.linea),Number(param.columna),false);
        });
        data.clearListTmp();
        data.addEncabezadoFunc(sim.idUnico);
        this.instrucciones.executeF(nuevoAmb);
        data.addGoto(returnLbl);
        data.addLabel(returnLbl);
        data.addFinalFunc();
        data.setListTmp(listTmp);
        
    }

    private analisisParams(amb:Environment){
        const set = new Set<string>();
        this.parametros.forEach((param)=>{
            if(set.has(param.id.toLowerCase()))
                throw new Error_(this.line, this.column, 'Semantico', 'Ya existe un parametro con el id: ' + param.id ,amb.getNombre());
            set.add(param.id.toLowerCase());
        });
    }

    private setIdFunction(amb:Environment){
        let id = `${this.tipo}_${this.id}`;
        if(this.parametros.length == 0)
            return id + '_vacio';
        this.parametros.forEach((param)=>{
            id += `_${param.tipo}`;
        });
        return id;
    }
}
