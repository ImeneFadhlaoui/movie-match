import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase';

export const authGuard: CanActivateFn = async () => {

  const firebaseService = inject(FirebaseService);
  const router = inject(Router);


  await firebaseService.auth.authStateReady();

  if(firebaseService.auth.currentUser){
    return true;
  }

  return router.createUrlTree(['/login']);

};
