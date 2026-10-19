import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton, IonContent, IonIcon, IonInput, IonInputPasswordToggle,
  IonRouterLink, IonSpinner, NavController, ToastController,
} from '@ionic/angular';
import { FirebaseError } from 'firebase/app';
import { addIcons } from 'ionicons';
import { eye, eyeOff, filmOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    FormsModule, RouterLink, IonRouterLink, IonContent, IonButton,
    IonIcon, IonInput, IonInputPasswordToggle, IonSpinner,
  ],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  loading = signal(false);

  private authService = inject(AuthService);
  private navCtrl = inject(NavController);
  private toastCtrl = inject(ToastController);

  constructor() {
    addIcons({ eye, eyeOff, filmOutline });
  }

  private async showError(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'bottom',
    });
    await toast.present();
  }

  async onLogin() {
    // Empêche un double clic pendant la connexion
    if (this.loading()) {
      return;
    }
    this.loading.set(true);

    try {
      await this.authService.login(this.email, this.password);
      await this.navCtrl.navigateRoot('/tabs/films');
    } catch (error: unknown) {
      console.error('Erreur lors de la connexion :', error);

      let message = 'Une erreur est survenue. Veuillez réessayer.';

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-credential':
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            message = 'Adresse e-mail ou mot de passe incorrect.';
            break;
          case 'auth/invalid-email':
            message = 'Veuillez saisir une adresse e-mail valide.';
            break;
          case 'auth/too-many-requests':
            message = 'Trop de tentatives. Veuillez réessayer plus tard.';
            break;
        }
      } else if (error instanceof Error) {
        switch (error.message) {
          case 'PROFILE_NOT_FOUND':
            message = 'Votre profil utilisateur est introuvable.';
            break;
          case 'ACCOUNT_DISABLED':
            message = 'Votre compte a été désactivé par un administrateur.';
            break;
        }
      }

      await this.showError(message);
    } finally {
      this.loading.set(false);
    }
  }
}