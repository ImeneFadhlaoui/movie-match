import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel,
  IonList, IonRouterLink, IonThumbnail, IonTitle, IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { FilmService } from '../../services/film';
import { FavoritesService } from '../../services/favorites';
import { Film } from '../../models/film';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
    IonThumbnail, IonButton, IonIcon, RouterLink, IonRouterLink,
  ],
})
export class PlaylistPage {
  private filmService = inject(FilmService);
  private favoritesService = inject(FavoritesService);

  films = signal<Film[]>([]);

  constructor() {
    addIcons({ trashOutline });
  }

  async ionViewWillEnter() {
    const favoriteIds = await this.favoritesService.getMyFavoriteIds();

    const films: Film[] = [];
    for (const id of favoriteIds) {
      const film = await this.filmService.getFilmById(id);
      if (film) {
        films.push(film);
      }
    }
    this.films.set(films);
  }

  async remove(filmId: string) {
    await this.favoritesService.removeFavorite(filmId);
    this.films.set(this.films().filter((film) => film.id !== filmId));
  }
}