export enum Type{
    NUMBER='number',
    STRING='string',
    BOOLEAN='boolean',
    NULL='null',
    VOID='void',
    ARREGLO='arreglo'
}

export type Retorno ={
    value : string,
    type : Type,
    esTmp? : boolean,
    trueLabel? : string,
    falseLabel? : string
}