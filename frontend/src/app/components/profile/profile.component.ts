import { Component } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  roles = ['guerrier', 'alchimiste', 'sorcier', 'espion', 'enchanteur'];  
  selected_role = '';

  constructor(
    public mainService: MainService,
    public loginService: LoginService
  ) {}

  logout() {
    this.mainService.setStatus("login");
    this.mainService.resetPangolin();
    localStorage.removeItem("token");
  }

  onChangeRole() {
    this.loginService
      .changeRole(this.mainService.pangolin._id, this.selected_role)
      .subscribe(
        {next:(response) => {
          if (response.pangolinUpdated) {
            this.mainService.setPangolin(response.pangolinUpdated);
          }
        },
        error:(error) => {
          console.error(error);
        }}
      );
  }
  

  ngOnInit(): void {
    console.log(this.mainService.pangolin);
    
  }
}

