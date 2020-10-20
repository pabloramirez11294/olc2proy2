export enum Type{
    NUMBER,
    STRING,
    BOOLEAN,
    NULL,
    VOID,
    ARREGLO
}

export type Retorno ={
    value : string,
    type : Type,
    esTmp? : boolean
}