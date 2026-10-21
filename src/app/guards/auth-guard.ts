import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = async () => {
  const firebaseService = inject(FirebaseService);
  const authService = inject(AuthService);
  const router = inject(Router);

  await firebaseService.auth.authStateReady();

  const user = firebaseService.auth.currentUser;

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const profile = await authService.getProfile(user.uid);

  if (profile === null || profile.isDisabled === true) {
    await authService.logout();
    router.navigate(['/login']);
    return false;
  }

  return true;
};