import { Injectable } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  status = "login"
  pangolin = {
    name: '',
    role: '',
    friends: [{
      name: '',
      role: '',
      _id: "",
      image: ""
    }],
    _id: "",
    image: ""
  };
  temp_id = "";


  constructor(
    public loginService: LoginService) {}

  setStatus(value: string) {
    this.status = value;
  }

  setToken(value: {token: string, expires: string}) {
    console.log("token");
    console.log(value);
    localStorage.setItem("token", value.token);
    localStorage.setItem("expires", value.expires);
  }

  setPangolin(value: { name: string; role: string; friends: Array<{ name: string; role: string, _id: string, image: string }>, _id: string, image: string }) {
    this.pangolin = value;
  }

  resetPangolin() {
    this.pangolin = {
      name: '',
      role: '',
      friends: [{
        name: '',
        role: '',
        _id: "",
        image: ""
      }],
      _id: "",
      image: ""
    };
  }

  
  deleteFriend(id: string) {

    
    this.loginService.deleteFriend(id, this.pangolin._id).subscribe(
      {next:(response) => {
        console.log(response);
      },
      error:(error) => {
        console.error(error);
      }}
    );
    
    this.loginService.deleteFriend(this.pangolin._id, id).subscribe(
      {next:(response) => {
        if (response.pangolinUpdated) {
          this.setPangolin(response.pangolinUpdated);
        }
      },
      error:(error) => {
        console.error(error);
      }}
    );
  }

  
  addFriend(id: string) {
    this.loginService.getPangolinById(id).subscribe({
      next: (pangolin) => {


        const { friends: _, ...temp_pangolin1 } = pangolin;
        const { friends: __, ...temp_pangolin2 } = this.pangolin;
        

        this.loginService
      .addFriend(temp_pangolin1._id, JSON.stringify(temp_pangolin2)).subscribe(
        {next:(response) => {
          console.log(response);
        },
        error:(error) => {
          console.error(error);
        }}
      );

        this.loginService
      .addFriend(this.pangolin._id, JSON.stringify(temp_pangolin1)).subscribe(
        {next:(response) => {
          if (response.pangolinUpdated) {
            this.setPangolin(response.pangolinUpdated);
          }
        },
        error:(error) => {
          console.error(error);
        }}
      );

      },
      error:  error => console.log(error)
      
    })
    
  }

  setTempId(id: string) {
    this.temp_id = id;
  }

  
}
