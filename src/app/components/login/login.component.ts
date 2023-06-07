import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  login() {
    const usersLocalStorage = localStorage.getItem('users');
    const users = usersLocalStorage ? JSON.parse(usersLocalStorage) : [];

    const user = users.find((u: { username: string; password: string; }) => u.username === this.username && u.password === this.password);

    if (user) {
      console.log('Inicio de sesión exitoso');
      // Aquí puedes redirigir al usuario a otra página
    } else {
      console.log('Nombre de usuario o contraseña incorrectos');
    }
  }
}