import { Expression } from "../Modelos/Expression";
import { Retorno, Type } from "../Modelos/Retorno";
import { Environment } from "../Entornos/Environment";
import {Error_} from '../Reportes/Errores';
import {Data} from "../Data/Data";
import { readFile } from "fs";
export enum ArithmeticOption{
    SUMA,
    RESTA,
    MULT,
    DIV,
    POTENCIA,
    MODULO,
}

export class Aritmetico extends Expression{

    constructor(public left: Expression, public right: Expression, public type : ArithmeticOption, line: number, column: number){
        super(line,column);
    }

    public execute(amb : Environment) : Retorno{        
        const data = Data.getInstance(); 
        const leftValue = this.left.execute(amb);
        //agregar label
        if(leftValue.type==Type.BOOLEAN){
            if(leftValue.esTmp){
                data.addLabel(leftValue.trueLabel);
                data.addLabel(leftValue.falseLabel);
            }else if(leftValue.value=='1') 
                data.addLabel(leftValue.trueLabel);
            else
                data.addLabel(leftValue.falseLabel);
        }
        const rightValue = this.right?.execute(amb); 
        //agregar label
        if(rightValue?.type==Type.BOOLEAN){
            if(rightValue.esTmp){
                data.addLabel(rightValue.trueLabel);
                data.addLabel(rightValue.falseLabel);
            }else if(rightValue.value=='1') 
                data.addLabel(rightValue.trueLabel);
            else
                data.addLabel(rightValue.falseLabel);
        }
        
        const tmp = data.newTmp();
        let result : Retorno;
        
        
        //unitario -
        if(this.right==null && this.type==ArithmeticOption.RESTA){
            if(leftValue.type!=Type.NUMBER)
                throw new Error_(this.line, this.column, "Semantico", "No se puede negar un valor que no sea Number:" + leftValue.value,amb.getNombre());
            data.addExpression(tmp, '0' ,leftValue.value, '-');
            result = {value : tmp, type : Type.NUMBER, esTmp : true};
            return result;
        }
        let tipoDominante;
        /*TODO
        if((leftValue.type==Type.ARREGLO && rightValue.type==Type.ARREGLO)
            ||(leftValue.type==Type.NUMBER && rightValue.type==Type.ARREGLO)
            ||(leftValue.type==Type.ARREGLO && rightValue.type==Type.NUMBER)){
            tipoDominante=Type.NUMBER;
        }else*/
            tipoDominante = this.tipoDominante(leftValue.type, rightValue.type,amb.getNombre());
        if(this.type == ArithmeticOption.SUMA){
            if(tipoDominante == Type.STRING){
                if(leftValue.type==Type.STRING && rightValue.type==Type.NUMBER){
                    data.addExpression(tmp,'p',String(amb.size + 1), '+');
                    data.addSetStack(tmp,leftValue.value);
                    data.addExpression(tmp,tmp,'1','+');
                    data.addSetStack(tmp,rightValue.value);
                    data.addNextAmb(amb.size);
                    data.addCallFunc('native_concatStringNumber');
                    data.addGetStack(tmp,'p');
                    data.addAntAmb(amb.size);
                }
                
                result = {value : tmp, type : Type.STRING, esTmp : true};
            }else if(tipoDominante == Type.NUMBER ){               
                data.addExpression(tmp, leftValue.value,rightValue.value, '+');
                result = {value : tmp, type : Type.NUMBER, esTmp : true};
            }else
                throw new Error_(this.line, this.column, "Semantico", "Error no se pueden sumar :"+leftValue.type+" y "+ rightValue.type,amb.getNombre());
            
            
        }
        else if(this.type == ArithmeticOption.RESTA){
            if(tipoDominante == Type.STRING || tipoDominante == Type.BOOLEAN)
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede restar: ' + leftValue.type + ' con ' + rightValue.type,amb.getNombre());
            data.addExpression(tmp, leftValue.value,rightValue.value, '-');
            result = {value : tmp, type : Type.NUMBER, esTmp : true};
        }
        else if(this.type == ArithmeticOption.MULT){
            if(tipoDominante == Type.STRING || tipoDominante == Type.BOOLEAN)
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede multiplicar: ' + leftValue.type + ' con ' + rightValue.type,amb.getNombre());
            data.addExpression(tmp, leftValue.value,rightValue.value, '*');
            result = {value : tmp, type : Type.NUMBER, esTmp : true};
        }else if(this.type == ArithmeticOption.POTENCIA){
            //result = {value : (leftValue.value ** rightValue.value), type : Type.NUMBER};
        }
        else if(this.type == ArithmeticOption.MODULO){
            if(tipoDominante == Type.STRING || tipoDominante == Type.BOOLEAN)
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede hacer el modulo de: ' + leftValue.type + ' con ' + rightValue.type,amb.getNombre());
            data.addModulo(tmp, leftValue.value,rightValue.value);
            result = {value : tmp, type : Type.NUMBER,esTmp:true};
        }
        else{
            if(rightValue.value == '0'){
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede dividir entre 0',amb.getNombre());
            }
            if(tipoDominante == Type.STRING || tipoDominante == Type.BOOLEAN)
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede dividir: ' + leftValue.type + ' con ' + rightValue.type,amb.getNombre());
            
            data.addExpression(tmp, leftValue.value,rightValue.value, '/');
            result = {value : tmp, type : Type.NUMBER, esTmp : true};
        }
       
        return result;
    }
}