import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { initializeApp  } from 'firebase/app'
import { getAuth, Auth} from 'firebase/auth'
import { getFirestore, Firestore} from 'firebase/firestore'

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private app = initializeApp(environment.firebaseConfig);
  public auth: Auth = getAuth(this.app);
  public db: Firestore = getFirestore(this.app);
}