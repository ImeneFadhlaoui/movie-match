import { inject, Injectable } from '@angular/core';
import { collection, getDocs } from 'firebase/firestore';
import { FirebaseService } from './firebase';
import { FavoritesService } from './favorites';
import { AuthService } from './auth';
import { Favorites } from '../models/favorites';
import { UserProfile } from '../models/user-profile';

export interface Match {
  profile: UserProfile;
  score: number; // entre 0 et 1
}

const MATCH_THRESHOLD = 0.75;

@Injectable({
  providedIn: 'root',
})
export class MatchingService {
  private firebase = inject(FirebaseService);
  private favoritesService = inject(FavoritesService);
  private authService = inject(AuthService);

  computeScore(listA: string[], listB: string[]): number {
    const setA = new Set(listA);
    const setB = new Set(listB);

    let common = 0;
    for (const id of setA) {
      if (setB.has(id)) {
        common++;
      }
    }

    const total = setA.size + setB.size - common;
    if (total === 0) {
      return 0;
    }
    return common / total;
  }

  async getMatches(): Promise<Match[]> {
    const user = this.firebase.auth.currentUser;
    if (!user) {
      throw new Error('NOT_AUTHENTICATED');
    }

    const myFilmIds = await this.favoritesService.getFavoriteIds(user.uid);
    if (myFilmIds.length === 0) {
      return [];
    }

    const snapshot = await getDocs(collection(this.firebase.db, 'favorites'));
    const matches: Match[] = [];

    for (const document of snapshot.docs) {
      // On ne se compare pas à soi-même
      if (document.id === user.uid) {
        continue;
      }

      const otherFilmIds = (document.data() as Favorites).filmIds;
      const score = this.computeScore(myFilmIds, otherFilmIds);

      if (score > MATCH_THRESHOLD) {
        const profile = await this.authService.getProfile(document.id);
        // On n'affiche pas les comptes désactivés
        if (profile !== null && !profile.isDisabled) {
          matches.push({ profile, score });
        }
      }
    }

    // Les meilleurs matchs en premier
    matches.sort((a, b) => b.score - a.score);
    return matches;
  }
}