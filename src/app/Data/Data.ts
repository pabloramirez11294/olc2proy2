export class  Data{
    private static instance: Data;
    private temporal : number;    
    private tempStorage : Set<string>;
    private label : number;
    private code : string[];
    tabulador:string = '';

    private constructor(){
        this.temporal = this.label = 0;
        this.code = new Array();
        this.tempStorage = new Set();
    }
    public static getInstance():Data{
        return this.instance || (this.instance = new this());
    }
    public newTmp() : string{
        const tmp = 'T' + this.temporal++;
        this.tempStorage.add(tmp);
        return tmp;
    }

    //Expresiones
    public addExpression(target : string, left: any, right: any = '', operator: string = ''){
        this.code.push(`${this.tabulador}${target} = ${left} ${operator} ${right};`);
    }


}