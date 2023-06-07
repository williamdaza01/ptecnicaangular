import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    const usersLocalStorage = localStorage.getItem('users');
    const users = usersLocalStorage ? JSON.parse(usersLocalStorage) : [];

    const user = users.find((u: { username: string; password: string; }) => u.username === this.username && u.password === this.password);

    if (user) {
      console.log('Inicio de sesión exitoso');
      this.router.navigate(['/dashboard']);
    } else {
      console.log('Nombre de usuario o contraseña incorrectos');
    }
  }
}