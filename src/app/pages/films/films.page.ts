import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent, IonHeader, IonItem, IonLabel, IonList, IonRouterLink,
  IonSpinner, IonThumbnail, IonTitle, IonToolbar, ToastController,
} from '@ionic/angular';
import { FilmService } from '../../services/film';
import { Film } from '../../models/film';

@Component({
  selector: 'app-films',
  templateUrl: './films.page.html',
  styleUrls: ['./films.page.scss'],
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem,
    IonLabel, IonThumbnail, IonSpinner, RouterLink, IonRouterLink,
  ],
})
export class FilmsPage {
  private filmService = inject(FilmService);
  private toastCtrl = inject(ToastController);

  films = signal<Film[]>([]);
  loading = signal(true);

  async ionViewWillEnter() {
    this.loading.set(true);
    try {
      this.films.set(await this.filmService.getAllFilms());
    } catch (error) {
      console.error('Erreur de chargement des films :', error);
      const toast = await this.toastCtrl.create({
        message: 'Impossible de charger les films.',
        duration: 3000,
        color: 'danger',
      });
      await toast.present();
    } finally {
      this.loading.set(false);
    }
  }
}