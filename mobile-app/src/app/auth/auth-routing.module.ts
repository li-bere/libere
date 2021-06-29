import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@app/core/guards/auth.guard';
import { NoAuthGuard } from '@app/core/guards/no-auth.guard';
import { AuthPage } from './auth.page';
// import { NoUserGuard } from '@app/core/guards/no-user.guard';

// import { AuthPage } from './auth.page';

const routes: Routes = [
  {
    path: '',
    component: AuthPage
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canActivate: [NoAuthGuard],
    /* data: { authGuardPipe: redirectAuthenticatedToHome }, */
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule),
    canActivate: [NoAuthGuard],
    /* canActivate: [AuthGuard], */
    /* data: { authGuardPipe: redirectAuthenticatedToHome }, */
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule),
    canActivate: [NoAuthGuard],
    /* canActivate: [AuthGuard], */
    /* data: { authGuardPipe: redirectAuthenticatedToHome }, */
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./verify-email/verify-email.module').then(m => m.VerifyEmailPageModule),
    canActivate: [AuthGuard],
    /* canActivate: [AuthGuard], */
    /* data: { authGuardPipe: redirectHomeOrLogin }, */
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
