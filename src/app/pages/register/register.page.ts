import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonRouterLink,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonButton,
    IonToolbar,
    CommonModule,
    FormsModule,
    RouterLink,
    IonRouterLink,
    IonInput,
    IonItem,
    IonList,
  ],
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  nom: string = '';
  prenom: string = '';
  age: number | null = null;

  private authService = inject(AuthService);
  private navCtrl = inject(NavController);

  async onRegister() {
    if (this.age === null) {
      console.error('Veuillez saisir votre âge');
      return;
    }

    try {
      await this.authService.register(
        this.email,
        this.password,
        this.nom,
        this.prenom,
        this.age,
      );

      await this.navCtrl.navigateRoot('/tabs/films');
    } catch (error) {
      console.error('Erreur lors de l’inscription :', error);
    }
  }
}
