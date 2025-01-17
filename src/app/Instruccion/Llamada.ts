import { Environment, Simbolo } from "../Entornos/Environment";
import { Expression } from "../Modelos/Expression";
import { Error_ } from '../Reportes/Errores';
import { Retorno, Type } from "../Modelos/Retorno";
import { Data } from '../Data/Data';
import { Variable } from "../Expresiones/Variable";

export class Llamada extends Expression{

    constructor(private id: string, private parametros : Array<Expression>, line : number, column : number){
        super(line, column);
    }

    public execute(amb : Environment):Retorno {
        const func = amb.getFuncion(this.id);
        if(func == undefined || func==null)
            throw new Error_(this.line,this.column,'Semántico','No existe la función: '+this.id,amb.getNombre());
        if(this.parametros.length!=func.params.length)
            throw new Error_(this.line,this.column,'Semántico','La función: '+this.id+
                " ,no tiene la misma cantidad de parametros.",amb.getNombre());
        const paramsValues = new Array<Retorno>();
        const data = Data.getInstance();        
        const size = data.apartarTmp(amb);
        this.parametros.forEach((param)=>{
            const valGuardar = param.execute(amb);
            //pasar string por referencia
            if(param instanceof Variable && valGuardar.type == Type.STRING){
                const paraAux:any = param;
                const simVar = amb.getVar(paraAux.id);
                data.addExpression(valGuardar.value,simVar.valor.toString());
            }else if (valGuardar.type == Type.STRING){
                const tmpString = data.newTmp();  
                amb.size++;               
                data.addExpression(tmpString,String( amb.size ));
                data.addSetStack(tmpString,valGuardar.value);
                valGuardar.value=tmpString;
            }else if(valGuardar.type == Type.BOOLEAN){
                let temporBool;
                if(!valGuardar.esTmp)
                    temporBool = data.newTmp();
                else    
                    temporBool = valGuardar.value;
                const tmpLbl = data.newLabel();
                data.addLabel(valGuardar.trueLabel);
                data.addExpression(temporBool,'1');
                data.addLabel(valGuardar.falseLabel);
                data.addGoto(tmpLbl);
                data.addExpression(temporBool,'0');
                data.addLabel(tmpLbl);
                valGuardar.value = temporBool;
            }
            paramsValues.push(valGuardar);
        })
        const auxPtmpReturn = data.newTmp();
        //cambio ambito simulado
        data.addComentario('Inicio cambio de ambito simulado');
        if(paramsValues.length != 0){
            data.addExpression(auxPtmpReturn,'p',String( amb.size + 1),'+'); 
            paramsValues.forEach((value,index)=>{
                data.addSetStack(auxPtmpReturn,value.value);
                if(index != paramsValues.length - 1)
                    data.addExpression(auxPtmpReturn,auxPtmpReturn,'1','+');
            });    
        }
        data.addComentario('Fin cambio de ambito simulado');
        data.addComentario('Inicio cambio de ambito');
        data.addNextAmb(amb.size);
        data.addCallFunc(func.idUnico);
        data.addGetStack(auxPtmpReturn,'p');
        data.addAntAmb(amb.size);
        data.recuperarTmp(amb,size);
        data.addTemp(auxPtmpReturn);
        data.addComentario('Fin cambio de ambito');

        //para booleanos
        if (func.tipo == Type.BOOLEAN){            
            this.trueLabel = this.trueLabel == '' ? data.newLabel() : this.trueLabel;
            this.falseLabel = this.falseLabel == '' ? data.newLabel() : this.falseLabel;
            data.addIf(auxPtmpReturn, '1', '==', this.trueLabel);
            data.addGoto(this.falseLabel);
            return {value:undefined,esTmp:false,type:func.tipo,trueLabel:this.trueLabel,falseLabel:this.falseLabel};
        }
        
        return {value:auxPtmpReturn,esTmp:true,type:func.tipo};    

    }
}