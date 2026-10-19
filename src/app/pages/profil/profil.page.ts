import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonAvatar, IonButton, IonChip, IonContent, IonHeader, IonIcon, IonItem,
  IonLabel, IonList, IonNote, IonRouterLink, IonSpinner, IonTitle,
  IonToolbar, NavController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  calendarOutline, logOutOutline, mailOutline, personCircleOutline,
  settingsOutline, shieldCheckmarkOutline,
} from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { UserProfile } from '../../models/user-profile';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonAvatar,
    IonChip, IonIcon, IonList, IonItem, IonLabel, IonNote, IonSpinner,
    RouterLink, IonRouterLink,
  ],
})
export class ProfilPage {
  private authService = inject(AuthService);
  private navCtrl = inject(NavController);

  profile = signal<UserProfile | null>(null);

  constructor() {
    addIcons({
      calendarOutline, logOutOutline, mailOutline, personCircleOutline,
      settingsOutline, shieldCheckmarkOutline,
    });
  }

  async ionViewWillEnter() {
    this.profile.set(await this.authService.getCurrentProfile());
  }

  async onLogout() {
    await this.authService.logout();
    await this.navCtrl.navigateRoot('/login');
  }
}