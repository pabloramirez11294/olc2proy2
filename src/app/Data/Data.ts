import { Environment } from "../Entornos/Environment";
import { For } from "../Instruccion/For";

export class  Data{
    private static instance: Data;
    private temporal : number;    
    private listTmp : Set<string>;
    private label : number;
    private codigo : string;
    private codigoFunc : string;
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
        this.setCod(`${label}:\n`);
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
        this.setCod(`// ${comentario}\n`);
    }

    //Expresiones
    public addExpression(nomTmp : string, left: any, right: any = '', operator: string = ''){
        if(!isNaN(left) && !left.includes('.'))
            left=`${left}.0`;
        if(right != '' && !isNaN(right) && !right.includes('.'))
            right=`${right}.0`;    
        this.tmpUsado(left);this.tmpUsado(right);
        this.setCod(`${nomTmp} = ${left} ${operator} ${right};\n`);
    }
    public addModulo(nomTmp : string, left: any, right: any = ''){
        this.tmpUsado(left);this.tmpUsado(right);
        this.setCod(`${nomTmp} = fmod(${left} , ${right});\n`);
    }

    //Instrucciones
    public addPrintf(formato: string, valor: any,salto=false){
        this.tmpUsado(valor);
        if(!salto)
            this.setCod ( `printf("%${formato}",${valor});\n`);
        else
            this.setCod ( `printf("\\n");\n`);
    }

    public addIf(left: any, right: any, operator: string, label : string){
        this.tmpUsado(left);this.tmpUsado(right);
        this.setCod (`if (${left} ${operator} ${right}) goto ${label};\n`);
    }

    public addGoto(label : string){
        this.setCod(`goto ${label};\n`);
    }

    //HEAP
    public nextHeap(){
        this.setCod('h = h + 1;');
    }

    public addGetHeap(tmp : any, index: any){
        this.tmpUsado(tmp);
        this.setCod(`${tmp} = Heap[(int)${index}];\n`);
    }

    public addSetHeap(index: any, value : any){
        this.tmpUsado(index);this.tmpUsado(value);
        this.setCod(`Heap[(int)${index}] = ${value};\n`);
    }

    //STACK
    public addGetStack(target : any, index: any){
        this.tmpUsado(index);
        this.setCod( `${target} = Stack[(int)${index}];\n`);
    }

    public addSetStack(index: any, value : any){
        this.tmpUsado(index);this.tmpUsado(value);
        this.setCod(`Stack[(int)${index}] = ${value};\n`);
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
    public addNextAmb(size: number){
        this.setCod(`p = p + ${size};\n`);
    }

    public addAntAmb(size: number){
        this.setCod(`p = p - ${size};\n`);
    }

    public addCallFunc(id: string){
        this.setCod(` ${id}();\n`);
    }

    public apartarTmp(amb: Environment) : number{
        const sizeListTemp = this.listTmp.size;
        const listTmpAux = new Set(this.listTmp);
        if(sizeListTemp > 0){
            let size = 0;            
            const temp = this.newTmp();             
            this.addComentario('Guardar temporales');
            this.addExpression(temp,'p',amb.size.toString(),'+');
            this.listTmp.forEach((value)=>{
                size++;
                this.addSetStack(temp,value);
                if(size !=  sizeListTemp)
                    this.addExpression(temp,temp,'1','+');
            });
            this.addComentario('Fin fuardar temporales');
        }
        let sizeAux = amb.size;
        amb.size = sizeAux + sizeListTemp;
        this.listTmp = listTmpAux;
        return sizeAux;
    }

    public recuperarTmp(amb: Environment, pos: number){
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
            amb.size = pos;
        }
    }

    public tmpUsado(temp: string){
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

//FUNCIONES NATIVAS
${this.codePrintString}
//FUNCIONES
${this.codigoFunc}


int main() {
${this.codigo}
return 0;
}`      ;
    }

    private codePrintString:string = `
int t0_s,t1_s,t2_s,t3_s;
void nativa_printString(){
t0_s=Stack[(int)p];
t1_s=Heap[(int)t0_s];
t3_s=t0_s+1;
t0_s=t0_s+t1_s;
L3_s:
if(t3_s<=t0_s) goto L1_s;
goto L2_s;
L1_s:
t2_s=Heap[t3_s];
printf("%c",(char)t2_s);
t3_s=t3_s+1;
goto L3_s;
L2_s:
return;
}

void native_concatString(){
int t0,t1,tReturn,tString,tString2,tamano=0,contador;
t0=Stack[(int)p+1];
tString=Heap[(int)t0];
t1=Stack[(int)p+2];
tString2=Heap[(int)t1];

tamano+=tString;
tamano+=tString2;
tReturn=h;
h=h+1;//size
contador=0;
t0+=1;
L6:
if(contador<tString) goto L4;
goto L5;
L4:
Heap[(int)h]=Heap[(int)t0];
h = h + 1;contador++;	
t0+=1;
goto L6;
L5:

contador=0;
t1+=1;
L9:
if(contador<tString2) goto L7;
goto L8;
L7:
Heap[(int)h]=Heap[(int)t1];
h = h + 1;contador++;	
t1+=1;
goto L9;
L8:
Heap[(int)tReturn] = tamano;
Stack[(int)p]=tReturn;
}
    
    

void native_concatStringNumber(){
int t0,tReturn,tString,tamano=0,entero,contador,cont,th,aux;
double decimal,tNumber;
t0=Stack[(int)p+1];
tString=Heap[(int)t0];
tNumber=Stack[(int)p+2];

entero=(int)tNumber;
decimal = fmod(tNumber,1.0);
contador=1;
L3:
if(entero/10>0)goto L1;
goto L2;
L1:
entero=entero/10;
contador++;
goto L3;
L2:
cont=contador;

tamano+=contador;
tamano+=tString;
tReturn=h;
h=h+1;//size
contador=0;t0+=1;
L6:
if(contador<tString) goto L4;
goto L5;
L4:
Heap[(int)h]=Heap[(int)t0];
h = h + 1;contador++;	
t0+=1;
goto L6;
L5:
    
contador=cont;
cont=0;
char buf[contador];
snprintf(buf, sizeof(buf), "%d",(int) tNumber);	
L9:
if(cont<contador)goto L7;
goto L8;
L7:
th=(int) buf[cont];
Heap[(int)h]=th; h = h + 1;
cont++;
goto L9;
L8:
if(decimal>0) goto L10;
goto L11;
L10:
aux = decimal*1000000;
tamano+=7;
Heap[(int)h]=46;h = h + 1;
char buf2[6];
snprintf(buf2, 6, "%d", aux);
int cont2=0;
L14:
if(cont2<6) goto L12;
goto L13;
L12:
th=buf2[cont2];
Heap[(int)h]=(int) th;h = h + 1;
cont2++;
goto L14;
L13:	
L11:
Heap[(int)tReturn] = tamano;
Stack[(int)p]=tReturn;
}

void native_concatNumberString(){
int t0,tReturn,tString,tNumber,tamano=0,entero,contador,cont,th,aux;
double decimal;
t0=Stack[(int)p+1];
tString=Heap[(int)t0];
tNumber=Stack[(int)p+2];

entero=(int)tNumber;
decimal = fmod(tNumber,1.0);
contador=1;
L3:
if(entero/10>0)goto L1;
goto L2;
L1:
entero=entero/10;
contador++;
goto L3;
L2:

tamano+=contador;
tamano+=tString;
tReturn=h;
h=h+1;//size

cont=0;
char buf[contador];
snprintf(buf, sizeof(buf), "%d",(int) tNumber);	
L9:
if(cont<contador)goto L7;
goto L8;
L7:
th=(int) buf[cont];
Heap[(int)h]=th; h = h + 1;
cont++;
goto L9;
L8:
if(decimal>0) goto L10;
goto L11;
L10:
aux = decimal*1000000;
tamano+=7;
Heap[(int)h]=46;h = h + 1;
char buf2[6];
snprintf(buf2, 6, "%d", aux);
int cont2=0;
L14:
if(cont2<6) goto L12;
goto L13;
L12:
th=buf2[cont2];
Heap[(int)h]=(int) th;h = h + 1;
cont2++;
goto L14;
L13:	
L11:



contador=0;t0+=1;
L6:
if(contador<tString) goto L4;
goto L5;
L4:
Heap[(int)h]=Heap[(int)t0];
h = h + 1;contador++;	
t0+=1;
goto L6;
L5:

Heap[(int)tReturn] = tamano;
Stack[(int)p]=tReturn;
}

void native_toUpperCase(){
int t0,t1,tReturn,tString,contador;
t0=Stack[(int)p+1];
tString=Heap[(int)t0];

tReturn=h;
h=h+1;//size
contador=0;
t0+=1;
L6:
if(contador<tString) goto L4;
goto L5;
L4:
t1=Heap[(int)t0];
//conversion
if(t1>=97)goto L7;
goto L8;
L7:
if(t1<=122) goto L9;
goto L10;
L9:
t1-=32;
L10:
L8:

Heap[(int)h]=t1;	
h = h + 1;contador++;	
t0+=1;
goto L6;
L5:
Heap[(int)tReturn] = tString;
Stack[(int)p]=tReturn;

}

void native_toLowerCase(){
int t0,t1,tReturn,tString,contador;
t0=Stack[(int)p+1];
tString=Heap[(int)t0];

tReturn=h;
h=h+1;//size
contador=0;
t0+=1;
L6:
if(contador<tString) goto L4;
goto L5;
L4:
t1=Heap[(int)t0];
//conversion
if(t1>=65)goto L7;
goto L8;
L7:
if(t1<=90) goto L9;
goto L10;
L9:
t1+=32;
L10:
L8:

Heap[(int)h]=t1;	
h = h + 1;contador++;	
t0+=1;
goto L6;
L5:
Heap[(int)tReturn] = tString;
Stack[(int)p]=tReturn;

}
    `;


}