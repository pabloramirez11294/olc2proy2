 
%{
    const {errores,Error_} = require('../Reportes/Errores');    
    const { Type } = require("../Modelos/Retorno");
    //expresiones
    const { ArithmeticOption,Aritmetico} = require('../Expresiones/Aritmetico');
    const {Relacional, RelationalOption} = require('../Expresiones/Relacional');
    const {Logica, LogicaOpcion} = require('../Expresiones/Logica');
    const {Literal} = require('../Expresiones/Literal');
    const {Variable} = require('../Expresiones/Variable');
    const {Unario,OperadorOpcion} = require('../Expresiones/Unario');
    const {Ternario} = require('../Expresiones/Ternario');
    const {AsigArreglo} = require('../Expresiones/AsigArreglo');
    //instrucciones
    const {Instrucciones} = require('../Instruccion/Instrucciones');
    //sentencias de control
    const {Console} = require('../Instruccion/Console');
    const {If} = require('../Instruccion/If');
    const {Switch} = require('../Instruccion/Switch');    
    const {Break,Continue,TipoEscape} = require('../Instruccion/BreakContinue');
    const {While,DoWhile} = require('../Instruccion/While');
    //declaraciones
    const {Declaracion} = require('../Instruccion/Declaracion');
    //funciones
    const {Funcion} = require('../Instruccion/Funcion');
    const {Simbolo} = require('../Entornos/Environment');
    const {Llamada} = require('../Instruccion/Llamada');
%}

%lex
%options case-insensitive
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
"CharAt"                return 'CHARAT'
"ToLowerCase"           return 'TOLOWERCASE'
"ToUpperCase"           return 'TOUPPERCASE'
"Concat"                return 'CONCAT'
"of"                    return 'OF'
"in"                    return 'IN'
"new"                   return 'NEW'
"array"                 return 'ARRAY'


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
    | Types { $$ = $1; }
    | error 
        { 
            //console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); 
            $$= new Error_(this._$.first_line , this._$.first_column, 'Sintáctico',yytext,'');
        }
;

Types
    : 'TYPE' ID '=' '{' ListTypes '}' ';'
;

ListTypes
        : ListTypes ID ':' Tipo Fin
        |
;
Fin
    : ','
    | ';'
    |
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
        : 'FUNCTION' ID '(' Parametros ')' ':' Tipo InstruccionesSent {$$ = new Funcion($2,$4,$7,$8,@1.first_line, @1.first_column);}
        | 'FUNCTION' ID '(' ')' ':' Tipo InstruccionesSent  {$$ = new Funcion($2, [],$6,$7 , @1.first_line, @1.first_column);}
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
        | ID ':' Tipo { $$ = new Simbolo(undefined,$1,$3);}
;


Instruc
        : 'CONSOLE' '(' Expre ')' ';'{ $$ = new Console($3, @1.first_line, @1.first_column); }
        | Sentencia_if {  $$ = $1; }
        | 'FOR' '(' Declaracion Exp ';' Actualizacion ')' InstruccionesSent
        | 'FOR' '(' DeclaForOF 'OF' Exp ')' InstruccionesSent
        | 'FOR' '(' DeclaForOF 'IN' Exp ')' InstruccionesSent
        | 'WHILE' '(' Exp ')' InstruccionesSent {$$ = new While($3,$5, @1.first_line, @1.first_column);}
        | 'DO'  InstruccionesSent 'WHILE' '(' Exp ')' ';' {$$ = new DoWhile($5,$2, @1.first_line, @1.first_column);}
        | 'BREAK' ';' { $$ = new Break(@1.first_line, @1.first_column); }
        | 'CONTINUE' ';'  { $$ = new Continue(@1.first_line, @1.first_column); }
        | Sent_switch { $$ = $1; }
        | Declaracion { $$ = $1; }
        | Unario ';' 
        | Llamada ';' { $$ = $1; }  
        | 'RETURN' Exp ';'{ $$ = new Return($2,@1.first_line, @1.first_column); }
        | 'RETURN' ';'  { $$ = new Return(undefined,@1.first_line, @1.first_column); }
        | ID AccesoAsig  '=' Exp ';'

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
        | 'CONST' ID
;

//*********************SENTENCIAS DE CONTROL
Sentencia_if
            : 'IF' '(' Exp ')' InstruccionesSent Sentencia_else{ $$ = new If($3, $5, $6, @1.first_line, @1.first_column);}
;

Sentencia_else
                : 'ELSE' Sentencia_if  { $$ = $2;}
                | 'ELSE' InstruccionesSent { $$ = $2;}
                |  { $$ = null;}
;

InstruccionesSent
    : '{' Instrucciones '}' {$$ = new Instrucciones($2, @1.first_line, @1.first_column);}
    | '{' '}' { $$ = new Instrucciones(new Array(), @1.first_line, @1.first_column);}
;
InstruccionesSwitch
                    : Instrucciones  {$$ = new Instrucciones($1, @1.first_line, @1.first_column);}
                    |  {$$ = new Instrucciones(new Array(), @1.first_line, @1.first_column);}
;
//************************SWITCH

Sent_switch
            : 'SWITCH' '(' Exp ')' '{'  Cases Default '}' {$$ = new Switch($3,$6,$7);}
;

Cases
    : Cases 'CASE'  Exp ':' InstruccionesSwitch {$$.set($3,$5); }
    | 'CASE' Exp ':' InstruccionesSwitch { let a = new Map();  $$ = a.set($2,$4);}
;

Default
        : 'DEFAULT' ':' InstruccionesSwitch { $$ = $3; }
        |
;

//*********************** CICLOS
Actualizacion
            : Unario 
            | ID '=' Exp ';'
;


//*********************** DECLARACION DE VARIABLES


Declaracion
            : 'LET' OpcionDeclaracion ';' { $$ = $2; }       
            | ID '=' Exp ';' {$$ = new Declaracion($1,undefined,$3,true, @1.first_line, @1.first_column);}       
            | 'CONST' OpcionDeclaracionConst ';' { $$ = $2; }
;


OpcionDeclaracion
                : ID ':' Tipo '=' Exp {$$ = new Declaracion($1,$3,$5,false, @1.first_line, @1.first_column);}
                | ID ':' Tipo {$$ = new Declaracion($1,$3,undefined,false, @1.first_line, @1.first_column);}
                | ID ':' Tipo Dim '=' Exp            
                | ID ':' Tipo Dim  
                | ID ':' Tipo Dim '=' 'NEW' 'ARRAY' '(' Exp ')'
;
OpcionDeclaracionConst
                : ID ':' Tipo '=' Exp {$$ = new Declaracion($1,$3,$5,false, @1.first_line, @1.first_column); $$.constante=true;}
                | ID ':' Tipo Dim '=' Exp 
                | ID ':' Tipo Dim '=' 'NEW' 'ARRAY' '(' Exp ')'

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
            | '[' Expre ']'
;


//*****************LLAMADAS A FUNCIONES

Llamada
        : ID '('  ')' {$$ = new Llamada($1, [], @1.first_line, @1.first_column);}
        | ID '(' Expre ')' {$$ = new Llamada($1, $3, @1.first_line, @1.first_column);}
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
    | ID
;



Exp
    : Exp '+' Exp { $$ = new Aritmetico($1, $3, ArithmeticOption.SUMA, @1.first_line,@1.first_column); }       
    | Exp '-' Exp { $$ = new Aritmetico($1, $3, ArithmeticOption.RESTA, @1.first_line,@1.first_column); }  
    | Exp '**' Exp { $$ = new Aritmetico($1, $3, ArithmeticOption.POTENCIA, @1.first_line,@1.first_column); }  
    | Exp '%' Exp { $$ = new Aritmetico($1, $3, ArithmeticOption.MODULO, @1.first_line,@1.first_column); }  
    | Exp '*' Exp { $$ = new Aritmetico($1, $3, ArithmeticOption.MULT, @1.first_line,@1.first_column); }  
    | Exp '/' Exp { $$ = new Aritmetico($1, $3, ArithmeticOption.DIV, @1.first_line,@1.first_column); }          
    | Exp '>' Exp { $$ = new Relacional($1, $3,RelationalOption.MAYOR, @1.first_line, @1.first_column);}
    | Exp '<' Exp { $$ = new Relacional($1, $3,RelationalOption.MENOR, @1.first_line, @1.first_column);}
    | Exp '>=' Exp { $$ = new Relacional($1, $3,RelationalOption.MAYORIGUAL, @1.first_line, @1.first_column);}
    | Exp '<=' Exp { $$ = new Relacional($1, $3,RelationalOption.MENORIGUAL, @1.first_line, @1.first_column);}
    | Exp '==' Exp { $$ = new Relacional($1, $3,RelationalOption.IGUAL, @1.first_line, @1.first_column);}
    | Exp '!=' Exp {$$ = new Relacional($1, $3,RelationalOption.NOIGUAL, @1.first_line, @1.first_column);}
    | Exp '&&' Exp {$$ = new Logica($1, $3,LogicaOpcion.AND, @1.first_line, @1.first_column);}
    | Exp '||' Exp { $$ = new Logica($1, $3,LogicaOpcion.OR, @1.first_line, @1.first_column);}
    | Exp '.' Exp
    | Exp '?' Exp ':' Exp
    | '!' Exp { $$ = new Logica($2,null,LogicaOpcion.NOT, @1.first_line, @1.first_column); }
    | '-' Exp %prec Umenos { $$ = new Aritmetico($2,null, ArithmeticOption.RESTA, @1.first_line,@1.first_column); }
    | '(' Exp ')' { $$ = $2; }
    | Unario { $$ = $1}
    | Dimensiones {  $$ = $1; }
    | AccesoArr { $$ = $1; }
    | F  {  $$ = $1; }
;

AccesoArr
        : AccesoArr '[' Exp ']'
        | ID '[' Exp ']' 
;

F
    : NUMERO{ $$ = new Literal($1, @1.first_line, @1.first_column, Type.NUMBER); }
    | CADENA
    {
        let txt=$1.replace(/\\n/g,"\n");
        txt = txt.replace(/\\t/g,"\t");
        txt = txt.replace(/\\r/g,"\r");
        //$$ = new Literal(txt.replace(/\"/g,""), @1.first_line, @1.first_column, Type.STRING);
    }
    | TRUE {$$ = new Literal('1', @1.first_line, @1.first_column, Type.BOOLEAN);}
    | FALSE {$$ = new Literal('0', @1.first_line, @1.first_column, Type.BOOLEAN);}
    | ID {$$ = new Variable($1,@1.first_line, @1.first_column);}
    | Llamada
    {
        $$ = $1;
    }
    | NULL 
    | Exp '.' LENGTH
    | Exp '.' 'CHARAT' '(' Exp ')'
    | Exp '.' 'TOLOWERCASE' '(' ')'
    | Exp '.' 'TOUPPERCASE' '(' ')'
    | Exp '.' 'CONCAT' '(' Exp ')'
    | TypesExp
;

Unario 
    : ID '++'
    | ID '--'
;

TypesExp    
        : '{' ListTypesExp '}'
;

ListTypesExp
            : ListTypesExp ID ':' Exp Fin
        | 
;
