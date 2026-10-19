import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader,
  IonIcon, IonTitle, IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import { FilmService } from '../../services/film';
import { FavoritesService } from '../../services/favorites';
import { Film } from '../../models/film';

@Component({
  selector: 'app-film-detail',
  templateUrl: './film-detail.page.html',
  styleUrls: ['./film-detail.page.scss'],
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
    IonBackButton, IonButton, IonIcon,
  ],
})
export class FilmDetailPage implements OnInit {
  // Rempli automatiquement depuis l'URL grâce à withComponentInputBinding()
  id = input.required<string>();

  private filmService = inject(FilmService);
  private favoritesService = inject(FavoritesService);

  film = signal<Film | null>(null);
  isFavorite = signal(false);

  constructor() {
    addIcons({ heart, heartOutline });
  }

  async ngOnInit() {
    this.film.set(await this.filmService.getFilmById(this.id()));
    const favoriteIds = await this.favoritesService.getMyFavoriteIds();
    this.isFavorite.set(favoriteIds.includes(this.id()));
  }

  async toggleFavorite() {
    if (this.isFavorite()) {
      await this.favoritesService.removeFavorite(this.id());
    } else {
      await this.favoritesService.addFavorite(this.id());
    }
    this.isFavorite.set(!this.isFavorite());
  }
}