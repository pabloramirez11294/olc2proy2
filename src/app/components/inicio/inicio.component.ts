import { Component, OnInit } from '@angular/core';
import Ejecucion from '../../gramaticas/ejecucion';
import Traduccion from '../../gramaticas/traduccion';
import {  Error_ ,errores} from '../../Reportes/Errores';
import { Environment, Simbolo } from '../../Entornos/Environment';
import {TipoEscape} from '../../Instruccion/BreakContinue';
import { Funcion } from '../../Instruccion/Funcion';
import { txtConsola,reporte } from '../../Reportes/Consola';
import { graphviz }  from 'd3-graphviz';
import { wasmFolder } from "@hpcc-js/wasm";
import { Instruction } from 'src/app/Modelos/Instruction';
import { Console } from '../../Instruccion/Console';
import { Literal } from 'src/app/Expresiones/Literal';
import { Declaracion } from 'src/app/Instruccion/Declaracion';
import { Instrucciones } from 'src/app/Instruccion/Instrucciones';
import { If } from 'src/app/Instruccion/If';
import { Relacional } from 'src/app/Expresiones/Relacional';
import { Aritmetico } from 'src/app/Expresiones/Aritmetico';
import { Expression } from '../../Modelos/Expression';
import { Return } from 'src/app/Instruccion/Return';
import { While } from 'src/app/Instruccion/While';
import { For } from 'src/app/Instruccion/For';
import { Switch } from 'src/app/Instruccion/Switch';
import { Data } from 'src/app/Data/Data';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  simbolos:Array<Array<string>>;
  repErrores:Array<Array<string>>;
  tipo_ts:string="";
  editor = `console.log(3+8*9/7-9+9);
  /*let a:number=1.99;
  let b:string="hola mundo";
  let c:boolean=true;
  if(1000 < 20){
    console.log(1); 
  }else if(500<100){
    console.log(2); 
  }else{
    console.log(3); 
  }*/`;
  consola = '';

  traducir(){
    this.tipo_ts="Traducción";
    Data.getInstance();      
    Data.getInstance().clearCodigo();
    errores.length=0;
    reporte.simbolos.length=0;
    const entorno = new Environment(null, 'global');
    try {
      const instrucciones = Traduccion.parse(this.editor);    
      for(const instruc of instrucciones){
        try {
            if(instruc instanceof Error_){
              errores.push(instruc);continue;
            }else if(instruc instanceof Funcion)
              instruc.execute(entorno);
        } catch (error) {
            errores.push(error);  
        }
      }

      for (const instruc of instrucciones) {
        if(instruc instanceof Error_ ||instruc instanceof Funcion)
            continue;
        try {          
          const actual = instruc.execute(entorno);
          //this.setConsola();
          if ((actual != null || actual != undefined)&& (actual.type==TipoEscape.BREAK || actual.type==TipoEscape.CONTINUE)) {
            errores.push(new Error_(actual.line,actual.column,'Semantico',actual.type + ' fuera de un ciclo',''));
          }         
        } catch (error) {
          //console.log(error)
          if(error.ambito!=null){
            error.ambito='global';
            errores.push(error);  
          }else
            console.log(error);
                    
        }
      }
    } catch (error) {
      console.log(error)
      if(error.ambito!=null){
        error.ambito='';
        errores.push(error);  
      }else
        errores.push(new Error_(error.lineNumber, 0, 'Lexico', error.message, ''));
    }
    //REPORTES    
    Data.getInstance().addEncabezado();
    let codigo:string = Data.getInstance().getCodigo();
    this.setConsola(codigo);
    this.simbolos=new Array<Array<string>>();
    this.reportes(entorno);    
    console.log('-----',this.simbolos);
  }

  reportes(entorno:Environment){
     //REPORTES
     try {
      const tablaVar=entorno.getTablaSimbolos();
      console.log('Tabla de Simbolos: ', tablaVar);
      this.setTablaSimbolos(tablaVar);
      console.log('Funciones: ', entorno.getFunciones());
      const tablaFunc=entorno.getFunciones();
      this.setTablaFunciones(tablaFunc);
      console.log('Reporte errores:', errores);
      this.setReporteErrores();
    } catch (error) {
      console.log(error);
    }
  }

  setConsola(codigo:string) {
    this.consola=codigo;
  }

  limpiar(){
    this.editor='';
    this.consola='';
    txtConsola.consolatxt="";
  }
  setTablaSimbolos(tSimbolos:Map<string,Simbolo>):void{
    reporte.simbolos.forEach(element => {
      this.simbolos.push(element);
    });
    for (var simbolo of tSimbolos.values()) {
      const s:Array<string>=new Array<string>(simbolo.id,simbolo.valor.toString(),simbolo.tipo?.toString(),
                                                  simbolo.ambito,simbolo.linea,simbolo.columna);
      this.simbolos.push(s);
    }
  }
  setTablaFunciones(simbolos:Map<string,Funcion>):void{
    reporte.simbolos.forEach(element => {
      this.simbolos.push(element);
    });
    for (var func of simbolos.values()) {
      const s:Array<string>=new Array<string>("func_"+func.id,'',func.tipo?.toString(),
                                                  '',func.line?.toString(),func.column?.toString());
      this.simbolos.push(s);
    }
    console.log(this.simbolos);
  }

  setReporteErrores(){
    this.repErrores=new Array<Array<string>>();
    for(var err of errores){
      const e:Array<string>=new Array<string>(err.tipo,err.descripcion,err.linea?.toString(),
                                                          err.columna?.toString());
      this.repErrores.push(e);                            
    }
  }

  //********************** AST
  btnAST(){
    try {
      const instrucciones = Ejecucion.parse(this.editor);
      const txtAST=this.recorrerAST(instrucciones,0);
      this.graficarAST(txtAST);
      //console.log(txtAST);
    }catch(error){
      console.log(error);
    }    
  }



  graficarAST(txt:string){
    txt="digraph G {\r\n node[shape=doublecircle, style=filled, color=khaki1, fontcolor=black]; \r\n"+txt+"\n}";
    wasmFolder('https://cdn.jsdelivr.net/npm/@hpcc-js/wasm@0.3.13/dist');
    graphviz('.ast').renderDot(txt);
  }



  cont:number=0;
  recorrerAST(raiz:any,id:number):string{
    this.cont=id;   
    let cuerpo:string="";
    try {
      if( raiz instanceof Instrucciones){        
        for(const hijos of raiz.code){
          this.cont++;
          cuerpo += "\""+id+"_" + raiz.constructor.name + "\"->\""+this.cont+"_"+hijos.constructor.name+"\"";
          cuerpo += this.recorrerAST(hijos, this.cont); 
        }      
      }else if( raiz instanceof Array){        
        for(const hijos of raiz){
          this.cont++;
          cuerpo += "\""+id+"_" + raiz.constructor.name + "\"->\""+this.cont+"_"+hijos.constructor.name+"\"";
          cuerpo += this.recorrerAST(hijos, this.cont); 
        }      
      }else if(raiz instanceof Console){
        this.cont++;      
        cuerpo += "\""+id+"_" + raiz.constructor.name + "\"->\""+this.cont+"_"+raiz.value.constructor.name+"\"";
        cuerpo += this.recorrerAST(raiz.value, this.cont); 
      }else if(raiz instanceof Literal){
        this.cont++;      
        cuerpo += "\""+id+"_" + raiz.constructor.name + "\"->\""+this.cont+"_"+raiz.value+"\"";
      }else if( raiz instanceof Declaracion){ //TODO revisar porque se quito listInstrucciones
          this.cont++;
          cuerpo += "\""+id+"_" + raiz.constructor.name + "\"->\""+this.cont+"_"+raiz.constructor.name+"\"";
      }else if(raiz instanceof Declaracion){
        this.cont++;      
        cuerpo += "\""+id+"_" + raiz.constructor.name + "\"->\""+this.cont+"_"+raiz.id+"\"";
      }else if( raiz instanceof Instrucciones){
        for(const hijos of raiz.code){
          this.cont++;
          cuerpo += "\""+id+"_" + raiz.constructor.name + "\"->\""+this.cont+"_"+hijos.constructor.name+"\"";
          cuerpo += this.recorrerAST(hijos, this.cont); 
        }
      }else if(raiz instanceof If){
        this.cont++;      
        cuerpo += "\""+id+"_" + raiz.constructor.name + "\"->\""+this.cont+"_"+raiz.condicion.constructor.name+"\"";
        cuerpo += this.recorrerAST(raiz.condicion, this.cont); 
        this.cont++;cuerpo+=this.cadena(id,raiz.constructor.name,this.cont,raiz.codeIF.constructor.name);
        cuerpo += this.recorrerAST(raiz.codeIF, this.cont); 
        this.cont++;cuerpo+=this.cadena(id,raiz.constructor.name,this.cont,raiz.codeElse.constructor.name);
        cuerpo += this.recorrerAST(raiz.codeElse, this.cont); 
      }else if(raiz instanceof Relacional || raiz instanceof Aritmetico){
        this.cont++;      
        cuerpo += "\""+id+"_" + raiz.constructor.name + "\"->\""+this.cont+"_"+raiz.left.constructor.name+"\"";
        cuerpo += this.recorrerAST(raiz.left, this.cont); 
        this.cont++;      
        cuerpo += "\""+id+"_" + raiz.constructor.name + "\"->\""+this.cont+"_"+raiz.right.constructor.name+"\"";
        cuerpo += this.recorrerAST(raiz.right, this.cont); 
      }else if(raiz instanceof Funcion){
        this.cont++;cuerpo+=this.cadena(id,raiz.constructor.name,this.cont,raiz.instrucciones.constructor.name);
        cuerpo += this.recorrerAST(raiz.instrucciones, this.cont); 
      }else if(raiz instanceof Return){
        this.cont++;cuerpo+=this.cadena(id,raiz.constructor.name,this.cont,raiz.exp.constructor.name);
        cuerpo += this.recorrerAST(raiz.exp, this.cont); 
      }else if(raiz instanceof While){
        this.cont++;      
        cuerpo += "\""+id+"_" + raiz.constructor.name + "\"->\""+this.cont+"_"+raiz.condicion.constructor.name+"\"";
        cuerpo += this.recorrerAST(raiz.condicion, this.cont); 
        this.cont++;cuerpo+=this.cadena(id,raiz.constructor.name,this.cont,raiz.code.constructor.name);
        cuerpo += this.recorrerAST(raiz.code, this.cont); 
      }else if(raiz instanceof For){
        this.cont++;      
        cuerpo += "\""+id+"_" + raiz.constructor.name + "\"->\""+this.cont+"_"+raiz.condicion.constructor.name+"\"";
        cuerpo += this.recorrerAST(raiz.condicion, this.cont); 
        this.cont++;cuerpo+=this.cadena(id,raiz.constructor.name,this.cont,raiz.code.constructor.name);
        cuerpo += this.recorrerAST(raiz.code, this.cont); 
      }else if(raiz instanceof Switch){
        this.cont++;      
        cuerpo += "\""+id+"_" + raiz.constructor.name + "\"->\""+this.cont+"_"+raiz.condicion.constructor.name+"\"";
        cuerpo += this.recorrerAST(raiz.condicion, this.cont); 
        this.cont++;cuerpo+=this.cadena(id,raiz.constructor.name,this.cont,raiz.defaul.constructor.name);
        cuerpo += this.recorrerAST(raiz.defaul, this.cont); 
      }else{
        

      }
    } catch (error) {
      console.log(error)
    }
    
    return cuerpo;
  }

  public cadena(id:number,raiz:string,cont:number,hijo:string):string{
    return "\""+id+"_" + raiz + "\"->\""+cont+"_"+hijo+"\"";
  }


}
