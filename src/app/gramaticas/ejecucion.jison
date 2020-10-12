 
%{
    const { ArithmeticOption,Aritmetico} = require('../Expresiones/Aritmetico');
    const {Relacional, RelationalOption} = require('../Expresiones/Relacional');
    const {Logica, LogicaOpcion} = require('../Expresiones/Logica');
    const {Literal} = require('../Expresiones/Literal');
    const {Variable} = require('../Expresiones/Variable');
    const {Unario,OperadorOpcion} = require('../Expresiones/Unario');
    const {Ternario} = require('../Expresiones/Ternario');
    const {AsigArreglo} = require('../Expresiones/AsigArreglo');
    const {Return} = require('../Instruccion/Return');
    const {Console} = require('../Instruccion/Console');
    const {errores,Error_} = require('../Reportes/Errores');
    const { Type } = require("../Modelos/Retorno");
    const {If} = require('../Instruccion/If');
    const {Switch} = require('../Instruccion/Switch');
    const {Declaracion} = require('../Instruccion/Declaracion');
    const {ListDeclaracion} = require('../Instruccion/ListDeclaracion');
    const {Break,Continue,TipoEscape} = require('../Instruccion/BreakContinue');
    const {While,DoWhile} = require('../Instruccion/While');
    const {For,ForOf} = require('../Instruccion/For');
    const {Instrucciones} = require('../Instruccion/Instrucciones');
    const {InstrucUnaria} = require('../Instruccion/InstrucUnaria');
    const {Funcion} = require('../Instruccion/Funcion');
    const {Llamada} = require('../Instruccion/Llamada');
    const {DecArreglo} = require('../Instruccion/DecArreglo');
    const {Arreglo} = require('../Estructuras/Arreglo');
    const {Acceso} = require('../Estructuras/Acceso');
    const {AccesoAsig} = require('../Estructuras/AccesoAsig');
    const {Length,Pop,Push} = require('../Estructuras/Length');
    const {Simbolo} = require('../Entornos/Environment');
    const {Graficarts} = require('../Reportes/Graficarts');
%}

%lex
%options case-sensitive
entero [0-9]+
number {entero}("."{entero})?
string  (\"[^"]*\")
string2  (\'[^']*\')

%%
\s+                   /* skip whitespace */
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas
//valores
{number}              return 'NUMERO'
{string}             return 'CADENA'
{string2}             return 'CADENA2'
//tipos de datos
"number"			  return 'NUMBER'
"string"			  return 'STRING'
"boolean"			  return 'BOOLEAN'
"true"                return 'TRUE'
"false"               return 'FALSE'
"void"                  return 'VOID'
"type"                  return 'TYPE'   
//palabras reservadas
"let"                  return 'LET'
"const"                 return 'CONST'
"console.log"           return 'CONSOLE'
"graficar_ts"           return 'GRAFICARTS'
//sentenicas de control y ciclos
"if"                    return 'IF'
"else"                  return 'ELSE'
"switch"                return 'SWITCH'
"case"                  return 'CASE'
"default"               return 'DEFAULT'
"while"                 return 'WHILE'
"break"                 return 'BREAK'
"continue"              return 'CONTINUE'
"for"                   return 'FOR'
"function"              return 'FUNCTION'
"return"                return 'RETURN'
"do"                    return 'DO'
"null"                  return 'NULL'
"length"                return 'LENGTH'
"push"                return 'PUSH'
"pop"                return 'POP'
"of"                return 'OF'


"++"                    return '++'
"--"                    return '--'
"+"                   return '+'
"-"                   return '-'
"**"                    return '**'
"*"                   return '*'
"/"                   return '/'
"%"                     return '%'
">="                    return '>='
"<="                    return '<='
">"                     return '>'
"<"                     return '<'
"=="                    return '=='
"!="                    return '!='
"&&"                    return '&&'
"||"                    return '||'
"!"                     return '!'
"?"                     return '?'
":"                     return ':'
"="                     return '='  
"("                     return '('
")"                     return ')' 
"{"                     return '{'
"}"                     return '}'
"["                     return '['
"]"                     return ']'  
";"                     return ';'
","                     return ','
"."                     return '.'

([a-zA-Z_])[a-zA-Z0-9_ñÑ]*	return 'ID'
<<EOF>>		          return 'EOF'

/lex
%right '?' ':'
%left '||'
%left '&&'
%left '==', '!='
%left '>=', '<=', '<', '>'
%left '++' '--'
%left '+' '-'
%left '*' '/' '%'
%left '**' 
%left '!'
%left Umenos
%left '.' 
//%left MENOS
%start Init

%%

Init    
    : Contenido EOF 
    {
        return $1;
    }
;
Contenido
        : Contenido Cont  
    {
        $1.push($2);
        $$ = $1;
    }
    | Cont{
        $$ = [$1];
    }
;
Cont
    : Instruc { $$ = $1; }
    | Funciones { $$ = $1; }
    | error 
        { 
            //console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); 
            $$= new Error_(this._$.first_line , this._$.first_column, 'Sintáctico',yytext,'');
        }
;


Instrucciones
    : Instrucciones Instruc  
    {
        $1.push($2);
        $$ = $1;
    }
    | Instruc{
        $$ = [$1];
    }
;



Funciones
        : 'FUNCTION' ID '(' Parametros ')' ':' Tipo InstruccionesSent
        {
            $$ = new Funcion($2,$4,$7,$8,@1.first_line, @1.first_column);
        }
        | 'FUNCTION' ID '(' ')' ':' Tipo InstruccionesSent  
        {
            $$ = new Funcion($2, [],$6,$7 , @1.first_line, @1.first_column);
        }
        | 'FUNCTION' ID '(' Parametros ')'  InstruccionesSent
        {
            $$ = new Funcion($2,$4,Type.VOID,$6,@1.first_line, @1.first_column);
        }
        | 'FUNCTION' ID '(' ')'  InstruccionesSent  
        {
            $$ = new Funcion($2, [],Type.VOID,$5 , @1.first_line, @1.first_column);
        }
;

Parametros
        : Parametros ',' OpcionParam
        {
            $1.push($3);
            $$ = $1;
        }
        | OpcionParam
        {
            $$ = [$1];
        }
;
OpcionParam
            :  ID ':' Tipo Dim  
        {
            let sim=new Simbolo(undefined,$1,Type.ARREGLO);
            sim.tipoArreglo=$3;
            sim.dim = $4;
            $$ = sim;
        }
        | ID ':' Tipo 
        {
            $$ = new Simbolo(undefined,$1,$3);
        }
;


Instruc
        : 'CONSOLE' '(' Expre ')' ';'
        {
             $$ = new Console($3, @1.first_line, @1.first_column);
        }
        |  'GRAFICARTS' '('  ')' ';'
        {
             $$ = new Graficarts(@1.first_line, @1.first_column);
        }
        | Sentencia_if {
            $$ = $1;
        }
        | 'FOR' '(' Declaracion Exp ';' Actualizacion ')' InstruccionesSent
        {
            $$ = new For($3,$4,$6, $8,@1.first_line, @1.first_column);
        }
        | 'FOR' '(' DeclaForOF 'OF' Exp ')' InstruccionesSent
        {         
            $$ = new ForOf($3,$5,$7,@1.first_line, @1.first_column);
        }
        | 'WHILE' '(' Exp ')' InstruccionesSent 
        {
            $$ = new While($3,$5, @1.first_line, @1.first_column);
        }
        | 'DO'  InstruccionesSent 'WHILE' '(' Exp ')' ';'
        {
            $$ = new DoWhile($5,$2, @1.first_line, @1.first_column);
        }
        | 'BREAK' ';' { $$ = new Break(@1.first_line, @1.first_column); }
        | 'CONTINUE' ';'  { $$ = new Continue(@1.first_line, @1.first_column); }
        | Sent_switch { $$ = $1; }
        | Declaracion {$$ = $1;}
        | Unario ';' {$$ = new InstrucUnaria($1,@1.first_line, @1.first_column);}
        | Llamada ';' { $$ = $1; } 
        | 'RETURN' Exp ';' { $$ = new Return($2,@1.first_line, @1.first_column); }
        | 'RETURN' ';' { $$ = new Return(undefined,@1.first_line, @1.first_column); }
        | ID AccesoAsig  '=' Exp ';'
        {
                $$ =  new AccesoAsig($1,$2,$4,@1.first_line, @1.first_column);
        }
        | ID '.' POP '(' ')' ';'
        {
            $$ = new Pop(undefined,$1,@1.first_line, @1.first_column);
        }     
        | ID '.' PUSH '(' Exp ')' ';'
        {
            $$ = new Push(undefined,$1,$5,@1.first_line, @1.first_column);
        }

;

AccesoAsig
        : AccesoAsig '[' Exp ']' {
            $$.push($3);
        }
        | '[' Exp ']'{
            $$ =[$2]
        }

;

DeclaForOF
        : 'LET' ID
        {
            $$ = new Declaracion($2,undefined,undefined,false, @1.first_line, @1.first_column);
        }
        | 'CONST' ID
        {
            $$ = new Declaracion($2,undefined,undefined,false, @1.first_line, @1.first_column);
            $$.constante=true;
        }
;
/*
AccesoAsig
        : AccesoAsig '[' Exp ']' {
            $$= new AccesoAsig(undefined,$3,$1,@1.first_line, @1.first_column);
        }
        | ID '[' Exp ']'{
            $$ = new AccesoAsig($1,$3,null,@1.first_line, @1.first_column);
        }
*/
//*********************SENTENCIAS DE CONTROL
Sentencia_if
            : 'IF' '(' Exp ')' InstruccionesSent Sentencia_else
            {
                $$ = new If($3, $5, $6, @1.first_line, @1.first_column);
            }
;

Sentencia_else
                : 'ELSE' Sentencia_if { $$ = $2;}
                | 'ELSE' InstruccionesSent { $$ = $2;}
                |  { $$ = null;}
;

InstruccionesSent
    : '{' Instrucciones '}' 
    {
        $$ = new Instrucciones($2, @1.first_line, @1.first_column);
    }
    | '{' '}' {
        $$ = new Instrucciones(new Array(), @1.first_line, @1.first_column);
    }
;
InstruccionesSwitch
                    : Instrucciones  
                    {
                        $$ = new Instrucciones($1, @1.first_line, @1.first_column);
                    }
                    |  {
                        $$ = new Instrucciones(new Array(), @1.first_line, @1.first_column);
                    }
;
//************************SWITCH

Sent_switch
            : 'SWITCH' '(' Exp ')' '{'  Cases Default '}' 
            {
                $$ = new Switch($3,$6,$7);
            }
;

Cases
    : Cases 'CASE'  Exp ':' InstruccionesSwitch
    {
        $$.set($3,$5); 
    }
    | 'CASE' Exp ':' InstruccionesSwitch
    {
        let a = new Map();
        $$ = a.set($2,$4);
    }
;

Default
        : 'DEFAULT' ':' InstruccionesSwitch
        { $$ = $3; }
        |
;

//*********************** CICLOS
Actualizacion
            : Unario { $$ = $1; }
            | ID '=' Exp ';'
            {
                $$ = new Declaracion($1,undefined,$3,true, @1.first_line, @1.first_column);
            }
;


//*********************** DECLARACION DE VARIABLES


Declaracion
            : 'LET' ListaDeclaracion ';'
            {
                $$ = new ListDeclaracion($2, @1.first_line, @1.first_column); 
            }            
            | ID '=' Exp ';'
            {
                $$ = new Declaracion($1,undefined,$3,true, @1.first_line, @1.first_column);
            }            
            | 'CONST' ListaDeclaracionConst ';' 
            {
                $$ = new ListDeclaracion($2, @1.first_line, @1.first_column); 
            } 
;

ListaDeclaracion
                : ListaDeclaracion ',' OpcionDeclaracion { $1.push($3); }
                | OpcionDeclaracion { $$ = [$1]; }
;

OpcionDeclaracion
                : ID ':' Tipo '=' Exp
                {
                    $$ = new Declaracion($1,$3,$5,false, @1.first_line, @1.first_column);
                }
                | ID ':' Tipo
                {
                    $$ = new Declaracion($1,$3,undefined,false, @1.first_line, @1.first_column);
                }
                | ID '=' Exp
                {
                    $$ = new Declaracion($1,undefined,$3,false, @1.first_line, @1.first_column);
                }
                | ID
                {
                    $$ = new Declaracion($1,undefined,undefined,false, @1.first_line, @1.first_column);
                }
                | ID ':' Tipo Dim '=' Exp 
                {
                     $$ = new DecArreglo($1,Type.ARREGLO,$3,$4,$6,false,@1.first_line, @1.first_column);
                }                
                | ID ':' Tipo Dim  
                {
                    $$ = new DecArreglo($1,Type.ARREGLO,$3,$4,undefined,false,@1.first_line, @1.first_column);
                }
;
OpcionDeclaracionConst
                : ID ':' Tipo '=' Exp
                {
                    $$ = new Declaracion($1,$3,$5,false, @1.first_line, @1.first_column);
                    $$.constante=true;
                }
                | ID '=' Exp
                {
                    $$ = new Declaracion($1,undefined,$3,false, @1.first_line, @1.first_column);
                    $$.constante=true;
                }
                | ID ':' Tipo Dim '=' Exp 
                {
                     $$ = new DecArreglo($1,Type.ARREGLO,$3,$4,$6,false,@1.first_line, @1.first_column);
                     $$.constante=true;
                } 
;

Dim
            : Dim '['']'
            {
                 $$=$1+1;
            }
            | '['']'
            {
                $$ =1;
            }
;

Dimensiones
            : '['  ']' 
            {
                $$ = new AsigArreglo(null,Type.ARREGLO,@1.first_line,@1.first_column);
            }
            | '[' Expre ']'
            {
                $$ = new AsigArreglo($2,Type.ARREGLO,@1.first_line,@1.first_column);
            }
;
/*
OpcDim
        : Expre
        | Dimensiones 
        | {
                $$ = [new Array()]
            }
;
*/
ListaDeclaracionConst
                : ListaDeclaracionConst ',' OpcionDeclaracionConst { $1.push($3); }
                | OpcionDeclaracionConst { $$ = [$1]; }
;



//*****************LLAMADAS A FUNCIONES

Llamada
        : ID '('  ')'
        {
            $$ = new Llamada($1, [], @1.first_line, @1.first_column);
        }
        | ID '(' Expre ')'
        {
            $$ = new Llamada($1, $3, @1.first_line, @1.first_column);
        }
;


Expre 
    : Expre ',' Exp
    {
        $1.push($3);
        $$ = $1;
    }
    | Exp{
        $$ = [$1];
    }
;    

Tipo
    : 'NUMBER' { $$ = Type.NUMBER; }
    | 'STRING' { $$ = Type.STRING; }
    | 'BOOLEAN' { $$ = Type.BOOLEAN; }
    | 'VOID' { $$ = Type.VOID; }
;


Exp
    : Exp '+' Exp
    {
        $$ = new Aritmetico($1, $3, ArithmeticOption.SUMA, @1.first_line,@1.first_column);
    }       
    | Exp '-' Exp
    {
        $$ = new Aritmetico($1, $3, ArithmeticOption.RESTA, @1.first_line,@1.first_column);
    }
    | Exp '**' Exp
    { 
        $$ = new Aritmetico($1, $3, ArithmeticOption.POTENCIA, @1.first_line,@1.first_column);
    }  
    
    | Exp '%' Exp
    { 
        $$ = new Aritmetico($1, $3, ArithmeticOption.MODULO, @1.first_line,@1.first_column);
    }  
    | Exp '*' Exp
    { 
        $$ = new Aritmetico($1, $3, ArithmeticOption.MULT, @1.first_line,@1.first_column);
    }       
    | Exp '/' Exp
    {
        $$ = new Aritmetico($1, $3, ArithmeticOption.DIV, @1.first_line,@1.first_column);
    }            
    | Exp '>' Exp   
    {
        $$ = new Relacional($1, $3,RelationalOption.MAYOR, @1.first_line, @1.first_column);
    }
    | Exp '<' Exp   
    {
        $$ = new Relacional($1, $3,RelationalOption.MENOR, @1.first_line, @1.first_column);
    }
    | Exp '>=' Exp   
    {
        $$ = new Relacional($1, $3,RelationalOption.MAYORIGUAL, @1.first_line, @1.first_column);
    }
    | Exp '<=' Exp   
    {
        $$ = new Relacional($1, $3,RelationalOption.MENORIGUAL, @1.first_line, @1.first_column);
    }
    | Exp '==' Exp   
    {
        $$ = new Relacional($1, $3,RelationalOption.IGUAL, @1.first_line, @1.first_column);
    }
    | Exp '!=' Exp  
    {
        $$ = new Relacional($1, $3,RelationalOption.NOIGUAL, @1.first_line, @1.first_column);
    } 
    | Exp '&&' Exp   
    {
        $$ = new Logica($1, $3,LogicaOpcion.AND, @1.first_line, @1.first_column);
    }
    | Exp '||' Exp  
    {
        $$ = new Logica($1, $3,LogicaOpcion.OR, @1.first_line, @1.first_column);
    } 
    | Exp '?' Exp ':' Exp  
    {
        $$ = new Ternario($1, $3, $5, @1.first_line, @1.first_column);
    }
    | '!' Exp 
    {
        $$ = new Logica($2,null,LogicaOpcion.NOT, @1.first_line, @1.first_column);
    }
    | '-' Exp %prec Umenos  
    {
        $$ = new Aritmetico($2,null, ArithmeticOption.RESTA, @1.first_line,@1.first_column);
    }
    | '(' Exp ')'
    {
        $$ = $2;
    }
    | Unario { $$ = $1}
    | Dimensiones {  $$ = $1; }
    | AccesoArr
    {
        $$ = $1;
    }
    | F
    {
        $$ = $1;
    }
;

AccesoArr
        : AccesoArr '[' Exp ']' {
            $$= new Acceso(undefined,$3,$1,@1.first_line, @1.first_column);
        }
        | ID '[' Exp ']' {
            $$ = new Acceso($1,$3,null,@1.first_line, @1.first_column);
        }
;

F
    : NUMERO
    {
        $$ = new Literal($1, @1.first_line, @1.first_column, Type.NUMBER);
    }
    | CADENA
    {
        let txt=$1.replace(/\\n/g,"\n");
        txt = txt.replace(/\\t/g,"\t");
        txt = txt.replace(/\\r/g,"\r");
        $$ = new Literal(txt.replace(/\"/g,""), @1.first_line, @1.first_column, Type.STRING);
    }
    | CADENA2
    {
        let txt2=$1.replace(/\\n/g,"\n");
        txt2 = txt2.replace(/\\t/g,"\t");
        txt2 = txt2.replace(/\\r/g,"\r");
        $$ = new Literal(txt2.replace(/\'/g,""), @1.first_line, @1.first_column, Type.STRING);
    }
    | TRUE
    {
         $$ = new Literal(true, @1.first_line, @1.first_column, Type.BOOLEAN);
    }
    | FALSE
    {
        $$ = new Literal(false, @1.first_line, @1.first_column, Type.BOOLEAN);
    }
    | ID
    {
        $$ = new Variable($1,@1.first_line, @1.first_column);
    }
    | Llamada
    {
        $$ = $1;
    }
    | NULL 
    {
        $$ = new Literal(null, @1.first_line, @1.first_column, Type.NULL);
    }
    | Exp '.' LENGTH
    {
        $$ = new Length($1,@1.first_line, @1.first_column);
    }
    | Exp '.' POP '(' ')'
    {
        $$ = new Pop($1,undefined,@1.first_line, @1.first_column);
    }     
    | Exp '.' PUSH '(' Exp ')'
    {
        $$ = new Push($1,undefined,$5,@1.first_line, @1.first_column);
    }
;

Unario 
    : ID '++'
    {
        $$ = new Unario($1,OperadorOpcion.INCRE,@1.first_line, @1.first_column);
    }
    | ID '--'    
    {
        $$ = new Unario($1,OperadorOpcion.DECRE,@1.first_line, @1.first_column);
    }
;



