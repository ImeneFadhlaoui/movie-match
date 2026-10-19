import { inject, Injectable } from '@angular/core';
import { collection, doc, DocumentData, getDoc, getDocs } from 'firebase/firestore';
import { FirebaseService } from './firebase';
import { Film } from '../models/film';
import { tmdbConfig } from '../../environments/tmdb';

const TMDB_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

@Injectable({
  providedIn: 'root',
})
export class FilmService {
  private firebase = inject(FirebaseService);


  private async fetchTmdb(path: string): Promise<any> {
    const url = `${TMDB_URL}${path}?api_key=${tmdbConfig.apiKey}&language=fr-FR`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('TMDB_ERROR');
    }

    return response.json();
  }

  // Convertit un film au format TMDB vers notre interface Film
  private tmdbToFilm(movie: any): Film {
    return {
      id: `tmdb_${movie.id}`,
      title: movie.title,
      overview: movie.overview,
      posterUrl: movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : '',
      releaseDate: movie.release_date ?? '',
    };
  }

  async getTmdbPopular(): Promise<Film[]> {
    const data = await this.fetchTmdb('/movie/popular');
    return data.results.map((movie: any) => this.tmdbToFilm(movie));
  }


  // Convertit un document Firestore vers notre interface Film
  private adminToFilm(documentId: string, data: DocumentData): Film {
    return {
      id: `admin_${documentId}`,
      title: data['title'],
      overview: data['overview'],
      posterUrl: data['posterUrl'],
      releaseDate: data['releaseDate'],
    };
  }

  async getAdminFilms(): Promise<Film[]> {
    const snapshot = await getDocs(collection(this.firebase.db, 'films'));
    return snapshot.docs.map((document) => this.adminToFilm(document.id, document.data()));
  }


  async getAllFilms(): Promise<Film[]> {
    const [adminFilms, tmdbFilms] = await Promise.all([
      this.getAdminFilms(),
      this.getTmdbPopular(),
    ]);
    return [...adminFilms, ...tmdbFilms];
  }

  async getFilmById(id: string): Promise<Film | null> {
    if (id.startsWith('tmdb_')) {
      const tmdbId = id.replace('tmdb_', '');
      const movie = await this.fetchTmdb(`/movie/${tmdbId}`);
      return this.tmdbToFilm(movie);
    }

    if (id.startsWith('admin_')) {
      const firestoreId = id.replace('admin_', '');
      const snapshot = await getDoc(doc(this.firebase.db, 'films', firestoreId));

      if (!snapshot.exists()) {
        return null;
      }
      return this.adminToFilm(firestoreId, snapshot.data());
    }

    return null;
  }
}