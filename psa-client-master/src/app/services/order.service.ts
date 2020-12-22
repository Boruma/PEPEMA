import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProviderService } from './provider.service';
import { Order } from '../models/order';
import { Observable } from 'rxjs';
import { PPE } from '../models/ppe';

const TOKEN_KEY = 'auth-token';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  apiUrl: string = this.global.globalUrl + "/order";

  //for newOrder
  private newOrder: Order = null;
  private newPpes: PPE[] = null;
  public orderDataUpdatet: any = null;
  public ppesDataUpdatet: any = null;


  constructor(
    public http: HttpClient,
    public global: ProviderService,
    private storage: Storage
  ) {
    this.initObserver();
  }

  private initObserver() {
    this.orderDataUpdatet = Observable.create(observer => {
      observer.next(this.newOrder);
    });
    this.ppesDataUpdatet = Observable.create(observer => {
      observer.next(this.newPpes);
    });
  }

  private getNewOrder(): Order {
    return this.newOrder;
  }

  public setNewOrder(order) {
    if (this.newOrder == null) {
      this.newOrder = new Order();
    }
    this.newOrder = order;
  }

  private getNewPpes(): PPE[] {
    return this.newPpes;
  }

  public clearNewPpes() {
    if (this.newPpes != null) {
      this.newPpes.length = 0;
    }

  }

  public addNewPpe(ppe: PPE) {
    if (this.newPpes == null) {
      this.newPpes = new Array<PPE>();
    }
    this.newPpes.push(ppe);
  }

  //set order as delivered
  orderDelivered(id: Number): Promise<any> {
    return this.storage.get(TOKEN_KEY).then(res => {

      if (res) {
        const url = `${this.apiUrl}/delivered/${id}`;
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };
        let postData = {};
        return this.http.put(url, postData, httpOption).toPromise();
      }
    });
  }

  //commit a order
  orderCommited(id: Number, orderdate: string): Promise<any> {
    return this.storage.get(TOKEN_KEY).then(res => {

      if (res) {
        const url = `${this.apiUrl}/commited/${id}`;
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };
        let postData = {
          "orderdate": orderdate
        };
        return this.http.put(url, postData, httpOption).toPromise();
      }
    });
  }

  //create a new order
  createOrder(order: Order): Promise<Order> {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };
        let postData = {
          "orderEnt": order
        };

        return this.http.post<Order>(this.apiUrl, postData, httpOption).toPromise();
      }
    });
  }

  //update a Order
  updateOrder(order: Order): Promise<Order> {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };
        let postData = {
          "orderEnt": order
        };

        return this.http.put<Order>(this.apiUrl, postData, httpOption).toPromise();
      }
    });
  }

  //get one Order
  getOrder(id): Promise<Order> {
    return this.storage.get(TOKEN_KEY).then(res => {

      if (res) {
        const url = `${this.apiUrl}/${id}`;
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };

        return this.http.get<Order>(url, httpOption).toPromise();
      }
    });
  }

  //get all orders of a supplier
  getOrdersOfSupplier(id): Promise<Order[]> {
    return this.storage.get(TOKEN_KEY).then(res => {

      if (res) {
        const url = `${this.apiUrl}/supplier/${id}`;
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };

        return this.http.get<Order[]>(url, httpOption).toPromise();
      }
    });
  }

  //get all orders of a company
  getOrders(): Promise<Order[]> {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };
        return this.http.get<Order[]>(this.apiUrl, httpOption).toPromise();
      }
    });
  }

  //delete one order
  deleteOrder(id) {
    return this.storage.get(TOKEN_KEY).then(res => {

      if (res) {
        const url = `${this.apiUrl}/${id}`;
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };

        return this.http.delete(url, httpOption).toPromise();
      }
    });
  }

  //delete all orders of a company
  deleteAllOrders() {
    return this.storage.get(TOKEN_KEY).then(res => {

      if (res) {
        const url = `${this.apiUrl}`;
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };

        return this.http.delete(url, httpOption).toPromise();
      }
    });
  }

}
