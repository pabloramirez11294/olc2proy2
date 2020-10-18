 
%{
    const {errores,Error_} = require('../Reportes/Errores');
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
        : 'FUNCTION' ID '(' Parametros ')' ':' Tipo InstruccionesSent
        | 'FUNCTION' ID '(' ')' ':' Tipo InstruccionesSent  
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
        | ID ':' Tipo 
;


Instruc
        : 'CONSOLE' '(' Expre ')' ';'
        | Sentencia_if 
        | 'FOR' '(' Declaracion Exp ';' Actualizacion ')' InstruccionesSent
        | 'FOR' '(' DeclaForOF 'OF' Exp ')' InstruccionesSent
        | 'FOR' '(' DeclaForOF 'IN' Exp ')' InstruccionesSent
        | 'WHILE' '(' Exp ')' InstruccionesSent 
        | 'DO'  InstruccionesSent 'WHILE' '(' Exp ')' ';'
        | 'BREAK' ';' 
        | 'CONTINUE' ';' 
        | Sent_switch 
        | Declaracion 
        | Unario ';' 
        | Llamada ';' 
        | 'RETURN' Exp ';'
        | 'RETURN' ';' 
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
;

Sentencia_else
                : 'ELSE' Sentencia_if 
                | 'ELSE' InstruccionesSent 
                |  
;

InstruccionesSent
    : '{' Instrucciones '}' 
    | '{' '}' 
;
InstruccionesSwitch
                    : Instrucciones  
                    |  
;
//************************SWITCH

Sent_switch
            : 'SWITCH' '(' Exp ')' '{'  Cases Default '}' 
;

Cases
    : Cases 'CASE'  Exp ':' InstruccionesSwitch
    | 'CASE' Exp ':' InstruccionesSwitch
;

Default
        : 'DEFAULT' ':' InstruccionesSwitch
        |
;

//*********************** CICLOS
Actualizacion
            : Unario 
            | ID '=' Exp ';'
            {
                $$ = new Declaracion($1,undefined,$3,true, @1.first_line, @1.first_column);
            }
;


//*********************** DECLARACION DE VARIABLES


Declaracion
            : 'LET' OpcionDeclaracion ';'        
            | ID '=' Exp ';'        
            | 'CONST' OpcionDeclaracionConst ';' 
;


OpcionDeclaracion
                : ID ':' Tipo '=' Exp
                | ID ':' Tipo
                | ID ':' Tipo Dim '=' Exp            
                | ID ':' Tipo Dim  
                | ID ':' Tipo Dim '=' 'NEW' 'ARRAY' '(' Exp ')'
;
OpcionDeclaracionConst
                : ID ':' Tipo '=' Exp
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
        | ID '(' Expre ')'
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
    : 'NUMBER' 
    | 'STRING'
    | 'BOOLEAN' 
    | 'VOID' 
    | ID
;



Exp
    : Exp '+' Exp       
    | Exp '-' Exp
    | Exp '**' Exp  
    | Exp '%' Exp
    | Exp '*' Exp     
    | Exp '/' Exp        
    | Exp '>' Exp  
    | Exp '<' Exp  
    | Exp '>=' Exp   
    | Exp '<=' Exp  
    | Exp '==' Exp 
    | Exp '!=' Exp  
    | Exp '&&' Exp  
    | Exp '||' Exp  
    | Exp '.' Exp
    | Exp '?' Exp ':' Exp
    | '!' Exp 
    | '-' Exp %prec Umenos  
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
        : AccesoArr '[' Exp ']'
        | ID '[' Exp ']' 
;

F
    : NUMERO
    | CADENA
    {
        let txt=$1.replace(/\\n/g,"\n");
        txt = txt.replace(/\\t/g,"\t");
        txt = txt.replace(/\\r/g,"\r");
        //$$ = new Literal(txt.replace(/\"/g,""), @1.first_line, @1.first_column, Type.STRING);
    }
    | CADENA2
    {
        let txt2=$1.replace(/\\n/g,"\n");
        txt2 = txt2.replace(/\\t/g,"\t");
        txt2 = txt2.replace(/\\r/g,"\r");
        //$$ = new Literal(txt2.replace(/\'/g,""), @1.first_line, @1.first_column, Type.STRING);
    }
    | TRUE
    | FALSE
    | ID
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
