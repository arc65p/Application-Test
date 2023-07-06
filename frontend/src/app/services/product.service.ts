import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {ProductModel} from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  URL = `${environment.URL}`;
  private rowProductSubject = new BehaviorSubject<any>(null);
  rowProduct$ = this.rowProductSubject.asObservable();
  private productListSubject = new BehaviorSubject<ProductModel[]>([]); // Initialize with an empty array
  productList$ = this.productListSubject.asObservable();

  public productDeletedSubject = new Subject<void>();

  // Expose the deletion event as an observable
  public productDeleted$ = this.productDeletedSubject.asObservable();


  constructor(private http: HttpClient) { }

  getProduct(): Observable<ProductModel[]> {
    const url = this.URL + 'get';
    return this.http.get<any>(url).pipe(
      map(response => response.data), // Extract the 'data' property from the response
      tap(data => this.productListSubject.next(data)) // Update productListSubject with the received data
    );
  }

  transferRowProduct(rowProduct: ProductModel) {
    this.rowProductSubject.next(rowProduct); // Update rowProduct subject with new data
  }

  //this method is used to create new users
  createProduct(data: ProductModel): Observable<ProductModel> {
    const url = this.URL + `add`
    return this.http.post<ProductModel>(url, data);
  }

  //this method is used to update existing users
  updateProduct(data: ProductModel): Observable<ProductModel> {
    const url = this.URL + `edit`
    return this.http.post<ProductModel>(url, data);
  }

  //this method is used to delete users one by one
  deleteProduct(id: number): Observable<ProductModel> {
    this.productDeletedSubject.next();
    const url = this.URL + `delete`
    return this.http.post<ProductModel>(url, id);
  }

}
