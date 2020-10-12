export enum Type{
    NUMBER,
    STRING,
    BOOLEAN,
    NULL,
    VOID,
    ARREGLO
}

export type Retorno ={
    value : any,
    type : Type
}