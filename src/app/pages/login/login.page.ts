import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonList, IonRouterLink, IonTitle, IonToolbar, NavController, ToastController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FirebaseError } from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, RouterLink, IonRouterLink,IonInput,IonItem,IonList]
})
export class LoginPage   {

  email: string = '';
  password: string = '';

  private authService = inject(AuthService);
  private navCtrl = inject(NavController);
  private toastCtrl = inject(ToastController);


  private async showError(message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'bottom'
    })

    await toast.present();
  }

  async onLogin(){
    try{
      await this.authService.login(this.email, this.password);
      await this.navCtrl.navigateRoot('/tabs/films');
    
    }catch(error: unknown){
      console.error('Erreur lors de la connexion :', error);

      if(error instanceof FirebaseError){
        switch (error.code) {
          case 'auth/invalid-credential':
            case 'auth/wrong-password':
              case 'auth/user-not-found':
                await this.showError(
                  'Adresse e-mail ou mot de passe incorrect.'
                );
                break;
          case 'auth/invalid-email':
            await this.showError(
              'Veuillez saisir une adresse e-mail valide.'
            );
            break;
          case 'auth/too-many-requests':
            await this.showError(
              'Trop de tentatives. Veuillez réessayer plus tard.'
            );
            break;
          
          default:
            await this.showError(
              'Une erreur est survenue. Veuillez réessayer.'
            );
        }
      } else if (error instanceof Error) {
        switch (error.message){
          case 'PROFILE_NOT_FOUND':
            await this.showError(
              'Votre compte utilisateur est introuvable.'
            );
            break;

          case 'ACCOUNT_DISABLED':
            await this.showError(
              'Votre compte a été désactivé par un administrateur.'
            );
            break;

          default: 
          await this.showError(
            'Une erreur est survenue. Veuillez réessayer.'
          );
        }
      } else { 
        await this.showError(
          'Une erreur inattendue est survenue.'
        );
      }

    }
  }

  

}
