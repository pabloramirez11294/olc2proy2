export class  Data{
    private static instance: Data;
    private temporal : number;    
    private listTmp : Set<string>;
    private label : number;
    private codigo : string;
    tabulador:string = '';

    private constructor(){
        this.temporal = this.label = 0;
        this.codigo = '';
        this.listTmp = new Set();
    }
    public static getInstance():Data{
        return this.instance || (this.instance = new this());
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
        this.codigo+=`${this.tabulador}${label}:\n`;
    }
    public getCodigo():string{
        return this.codigo;
    }
    public clearCodigo(){
        this.temporal = this.label = 0;
        this.codigo = '';
        this.listTmp = new Set();
    }
    
    public addComentario(comentario: string){
        this.codigo+=`${this.tabulador}// ${comentario}\n`;
    }

    //Expresiones
    public addExpression(nomTmp : string, left: any, right: any = '', operator: string = ''){
        if(!isNaN(left))
            left=`${left}.0`;
        if(!isNaN(right))
            right=`${right}.0`;    
        this.codigo+=`${this.tabulador}${nomTmp} = ${left} ${operator} ${right};\n`;
    }
    public addModulo(nomTmp : string, left: any, right: any = ''){
        this.codigo+=`${this.tabulador}${nomTmp} = fmod(${left} , ${right});\n`;
    }

    //Instrucciones
    public addPrintf(formato: string, valor: any){
        this.codigo += `${this.tabulador}printf("%${formato}\\n",${valor});\n`;
    }

    public addIf(left: any, right: any, operator: string, label : string){
        this.codigo += `${this.tabulador}if (${left} ${operator} ${right}) goto ${label};\n`;
    }

    public addGoto(label : string){
        this.codigo+=`${this.tabulador}goto ${label};\n`;
    }

    //HEAP
    public nextHeap(){
        this.codigo += (this.tabulador + 'h = h + 1;');
    }

    public addGetHeap(tmp : any, index: any){
        this.codigo += (`${this.tabulador}${tmp} = Heap[${index}];`);
    }

    public addSetHeap(index: any, value : any){
        this.codigo += (`${this.tabulador}Heap[${index}] = ${value};`);
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
double heap[16384];
double stack[16394];
double p;
double h;${listaTmp}

int main() {
${this.codigo}
return 0;
}`      ;
    }


}