export default class  Data{
    private static instance: Data;
    private temporal : number;
    private label : number;
    private code : string[];

    private constructor(){

    }
    public static getInstance():Data{
        return this.instance || (this.instance = new this());
    }

    

}