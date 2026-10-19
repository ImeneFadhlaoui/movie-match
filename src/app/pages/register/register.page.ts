import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton, IonContent, IonIcon, IonInput, IonInputPasswordToggle,
  IonRouterLink, IonSpinner, NavController, ToastController,
} from '@ionic/angular';
import { Camera } from '@capacitor/camera';
import { FirebaseError } from 'firebase/app';
import { addIcons } from 'ionicons';
import { camera, eye, eyeOff } from 'ionicons/icons';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    FormsModule, RouterLink, IonRouterLink, IonContent, IonButton,
    IonIcon, IonInput, IonInputPasswordToggle, IonSpinner,
  ],
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  nom: string = '';
  prenom: string = '';
  age: number | null = null;
  photo = signal<string | null>(null);
  loading = signal(false);

  private authService = inject(AuthService);
  private navCtrl = inject(NavController);
  private toastController = inject(ToastController);

  constructor() {
    addIcons({ camera, eye, eyeOff });
  }

  private async showError(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'bottom',
    });
    await toast.present();
  }

  async takePhoto() {
    try {
      const result = await Camera.takePhoto({
        quality: 50,
        targetWidth: 300,
        targetHeight: 300,
        includeMetadata: true,
      });

      const format = result.metadata?.format ?? 'jpeg';
      const dataUrl = `data:image/${format};base64,${result.thumbnail}`;

      this.photo.set(await this.resizeImage(dataUrl, 300));
    } catch (error) {
      console.error('Photo annulée ou erreur :', error);
    }
  }

  private async resizeImage(dataUrl: string, maxWidth: number): Promise<string> {
    // 1. charger l'image
    const image = new Image();
    image.src = dataUrl;
    await image.decode();

    // 2. calculer les nouvelles dimensions
    let width = image.width;
    let height = image.height;

    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    // 3. créer le canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    // 4. dessiner l'image
    const context = canvas.getContext('2d');
    if (context === null) {
      throw new Error('Impossible de créer le contexte 2D');
    }
    context.drawImage(image, 0, 0, width, height);

    // 5. exporter l'image
    return canvas.toDataURL('image/jpeg', 0.7);
  }

  async onRegister() {
    if (this.loading()) {
      return;
    }

    const photo = this.photo();

    if (photo === null) {
      await this.showError('Veuillez prendre une photo de profil.');
      return;
    }

    if (this.age === null) {
      await this.showError('Veuillez saisir votre âge.');
      return;
    }

    this.loading.set(true);

    try {
      await this.authService.register(
        this.email,
        this.password,
        this.nom,
        this.prenom,
        this.age,
        photo,
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
    } finally {
      this.loading.set(false);
    }
  }
}