import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonAvatar, IonButton, IonContent, IonHeader, IonItem, IonLabel,
  IonList, IonRouterLink, IonTitle, IonToolbar, NavController,
} from '@ionic/angular';
import { AuthService } from '../../services/auth';
import { UserProfile } from '../../models/user-profile';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonAvatar,
    IonList, IonItem, IonLabel, RouterLink, IonRouterLink,
  ],
})
export class ProfilPage {
  private authService = inject(AuthService);
  private navCtrl = inject(NavController);

  profile = signal<UserProfile | null>(null);

  async ionViewWillEnter() {
    this.profile.set(await this.authService.getCurrentProfile());
  }

  async onLogout() {
    await this.authService.logout();
    await this.navCtrl.navigateRoot('/login');
  }
}