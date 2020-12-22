import { Address } from './address';

//the supplier entity
export class Supplier {
    supplier_ID: number;
    name: string;
    email: string;
    address: Address
 
    constructor(id){
        this.supplier_ID = id;
    }
}