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
  pangolin = {
    name: '',
    role: '',
    friends: [''],
    _id: '',
    image: ""
  };
  friends: any[] = [];
  selected_role = '';

  constructor(
    private mainService: MainService,
    private loginService: LoginService
  ) {}

  logout() {
    this.mainService.setLogged(false);
  }

  onChangeRole() {
    this.loginService
      .changeRole(this.pangolin._id, this.selected_role)
      .subscribe(
        (response) => {
          if (response.pangolinUpdated) {
            this.mainService.setPangolin(response.pangolinUpdated);
            this.updateProfile();
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }

  updateProfile(pangolin?: any) {
    this.pangolin = this.mainService.pangolin;
    this.updateFriendsList();
  }

  updateFriendsList() {
    this.friends = [];
    this.pangolin.friends.forEach((id) => {
      return this.loginService.getPangolinById(id).subscribe(
        (response) => {
          if (response._id) {
            this.friends = this.friends.concat([response]);
          }
        },
        (error) => {
          console.error(error);
        }
      );
    });
  }

  deleteFriend(id: string) {
    this.loginService.deleteFriend(this.pangolin._id, id).subscribe(
      (response) => {
        if (response.pangolinUpdated) {
          this.mainService.setPangolin(response.pangolinUpdated);
          this.updateProfile();
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  addFriend(friend: string) {
    this.loginService
      .addFriend(this.mainService.pangolin._id, friend)
      .subscribe(
        (response) => {
          if (response.pangolinUpdated) {
            this.mainService.setPangolin(response.pangolinUpdated);
            this.updateProfile();
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }

  ngOnInit(): void {
    this.pangolin = this.mainService.pangolin;
    console.log(this.pangolin);
    this.updateFriendsList();
  }
}
