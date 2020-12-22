import { Address } from './address';
import { PPE } from './ppe';
import { Role } from './role';

//the employee entity
export class Employee {
    employee_ID: number;
    locker: number;
    name: string;
    email: string;
    phonenumber: string;
    address: Address;
    ppes: PPE[];
    avippes: PPE[];
    roles: Role[];
}
