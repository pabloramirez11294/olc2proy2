import {Error_} from '../Reportes/Errores';
import { Expression } from "../Modelos/Expression";
import { Retorno ,Type} from "../Modelos/Retorno";
import { Environment ,Simbolo} from "../Entornos/Environment";
import { Arreglo } from './Arreglo';
import { Instruction } from '../Modelos/Instruction';
import { Data } from '../Data/Data';

export class Length extends Expression{

    constructor(private id: Expression, linea : number, columna: number){
        super(linea,columna);
    }
    public execute(amb:Environment): Retorno{
        //TODO validadciones
        let res:Retorno;
        const sim = this.id.execute(amb);
        const data = Data.getInstance();
        if(sim.type == Type.STRING){
            const tmp = data.newTmp();
            data.addGetHeap(tmp,sim.value);
            res = {value:tmp,esTmp:true,type:Type.NUMBER};
        }else if(sim.type == Type.ARREGLO){
            const tmp = data.newTmp();
            data.addGetHeap(tmp,sim.value);
            res = {value:tmp,esTmp:true,type:Type.NUMBER};
        }

        /*const res:Arreglo = this.id.execute(amb).value;
        return {value: res.length(),type: Type.NUMBER};*/
        return res;
    }

}

export class CharAt extends Expression{

    constructor(private id: Expression,private index: Expression ,linea : number, columna: number){
        super(linea,columna);
    }
    public execute(amb:Environment): Retorno{
        let res:Retorno;
        const sim = this.id.execute(amb);
        if(sim.type != Type.STRING)
            throw new Error_(this.line, this.column, "Semantico", "Error CharAt necesita ser STRING:",amb.getNombre());
        
        const data = Data.getInstance();
        const index = this.index.execute(amb);
        if(index.type != Type.NUMBER)
            throw new Error_(this.line, this.column, "Semantico", "Error CharAt index necesita ser NUMBER:",amb.getNombre());
        

        const tmp = data.newTmp();
        const tmp2 = data.newTmp();
        data.addExpression(tmp,sim.value,index.value,'+');
        data.addExpression(tmp,tmp,'1','+');
        data.addGetHeap(tmp2,tmp);

        data.addSetHeap('h','1');
        const treturn=data.newTmp();
        data.addExpression(treturn,'h');
        data.nextHeap();
        data.addSetHeap('h',tmp2);
        res = {value:treturn,esTmp:true,type:Type.STRING};

        return res;
    }

}

export class ToLowerCase extends Expression{

    constructor(private id: Expression,linea : number, columna: number){
        super(linea,columna);
    }
    public execute(amb:Environment): Retorno{
        let res:Retorno;
        const sim = this.id.execute(amb);
        if(sim.type != Type.STRING)
            throw new Error_(this.line, this.column, "Semantico", "Error ToLowerCase necesita ser STRING:",amb.getNombre());
        
        const data = Data.getInstance();

        const tmp = data.newTmp();
        const tmp2 = data.newTmp();
        
        data.addExpression(tmp,'p',String(amb.size + 1), '+');
        data.addSetStack(tmp,sim.value);
        data.addNextAmb(amb.size);
        data.addCallFunc('native_toLowerCase');
        data.addGetStack(tmp2,'p');
        data.addAntAmb(amb.size);

        res = {value:tmp2,esTmp:true,type:Type.STRING};

        return res;
    }

}

export class ToUpperCase extends Expression{

    constructor(private id: Expression,linea : number, columna: number){
        super(linea,columna);
    }
    public execute(amb:Environment): Retorno{
        let res:Retorno;
        const sim = this.id.execute(amb);
        if(sim.type != Type.STRING)
            throw new Error_(this.line, this.column, "Semantico", "Error ToUpperCase necesita ser STRING:",amb.getNombre());
        const data = Data.getInstance();

        const tmp = data.newTmp();
        const tmp2 = data.newTmp();
        
        data.addExpression(tmp,'p',String(amb.size + 1), '+');
        data.addSetStack(tmp,sim.value);
        data.addNextAmb(amb.size);
        data.addCallFunc('native_toUpperCase');
        data.addGetStack(tmp2,'p');
        data.addAntAmb(amb.size);

        res = {value:tmp2,esTmp:true,type:Type.STRING};

        return res;
    }

}

export class Concat extends Expression{

    constructor(private id: Expression,private string: Expression,linea : number, columna: number){
        super(linea,columna);
    }
    public execute(amb:Environment): Retorno{
        let res:Retorno;
        const sim = this.id.execute(amb);
        const string = this.string.execute(amb);
        if(string.type != Type.STRING || sim.type != Type.STRING)
            throw new Error_(this.line, this.column, "Semantico", "Error Concat necesitan ser STRING:",amb.getNombre());
            
        const data = Data.getInstance();

        const tmp = data.newTmp();
        const tmp2 = data.newTmp();
        
        data.addExpression(tmp,'p',String(amb.size + 1), '+');
        data.addSetStack(tmp,sim.value);
        data.addExpression(tmp,tmp,'1','+');
        data.addExpression(tmp,'p',String(amb.size + 2), '+');
        data.addSetStack(tmp,string.value);
        data.addExpression(tmp,tmp,'1','+');
        data.addNextAmb(amb.size);
        data.addCallFunc('native_concatString');
        data.addGetStack(tmp,'p');
        data.addAntAmb(amb.size);

        res = {value:tmp,esTmp:true,type:Type.STRING};

        return res;
    }

}

