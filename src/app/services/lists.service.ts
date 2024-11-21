import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ListsData } from '../models/list-data';
import { environment } from '../environments/enviroment';
import { UserDetails } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ListsService {
  baseUrl = environment.baseURL;
  

  constructor(private http: HttpClient, private authService: AuthService) {}


  createList(
    name: string,
  ): Observable<any> {
    const headers = new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    const params = new HttpParams().set('name', name);

    return this.http.post(`${this.baseUrl}shoppingLists/create`, null, { headers, params });
  }

  getListsByUserId(
    uuid: string
  ): Observable<any> {
    const headers = new HttpHeaders({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    return this.http.get<ListsData[]>(`${this.baseUrl}shoppingLists/user/${uuid}`, { headers })
  }

  getListById(shoppingListId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    return this.http.get<any>(`${this.baseUrl}shoppingLists/${shoppingListId}`, { headers });
  }

  getShoppingListItems(shoppingListId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    return this.http.get<any>(`${this.baseUrl}shoppingLists/${shoppingListId}/items`, { headers });
  }

  addProductToList(shoppingListId: number, productName: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    const body = { [productName]: 1 };

    return this.http.post<any>(`${this.baseUrl}shoppingLists/${shoppingListId}/products/add`, body, { headers });
  }

  updateProductQuantity(shoppingListId: number, productQuantities: { [productName: string]: number }) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    return this.http.put<any>(`${this.baseUrl}shoppingLists/${shoppingListId}/products/update`, productQuantities, { headers })
  }

  updateListStatus(shoppingListId: number, newStatus: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    const params = new HttpParams().set('status', newStatus);

    return this.http.put(`${this.baseUrl}shoppingLists/${shoppingListId}/updateStatus`, null, { headers, params })
  }

  updateListName(shoppingListId: number, newName: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    const params = new HttpParams().set('newName', newName);

    return this.http.put(`${this.baseUrl}shoppingLists/${shoppingListId}/updateName`, null, { headers, params })
  }


  deleteProductsFromList(listId: number, productNames: string[]): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    let params = new HttpParams();
    productNames.forEach(name => {
      params = params.append('productNames', name);
    });

    return this.http.delete(`${this.baseUrl}shoppingLists/${listId}/products/delete`, { headers, params });
  }


  deleteShoppingList(shoppingListId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    return this.http.delete(`${this.baseUrl}shoppingLists/${shoppingListId}/delete`, { headers });
  }

  updateItemStatus(shoppingListId: number, productId: number, purchased: boolean): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
  
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('isBought', purchased.toString());
  
    return this.http.put(`${this.baseUrl}shoppingLists/${shoppingListId}/updateItemStatus`, null, { headers, params });
  }
  
}