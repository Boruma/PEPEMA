export class Property {
    property_ID: number;
    name: string;
    text: string;
    minValue: number;
    maxValue: number;
    date: Date;
    intervall: number;
    type: string;
    created_at: Date;
    updated_at: Date;

    constructor(property: Property) {
        this.property_ID = property.property_ID;
        this.name= property.name;
        this.text= property.text;
        this.minValue= property.minValue;
        this.maxValue= property.maxValue;
        this.date= property.date;
        this.intervall= property.intervall;
        this.type= property.type;
    }
}
