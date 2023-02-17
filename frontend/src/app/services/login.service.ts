import { Injectable } from '@angular/core';
import { MainService } from './main.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private base = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  login(name: string, password: string): Observable<any> {
    return this.http.post(this.base + '/login', { name, password });
  }

  register(name: string, password: string): Observable<any> {
    return this.http.post(this.base + '/add/pangolin', { name, password });
  }

  changeRole(id: string, role: string): Observable<any> {
    return this.http.put(this.base + '/updateRole/pangolin/' + id, {
      role: role,
    });
  }

  addFriend(id: string, friend: string): Observable<any> {
    return this.http.put(this.base + '/addFriend/pangolin/' + id, {
      new_friend: friend,
    });
  }

  deleteFriend(id: string, friend: string): Observable<any> {
    return this.http.put(this.base + '/deleteFriend/pangolin/' + id, {
      old_friend: friend,
    });
  }

  getPangolinById(id: string): Observable<any> {
    return this.http.get(this.base + '/pangolin/' + id);
  }

  getPangolins(): Observable<any> {
    return this.http.get(this.base + '/pangolins');
  }
}
