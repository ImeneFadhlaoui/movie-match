import { inject, Injectable } from '@angular/core';
import { FirebaseService } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Favorites } from '../models/favorites';
import { UserProfile } from '../models/user-profile';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebase = inject(FirebaseService);

  async register(
    email: string,
    password: string,
    nom: string,
    prenom: string,
    age: number,
  ) {
    const credential = await createUserWithEmailAndPassword(
      this.firebase.auth,
      email,
      password,
    );
    const uid = credential.user.uid;

    const profile: UserProfile = {
      uid: uid,
      nom,
      prenom,
      age,
      photoURL: '',
      email,
      isAdmin: false,
      isDisabled: false,
      createdAt: new Date(),
    };
    await setDoc(doc(this.firebase.db, 'users', uid), profile);

    const favorites: Favorites = {
      uid: uid,
      filmIds: [],
    };

    await setDoc(doc(this.firebase.db, 'favorites', uid), favorites);
    return credential.user;
  }
}
