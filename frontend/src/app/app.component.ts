import { Component, OnInit } from "@angular/core";
import { MainService } from "./services/main.service";
import { LoginService } from "src/app/services/login.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    public mainService: MainService,
    public LoginService: LoginService
  ) {}
  pangolin = {
    name: "",
    role: "",
    friends: [{}],
    _id: "",
    image: "",
  };
  selected_role = "";

  ngOnInit(): void {
    let token = localStorage.getItem("token");
    console.log("token:");
    console.log(token);
    if (token) {
      this.LoginService.loginWithToken(token).subscribe(
        {next: (response) => {
          if (response.data) {      
            this.mainService.setStatus("app");
            this.mainService.setPangolin(response.data);
          }
        },
        error: (error) => {
          console.error(error);
        }}
      )
    }
  }
}
