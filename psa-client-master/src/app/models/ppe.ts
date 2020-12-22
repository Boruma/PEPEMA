import {Property} from './property';
import {size_range} from './size_range';
import {Pe} from './pe'
import {Role} from './role';

//the ppe entity
export class PPE {
    //ppe_ID: number;
    pe_ID: number;
    order_ID: number;
    stock_ID: number;
    employee_ID: number;
    employee_name: string;
    created_at: Date;
    updated_at: Date;

    sn: string;
    commissioningdate: Date;
    comment: string;
    state: string;
    delivered: boolean;
    size_ranges: size_range[];
    properties: Property[];
    pe: Pe;
    
    constructor() {
        this.pe_ID = 0;
        this.order_ID = 0;
        this.stock_ID = 0;
        this.employee_ID = 0;
        this.employee_name = null;
        this.created_at = null;
        this.updated_at = null;

        this.sn = '';
        this.commissioningdate = null;
        this.comment = null;
        this.state = null;
        this.delivered = null;

        this.properties = new Array<Property>();
        this.size_ranges = new Array<size_range>();
        this.pe = <Pe>{};
        this.pe.properties = new Array<Property>();
        this.pe.size_ranges = new Array<size_range>();
        this.pe.roles = new Array<Role>();
    }
}