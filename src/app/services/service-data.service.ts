import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ServiceDataService {
  constructor(private http: HttpClient) {}

  async postData(data: any) {
    return await this.http.post<any>('http://localhost:3000/store', data);
  }

  async getData() {
    return await this.http.get<any>('http://localhost:3000/data');
  }
}
