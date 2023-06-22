import { Component, OnInit } from "@angular/core";
import { MainService } from "src/app/services/main.service";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  name: string = "";
  password: string = "";
  confirm_password: string = "";
  message = "";

  constructor(
    private mainService: MainService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.message = "check data...";

    if (this.name && this.password.length < 3) {
      this.message = "Name need 3 lenght min";
      return;
    }

    if (this.password && this.password.length < 6) {
      this.message = "Password need 6 lenght min";
      return;
    }

    if (this.password != this.confirm_password) {
      this.message = "Passwords doesnt match";
      return;
    }

    if (
      this.name.length >= 3 &&
      this.password.length >= 6 &&
      this.password == this.confirm_password
    ) {
      this.message = "Create account...";
      this.loginService.register(this.name, this.password).subscribe({
        next: (response) => {
          if (response.pangolinCreated) {
            this.message = "";
            this.mainService.setStatus("app");
            if (this.mainService.temp_id) {
              this.mainService.addFriend(response.pangolinCreated._id);
              this.mainService.setTempId("");
            } else {
              this.mainService.setPangolin(response.pangolinCreated);
            }
          }
        },
        error: (error) => {
          console.error(error);
          this.message = "Register failed";
        },
      });
    }
  }

  login() {
    this.mainService.setStatus("login");
  }
}
