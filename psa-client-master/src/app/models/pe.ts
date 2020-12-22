import { Property } from './property'
import { size_range } from './size_range';
import {Supplier} from './supplier';
import {Role} from './role';

//the pe entity
export class Pe {
    pe_ID:number;
    name: string;
    supplier: Supplier;
    properties: Property[];
    size_ranges: size_range[];
    roles: Role[];
    supplItemID: string;
    supplier_ID: number;
    constructor() {
    }
}