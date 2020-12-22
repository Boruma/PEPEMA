import { Address } from './address';
import { PPE } from './ppe';
import { Role } from './role';
import { Supplier } from './supplier';

//the order entity
export class Order {

    order_ID: number;
    orderdate: string;
    expectedDeliveryDate: Date;
    commitedDeliveryDate: Date;
    state: string;
    supplier_ID: number;
    supplier: Supplier;
    ppes: PPE[];

    constructor(){        
            this.order_ID = null;
            this.supplier_ID = null;
            this.supplier = null;
            this.ppes = null;
    }
}

