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
    public getCodigo():string{
        return this.codigo;
    }
    public clearCodigo(){
        this.temporal = this.label = 0;
        this.codigo = '';
        this.listTmp = new Set();
    }
    
    public addComentario(comentario: string){
        this.codigo+=`${this.tabulador}// ${comentario}`;
    }

    //Expresiones
    public addExpression(target : string, left: any, right: any = '', operator: string = ''){
        this.codigo+=`${this.tabulador}${target} = ${left} ${operator} ${right};\n`;
    }

    //Instrucciones
    public addPrintf(formato: string, valor: any){
        this.codigo += `${this.tabulador}printf("%${formato}",${valor});`;
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
float heap[16384];
float stack[16394];
float p;
float h;${listaTmp}

int main() {
${this.codigo}
return 0;
}`      ;
    }


}