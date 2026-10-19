import { inject, Injectable } from '@angular/core';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { FirebaseService } from './firebase';
import { Favorites } from '../models/favorites';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private firebase = inject(FirebaseService);

  private getCurrentUid(): string {
    const user = this.firebase.auth.currentUser;
    if (!user) {
      throw new Error('NOT_AUTHENTICATED');
    }
    return user.uid;
  }

  async getFavoriteIds(uid: string): Promise<string[]> {
    const snapshot = await getDoc(doc(this.firebase.db, 'favorites', uid));
    if (!snapshot.exists()) {
      return [];
    }
    return (snapshot.data() as Favorites).filmIds;
  }

  async getMyFavoriteIds(): Promise<string[]> {
    return this.getFavoriteIds(this.getCurrentUid());
  }

  async addFavorite(filmId: string): Promise<void> {
    const ref = doc(this.firebase.db, 'favorites', this.getCurrentUid());
    await updateDoc(ref, { filmIds: arrayUnion(filmId) });
  }

  async removeFavorite(filmId: string): Promise<void> {
    const ref = doc(this.firebase.db, 'favorites', this.getCurrentUid());
    await updateDoc(ref, { filmIds: arrayRemove(filmId) });
  }
}