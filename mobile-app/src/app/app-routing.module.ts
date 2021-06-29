import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/core/guards/auth.guard';
import { EmailGuard } from '@app/core/guards/email.guard';
import { UserGuard } from '@app/core/guards/user.guard';
import { NoUserGuard } from '@app/core/guards/no-user.guard';
import { RoleShopkeeperGuard } from './core/guards/role-shopkeeper.guard';
import { RoleUserGuard } from './core/guards/role-user.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'user',
    loadChildren: () => import('./shared/pages/user/user.module').then( m => m.UserPageModule),
    canActivate: [AuthGuard, EmailGuard, NoUserGuard],
    /* data: { authGuardPipe: redirectUnauthenticatedToLoginOrVerify } */
  },
  {
    path: 'settings',
    loadChildren: () => import('./shared/pages/settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthGuard, EmailGuard, UserGuard],
    /* data: { authGuardPipe: redirectUnauthenticatedToLoginOrVerify } */
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./shared/pages/contact-us/contact-us.module').then( m => m.ContactUsPageModule),
    canActivate: [AuthGuard, EmailGuard, UserGuard],
    /* data: { authGuardPipe: redirectUnauthenticatedToLoginOrVerify } */
  },
  {
    path: 'user-tabs',
    loadChildren: () => import('./user-tabs/user-tabs.module').then( m => m.UserTabsPageModule),
    canActivate: [AuthGuard, EmailGuard, UserGuard],
    /* canLoad: [RoleUserGuard] */
    /* data: { authGuardPipe: redirectUnauthenticatedToLoginOrVerify } */
  },
  {
    path: 'shopkeeper-tabs',
    loadChildren: () => import('./shopkeeper-tabs/shopkeeper-tabs.module').then( m => m.ShopkeeperTabsPageModule),
    canActivate: [AuthGuard, EmailGuard, UserGuard, RoleShopkeeperGuard],
    /* canLoad: [RoleShopkeeperGuard] */
    /* data: { authGuardPipe: redirectUnauthenticatedToLoginOrVerify } */
  },
  {
    path: 'user-tabs-map',
    loadChildren: () => import('../app/user-tabs/map/map.module').then( m => m.MapPageModule),
    canActivate: [AuthGuard, EmailGuard, UserGuard],
  },
  {
    path: 'shopkeeper-tabs-map',
    loadChildren: () => import('../app/shopkeeper-tabs/map/map.module').then( m => m.MapPageModule),
    canActivate: [AuthGuard, EmailGuard, UserGuard, RoleShopkeeperGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule),
    canActivate: [NoAuthGuard],
    // data: { preload: true },
  },
  {
    path: 'profile',
    loadChildren: () => import('./shared/pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard, EmailGuard, UserGuard],
  },
  {
    path: 'ratings',
    loadChildren: () => import('./shared/pages/ratings/ratings.module').then( m => m.RatingsPageModule),
    canActivate: [AuthGuard, EmailGuard, UserGuard],
  },
  {
    path: 'view-shop',
    loadChildren: () => import('./user-tabs/view-shop/view-shop.module').then( m => m.ViewShopPageModule),
    canActivate: [AuthGuard, EmailGuard, UserGuard],
  },
  {
    path: 'shop-transactions',
    loadChildren: () => import('./shopkeeper-tabs/shop-transactions/shop-transactions.module').then( m => m.ShopTransactionsPageModule),
    canActivate: [AuthGuard, EmailGuard, UserGuard],
  },
  {
    path: 'confirm-transaction',
    loadChildren: () => import('./user-tabs/transactions/confirm-transaction/confirm-transaction.module').then( m => m.ConfirmTransactionPageModule),
    canActivate: [AuthGuard, EmailGuard, UserGuard],
  },
  { 
    path: 'non-verified',
    loadChildren: () => import('./shared/pages/non-verified/non-verified.module').then( m => m.NonVerifiedPageModule),
    canActivate: [AuthGuard, EmailGuard, UserGuard],
  },
  {
    path: 'ranking',
    loadChildren: () => import('./shared/pages/ranking/ranking.module').then( m => m.RankingPageModule),
    canActivate: [AuthGuard, EmailGuard, UserGuard],
  },  {
    path: 'shop-ranking',
    loadChildren: () => import('./shared/pages/shop-ranking/shop-ranking.module').then( m => m.ShopRankingPageModule)
  },



  // {
  //   path: '',
  //   redirectTo: '/auth',
  //   pathMatch: 'full'
  // }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
