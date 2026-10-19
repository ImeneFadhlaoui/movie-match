import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
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
import { Camera } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';
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
    IonIcon,
    IonAvatar
  ],
})

export class RegisterPage {

  constructor() {
  addIcons({ camera });
}
  email: string = '';
  password: string = '';
  nom: string = '';
  prenom: string = '';
  age: number | null = null;
  photo: string | null = null;

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

    this.photo = await this.resizeImage(dataUrl, 300);

    console.log(
      'Taille approximative de la photo :',
      (this.photo.length / 1024).toFixed(2),
      'Ko'
    );
  } catch (error) {
    console.error('Erreur lors du traitement de la photo :', error);
  }
}



private async resizeImage(
  dataUrl: string,
  maxWidth: number
): Promise<string> {
  //  charger l'image
  const image = new Image();
  image.src = dataUrl;
  await image.decode();

  //  calculer les nouvelles dimensions
  let width = image.width;
  let height = image.height;

  if (width > maxWidth) {
    height = height * maxWidth / width;
    width = maxWidth;
  }

  // créer le canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  //  dessiner l'image
  const context = canvas.getContext('2d');

  if (context === null) {
    throw new Error('Impossible de créer le contexte 2D');
  }

  context.drawImage(image, 0, 0, width, height);

  //  exporter l'image
  return canvas.toDataURL('image/jpeg', 0.7);
}


}
