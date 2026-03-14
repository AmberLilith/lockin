import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { user } from '@angular/fire/auth';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const currentUser = await firstValueFrom(user(auth));

  if (currentUser) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};