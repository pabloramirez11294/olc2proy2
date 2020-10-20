import { Expression } from "../Modelos/Expression";
import { Retorno, Type } from "../Modelos/Retorno";
import { Environment } from "../Entornos/Environment";
import {Error_} from '../Reportes/Errores';
import {Data} from "../Data/Data";
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
        const leftValue = this.left.execute(amb);
        const rightValue = this.right?.execute(amb);
        const data = Data.getInstance();        
        const tmp = data.newTmp();
        let result : Retorno;
        
        
        //unitario -
        if(this.right==null && this.type==ArithmeticOption.RESTA){
            if(leftValue.type!=Type.NUMBER)
                throw new Error_(this.line, this.column, "Semantico", "No se puede negar un valor que no sea Number:" + leftValue.value,amb.getNombre());
            data.addExpression(tmp, leftValue,'-1', '*');
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
            if(tipoDominante == Type.STRING){}
                //result = {value : (leftValue.value.toString() + rightValue.value.toString()), type : Type.STRING};
            else if(tipoDominante == Type.NUMBER){
                data.addExpression(tmp, leftValue.value,rightValue.value, '+');
                result = {value : tmp, type : Type.NUMBER, esTmp : true};
            }else
                throw new Error_(this.line, this.column, "Semantico", "Error no se pueden sumar :"+leftValue.type+" y "+ rightValue.type,amb.getNombre());
            
            
        }
        else if(this.type == ArithmeticOption.RESTA){
            if(tipoDominante == Type.STRING)
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede restar: ' + leftValue.type + ' con ' + rightValue.type,amb.getNombre());
            data.addExpression(tmp, leftValue.value,rightValue.value, '-');
            result = {value : tmp, type : Type.NUMBER, esTmp : true};
        }
        else if(this.type == ArithmeticOption.MULT){
            data.addExpression(tmp, leftValue.value,rightValue.value, '*');
            result = {value : tmp, type : Type.NUMBER, esTmp : true};
        }else if(this.type == ArithmeticOption.POTENCIA){
            //result = {value : (leftValue.value ** rightValue.value), type : Type.NUMBER};
        }
        else if(this.type == ArithmeticOption.MODULO){
            //result = {value : (leftValue.value % rightValue.value), type : Type.NUMBER};
        }
        else{
            if(rightValue.value == '0'){
                throw new Error_(this.line, this.column, 'Semantico', 'No se puede dividir entre 0',amb.getNombre());
            }
            data.addExpression(tmp, leftValue.value,rightValue.value, '/');
            result = {value : tmp, type : Type.NUMBER, esTmp : true};
        }
       
        return result;
    }
}