export class  Data{
    private static instance: Data;
    private temporal : number;    
    private tempStorage : Set<string>;
    private label : number;
    private codigo : string;
    tabulador:string = '';

    private constructor(){
        this.temporal = this.label = 0;
        this.codigo = '';
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
    public getCodigo():string{
        return this.codigo;
    }
    public clearCodigo(){
        this.temporal = this.label = 0;
        this.codigo = '';
        this.tempStorage = new Set();
    }

    //Expresiones
    public addExpression(target : string, left: any, right: any = '', operator: string = ''){
        this.codigo+=`${this.tabulador}${target} = ${left} ${operator} ${right};\n`;
    }


}