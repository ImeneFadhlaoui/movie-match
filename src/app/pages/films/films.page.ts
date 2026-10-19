import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonCard, IonContent, IonHeader, IonIcon, IonRouterLink, IonSearchbar,
  IonSpinner, IonTitle, IonToolbar, ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { filmOutline } from 'ionicons/icons';
import { FilmService } from '../../services/film';
import { Film } from '../../models/film';

@Component({
  selector: 'app-films',
  templateUrl: './films.page.html',
  styleUrls: ['./films.page.scss'],
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonCard,
    IonIcon, IonSpinner, RouterLink, IonRouterLink,
  ],
})
export class FilmsPage {
  private filmService = inject(FilmService);
  private toastCtrl = inject(ToastController);

  films = signal<Film[]>([]);
  loading = signal(true);
  query = signal('');

  // Recalculé automatiquement quand films() ou query() change
  filteredFilms = computed(() => {
    const search = this.query().toLowerCase().trim();
    if (search === '') {
      return this.films();
    }
    return this.films().filter((film) => film.title.toLowerCase().includes(search));
  });

  constructor() {
    addIcons({ filmOutline });
  }

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