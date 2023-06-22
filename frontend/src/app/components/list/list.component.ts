import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  pangolins: Array<any> = [];

  constructor(
    public loginService: LoginService,
    public mainService: MainService,
  ) {}

  ngOnInit() {
    this.loginService.getPangolins().subscribe(
      {next: (response) => {
        this.pangolins = response.pangolins;
        console.log(this.pangolins);
      },
      error :(error) => {
        console.error(error);
      }}
    );
  }

  isPangolinFriend(pangolin: any): boolean {
    return this.mainService.pangolin.friends.map(p=>p._id).includes(pangolin._id);
  }

  registerAndAdd() {
    this.mainService.setTempId(this.mainService.pangolin._id);
    this.mainService.setStatus("register");
  }

  
}
