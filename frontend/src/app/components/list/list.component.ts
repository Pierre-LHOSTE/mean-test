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
    private loginService: LoginService,
    public mainService: MainService,
    private profileComponent: ProfileComponent
  ) {}

  ngOnInit() {
    this.loginService.getPangolins().subscribe(
      (response) => {
        this.pangolins = response.pangolins;
        console.log(this.pangolins);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  addFriend(id: string) {
    this.profileComponent.addFriend(id);
  }
}
