import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput,
  IonItem, IonLabel, IonList, IonListHeader, IonTextarea, IonTitle,
  IonToggle, IonToolbar, ToastController,
} from '@ionic/angular';
import { AdminService } from '../../services/admin';
import { FirebaseService } from '../../services/firebase';
import { UserProfile } from '../../models/user-profile';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  imports: [
    FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
    IonBackButton, IonList, IonListHeader, IonItem, IonLabel, IonInput,
    IonTextarea, IonButton, IonToggle,
  ],
})
export class AdminPage {
  private adminService = inject(AdminService);
  private firebase = inject(FirebaseService);
  private toastCtrl = inject(ToastController);

  // Formulaire d'ajout de film
  title: string = '';
  overview: string = '';
  posterUrl: string = '';
  releaseDate: string = '';

  users = signal<UserProfile[]>([]);

  async ionViewWillEnter() {
    const myUid = this.firebase.auth.currentUser?.uid;
    const allUsers = await this.adminService.getAllUsers();
    // L'admin ne peut pas se désactiver lui-même
    this.users.set(allUsers.filter((user) => user.uid !== myUid));
  }

  async onAddFilm() {
    if (this.title.trim() === '') {
      await this.showToast('Le titre est obligatoire.', 'danger');
      return;
    }

    try {
      await this.adminService.addFilm(
        this.title.trim(),
        this.overview.trim(),
        this.posterUrl.trim(),
        this.releaseDate,
      );
      await this.showToast('Film ajouté.', 'success');
      this.title = '';
      this.overview = '';
      this.posterUrl = '';
      this.releaseDate = '';
    } catch (error) {
      console.error('Erreur ajout film :', error);
      await this.showToast("Impossible d'ajouter le film.", 'danger');
    }
  }

  async onToggleDisabled(user: UserProfile, isDisabled: boolean) {
    try {
      await this.adminService.setUserDisabled(user.uid, isDisabled);
      // Met à jour la liste affichée sans tout recharger
      this.users.set(
        this.users().map((u) => (u.uid === user.uid ? { ...u, isDisabled } : u)),
      );
      await this.showToast(
        isDisabled ? 'Utilisateur désactivé.' : 'Utilisateur réactivé.',
        'success',
      );
    } catch (error) {
      console.error('Erreur désactivation :', error);
      await this.showToast('Action impossible.', 'danger');
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2500, color });
    await toast.present();
  }
}