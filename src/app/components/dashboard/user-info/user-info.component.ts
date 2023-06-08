import { Component } from '@angular/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent {
  username: string = '';
  loginDate: Date | null = null;

  constructor() {}

  ngOnInit() {
    const user_info = sessionStorage.getItem('userinfo');
    const info_obj = user_info ? JSON.parse(user_info) : [];

    if (info_obj) {
      this.username = info_obj.username;
      this.loginDate = new Date(info_obj.login_date);
    }
  }
}
