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
  ToastController,
} from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FirebaseError } from 'firebase/app';

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
  private toastController = inject(ToastController);

  private async showError(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'danger',
      position: 'bottom',
    });
    await toast.present();
  }

  async onRegister() {
    if (this.age === null) {
      await this.showError('Veuillez saisir votre âge');
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
    } catch (error: unknown) {
      console.error('Erreur lors de l’inscription :', error);

      let message = 'Une erreur est survenue. Veuillez réessayer.';

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            message = 'Cette adresse e-mail est déjà utilisée.';
            break;

          case 'auth/invalid-email':
            message = 'Veuillez saisir une adresse e-mail valide.';
            break;

          case 'auth/weak-password':
            message = 'Le mot de passe doit contenir au moins 6 caractères.';
            break;
        }
      }
      await this.showError(message);
    }
  }
}
