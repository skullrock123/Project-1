import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthGaurdService } from '../services/auth-gaurd.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthGaurdService)
  const router = inject(Router)
  if(authService.loginStatus()){
    return true
  }
  else{
    router.navigateByUrl('/login')
    return false
  }

};
