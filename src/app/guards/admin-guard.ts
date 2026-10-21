import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = async () => {
  const firebaseService = inject(FirebaseService);
  const authService = inject(AuthService);
  const router = inject(Router);

  await firebaseService.auth.authStateReady();

  const profile = await authService.getCurrentProfile();

  if (profile !== null && profile.isAdmin && !profile.isDisabled) {
    return true;
  }

  router.navigate(['/tabs/films']);
  return false;
};