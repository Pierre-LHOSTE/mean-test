import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  isLogged = false;
  register = false;
  pangolin = {
    name: '',
    role: '',
    friends: [''],
    _id: "",
    image: ""
  };

  setLogged(value: boolean) {
    this.isLogged = value;
    if (!value)
      this.pangolin = {
        name: '',
        role: '',
        friends: [''],
        _id: "",
        image: ""
      };
  }

  setRegister(value: boolean) {
    this.register = value;
  }

  setPangolin(value: { name: string; role: string; friends: Array<string>, _id: string, image: string }) {
    this.pangolin = value;
  }

  constructor() {}
}
