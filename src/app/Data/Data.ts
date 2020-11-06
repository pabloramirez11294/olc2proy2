import { Environment } from "../Entornos/Environment";
import { For } from "../Instruccion/For";

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
    public addTemp(temp: string){
        if(!this.listTmp.has(temp)){
            this.listTmp.add(temp);         
        }
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
        this.freeTemp(left);this.freeTemp(right);
        this.setCod(`${this.tabulador}${nomTmp} = ${left} ${operator} ${right};\n`);
    }
    public addModulo(nomTmp : string, left: any, right: any = ''){
        this.freeTemp(left);this.freeTemp(right);
        this.setCod(`${this.tabulador}${nomTmp} = fmod(${left} , ${right});\n`);
    }

    //Instrucciones
    public addPrintf(formato: string, valor: any){
        this.freeTemp(valor);
        this.setCod ( `${this.tabulador}printf("%${formato}\\n",${valor});\n`);
    }

    public addIf(left: any, right: any, operator: string, label : string){
        this.freeTemp(left);this.freeTemp(right);
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
        this.freeTemp(tmp);
        this.setCod(`${this.tabulador}${tmp} = Heap[(int)${index}];\n`);
    }

    public addSetHeap(index: any, value : any){
        this.freeTemp(index);this.freeTemp(value);
        this.setCod(`${this.tabulador}Heap[(int)${index}] = ${value};\n`);
    }

    //STACK
    public addGetStack(target : any, index: any){
        this.freeTemp(index);
        this.setCod( `${this.tabulador}${target} = Stack[(int)${index}];\n`);
    }

    public addSetStack(index: any, value : any){
        this.freeTemp(index);this.freeTemp(value);
        this.setCod(`${this.tabulador}Stack[(int)${index}] = ${value};\n`);
    }
    //FUNCIONES
    public setListTmp(listTmp : Set<string>){
        listTmp.forEach(element => {
            this.listTmp.add(element);            
        });
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
    public addNextEnv(size: number){
        this.setCod(`${this.tabulador}p = p + ${size};\n`);
    }

    public addAntEnv(size: number){
        this.setCod(`${this.tabulador}p = p - ${size};\n`);
    }

    public addCall(id: string){
        this.setCod(`${this.tabulador} ${id}();\n`);
    }

    public saveTemps(enviorement: Environment) : number{
        const sizeListTemp = this.listTmp.size;
        const listTmpAux = new Set(this.listTmp);
        if(sizeListTemp > 0){
            let size = 0;            
            const temp = this.newTmp();             
            this.addComentario('Guardar temporales');
            this.addExpression(temp,'p',enviorement.size.toString(),'+');
            this.listTmp.forEach((value)=>{
                size++;
                this.addSetStack(temp,value);
                if(size !=  sizeListTemp)
                    this.addExpression(temp,temp,'1','+');
            });
            this.addComentario('Fin fuardar temporales');
        }
        let sizeAux = enviorement.size;
        enviorement.size = sizeAux + sizeListTemp;
        this.listTmp = listTmpAux;
        return sizeAux;
    }

    public recoverTemps(enviorement: Environment, pos: number){
        if(this.listTmp.size > 0){
            const temp = this.newTmp(); 
            let size = 0;

            this.addComentario('Inicia recuperado de temporales');
            this.addExpression(temp,'p',pos.toString(),'+');
            this.listTmp.forEach((value)=>{
                size++;
                this.addGetStack(value,temp);
                if(size !=  this.listTmp.size)
                    this.addExpression(temp,temp,'1','+');
            });
            this.addComentario('Finaliza recuperado de temporales');
            enviorement.size = pos;
        }
    }

    public freeTemp(temp: string){
        if(this.listTmp.has(temp)){
            this.listTmp.delete(temp);
        }
    }

    public addEncabezado(){        
        let listaTmp : string = '';
        if(this.temporal!=0){
            listaTmp = '\nfloat '
            for(let i=0;i<this.temporal;i++){
                listaTmp +=`T${i},`;
            }
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