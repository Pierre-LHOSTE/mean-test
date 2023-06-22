import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  name: string = "";
  password: string = "";
  message = "";

  constructor(
    private mainService: MainService,
    private LoginService: LoginService
  ) {}

  ngOnInit(): void {
  }

  onSubmit() {
    this.message = "Login..."
    this.LoginService.login(this.name, this.password).subscribe(
      {next: (response) => {
        if (response.pangolin) {       
          this.message = ""
          this.mainService.setStatus("app");
          this.mainService.setPangolin(response.pangolin);
          this.mainService.setToken({token: response.token, expires: response.expiresIn})
        }
      },
      error: (error) => {
        console.error(error);
        this.message = "Login failed"
      }}
    );
  }

  register() {
    this.mainService.setStatus("register");
  }
}
