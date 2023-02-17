import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLogged: boolean = false;
  name: string = "";
  password: string = "";
  message = "";

  constructor(
    private mainService: MainService,
    private LoginService: LoginService
  ) {}

  ngOnInit(): void {
    this.isLogged = this.mainService.isLogged;
  }

  onSubmit() {
    this.message = "Login..."
    this.LoginService.login(this.name, this.password).subscribe(
      (response) => {
        if (response.pangolin) {
          this.message = ""
          this.mainService.setLogged(true);
          this.mainService.setPangolin(response.pangolin);
        }
      },
      (error) => {
        console.error(error);
        this.message = "Login failed"
      }
    );
  }

  register() {
    this.mainService.setRegister(true);
  }
}
