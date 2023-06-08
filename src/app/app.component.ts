import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ptecnicaangular';

  constructor() {
    const users = [
      { username: 'usuario1', password: 'contraseña1' },
      { username: 'usuario2', password: 'contraseña2' },
    ];

    localStorage.setItem('users', JSON.stringify(users));
  }
}
