export class  Data{
    private static instance: Data;
    private temporal : number;    
    private listTmp : Set<string>;
    private label : number;
    private codigo : string;
    private codigoFunc : string;
    tabulador:string = '';
    private esFunc;
    private constructor(){
        this.esFunc = false;
        this.temporal = this.label = 0;
        this.codigo = '';
        this.listTmp = new Set();
        this.codigoFunc = '';
    }
    public static getInstance():Data{
        return this.instance || (this.instance = new this());
    }

    private setCod(cod:string){
        !this.esFunc ? this.codigo += cod : this.codigoFunc += cod;
    }
    public newTmp() : string{
        const tmp = 'T' + this.temporal++;
        this.listTmp.add(tmp);
        return tmp;
    }

    public newLabel() : string{
        return 'L' + this.label++;
    }

    public addLabel(label : string){
        this.setCod(`${this.tabulador}${label}:\n`);
    }
    public getCodigo():string{
        return this.codigo;
    }
    public clearCodigo(){
        this.temporal = this.label = 0;
        this.codigo = '';
        this.codigoFunc = '';
        this.listTmp = new Set();
    }
    
    public addComentario(comentario: string){
        this.setCod(`${this.tabulador}// ${comentario}\n`);
    }

    //Expresiones
    public addExpression(nomTmp : string, left: any, right: any = '', operator: string = ''){
        if(!isNaN(left) && !left.includes('.'))
            left=`${left}.0`;
        if(!isNaN(right) && !right.includes('.'))
            right=`${right}.0`;    
        this.setCod(`${this.tabulador}${nomTmp} = ${left} ${operator} ${right};\n`);
    }
    public addModulo(nomTmp : string, left: any, right: any = ''){
        this.setCod(`${this.tabulador}${nomTmp} = fmod(${left} , ${right});\n`);
    }

    //Instrucciones
    public addPrintf(formato: string, valor: any){
        this.setCod ( `${this.tabulador}printf("%${formato}\\n",${valor});\n`);
    }

    public addIf(left: any, right: any, operator: string, label : string){
        this.setCod (`${this.tabulador}if (${left} ${operator} ${right}) goto ${label};\n`);
    }

    public addGoto(label : string){
        this.setCod(`${this.tabulador}goto ${label};\n`);
    }

    //HEAP
    public nextHeap(){
        this.setCod(this.tabulador + 'h = h + 1;');
    }

    public addGetHeap(tmp : any, index: any){
        this.setCod(`${this.tabulador}${tmp} = Heap[${index}];\n`);
    }

    public addSetHeap(index: any, value : any){
        this.setCod(`${this.tabulador}Heap[${index}] = ${value};\n`);
    }

    //STACK
    public addGetStack(target : any, index: any){
        this.setCod( `${this.tabulador}${target} = Stack[${index}];\n`);
    }

    public addSetStack(index: any, value : any){
        this.setCod(`${this.tabulador}Stack[${index}] = ${value};\n`);
    }
    //FUNCIONES
    public setListTmp(tempStorage : Set<string>){
        this.listTmp = tempStorage;
    }
    public getListTmp(){
        return this.listTmp;
    }
    public clearListTmp(){
        this.listTmp.clear();
    }
    public addEncabezadoFunc(id: string){
        this.esFunc = true;
        this.setCod(`\nvoid ${id}(){\n`);
    }
    public addFinalFunc(){
        this.setCod('return; \n}\n');        
        this.esFunc = false;
    }

    public addEncabezado(){        
        let listaTmp : string = '';
        if(this.listTmp.size!=0){
            listaTmp = '\nfloat '
            this.listTmp.forEach(element => {
                listaTmp += element + ',';
            });
            listaTmp = listaTmp.replace(/.$/,';');            
        }
        this.codigo =       
`#include <stdio.h>
#include <math.h>
double Heap[16384];
double Stack[16394];
double p;
double h;${listaTmp}

${this.codigoFunc}

int main() {
${this.codigo}
return 0;
}`      ;
    }


}