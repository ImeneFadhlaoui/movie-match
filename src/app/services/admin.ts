import { inject, Injectable } from '@angular/core';
import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { FirebaseService } from './firebase';
import { UserProfile } from '../models/user-profile';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private firebase = inject(FirebaseService);

  async getAllUsers(): Promise<UserProfile[]> {
    const snapshot = await getDocs(collection(this.firebase.db, 'users'));
    return snapshot.docs.map((document) => document.data() as UserProfile);
  }

  async setUserDisabled(uid: string, isDisabled: boolean): Promise<void> {
    await updateDoc(doc(this.firebase.db, 'users', uid), { isDisabled });
  }

  async addFilm(
    title: string,
    overview: string,
    posterUrl: string,
    releaseDate: string,
  ): Promise<void> {
    await addDoc(collection(this.firebase.db, 'films'), {
      title,
      overview,
      posterUrl,
      releaseDate,
    });
  }
}