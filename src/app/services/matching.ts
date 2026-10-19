import { inject, Injectable } from '@angular/core';
import { collection, getDocs } from 'firebase/firestore';
import { FirebaseService } from './firebase';
import { AuthService } from './auth';
import { Favorites } from '../models/favorites';
import { UserProfile } from '../models/user-profile';

export interface Match {
  profile: UserProfile;
  score: number;        // entre 0 et 1
  commonCount: number;  // nombre de films en commun
}

const MATCH_THRESHOLD = 0.75;

@Injectable({
  providedIn: 'root',
})
export class MatchingService {
  private firebase = inject(FirebaseService);
  private authService = inject(AuthService);

  // Indice de Jaccard : films en commun / films différents au total
  compare(listA: string[], listB: string[]): { score: number; common: number } {
    const setA = new Set(listA);
    const setB = new Set(listB);

    let common = 0;
    for (const id of setA) {
      if (setB.has(id)) {
        common++;
      }
    }

    const total = setA.size + setB.size - common;
    const score = total === 0 ? 0 : common / total;
    return { score, common };
  }

  async getMatches(): Promise<Match[]> {
    const user = this.firebase.auth.currentUser;
    if (!user) {
      throw new Error('NOT_AUTHENTICATED');
    }

    // 1. Une seule lecture : toutes les playlists (y compris la mienne)
    const snapshot = await getDocs(collection(this.firebase.db, 'favorites'));

    const myDocument = snapshot.docs.find((document) => document.id === user.uid);
    if (!myDocument) {
      return [];
    }
    const myFilmIds = (myDocument.data() as Favorites).filmIds;
    if (myFilmIds.length === 0) {
      return [];
    }

    // 2. Calcul des scores, sans aucune requête
    const candidates: { uid: string; score: number; common: number }[] = [];
    for (const document of snapshot.docs) {
      if (document.id === user.uid) {
        continue;
      }
      const otherFilmIds = (document.data() as Favorites).filmIds;
      const result = this.compare(myFilmIds, otherFilmIds);
      if (result.score > MATCH_THRESHOLD) {
        candidates.push({ uid: document.id, score: result.score, common: result.common });
      }
    }

    // 3. Lecture des profils des candidats, en parallèle
    const profiles = await Promise.all(
      candidates.map((candidate) => this.authService.getProfile(candidate.uid)),
    );

    const matches: Match[] = [];
    candidates.forEach((candidate, index) => {
      const profile = profiles[index];
      if (profile !== null && !profile.isDisabled) {
        matches.push({ profile, score: candidate.score, commonCount: candidate.common });
      }
    });

    matches.sort((a, b) => b.score - a.score);
    return matches;
  }
}