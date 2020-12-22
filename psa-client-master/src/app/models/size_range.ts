import {size} from './size';

//the size_range entity
export class size_range {
    sizer_ID: number;
    name: string;
    sizes: size[];

    constructor(size, sizer_ID, rangename) {
        this.sizer_ID = sizer_ID,
            this.name = rangename,
            this.sizes = new Array();
        this.sizes[0] = size;
    }
}