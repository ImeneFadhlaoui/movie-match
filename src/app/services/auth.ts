import { inject, Injectable } from '@angular/core';
import { FirebaseService } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
  photo: string,
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
    photoURL: photo,
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



  async login(email: string, password: string): Promise<UserProfile> {
    const credential = await signInWithEmailAndPassword(
      this.firebase.auth,
      email,
      password,
    );

    const profile = await this.getProfile(credential.user.uid);

    if (profile === null) {
      await signOut(this.firebase.auth);
      throw new Error('PROFILE_NOT_FOUND');
    }

    if (profile.isDisabled === true) {
      await signOut(this.firebase.auth);
      throw new Error('ACCOUNT_DISABLED');
    }

    return profile;
  }

  async logout(): Promise<void> {
    await signOut(this.firebase.auth);
  }

  async getProfile(uid: string): Promise<UserProfile | null> {
    const profileRef = doc(this.firebase.db, 'users', uid);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      return null;
    }

    return profileSnap.data() as UserProfile;
  }
}
