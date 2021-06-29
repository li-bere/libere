import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserTabsPage } from './user-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: UserTabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'transactions',
        children: [
          {
            path: '',
            loadChildren: () => import('./transactions/transactions.module').then( m => m.TransactionsPageModule)
          }
        ]
      },
      {
        path: 'scan',
        children: [
          {
            path: '',
            loadChildren: () => import('./scan/scan.module').then( m => m.ScanPageModule)
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/user-tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'bottles',
    loadChildren: () => import('./bottles/bottles.module').then( m => m.BottlesPageModule)
  },
  {
    path: 'bottles/add',
    loadChildren: () => import('./add-bottle/add-bottle.module').then( m => m.AddBottlePageModule)
  },
  {
    path: 'transactions/add',
    loadChildren: () => import('./transactions/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'request-fountain-registry',
    loadChildren: () => import('./request-fountain-registry/request-fountain-registry.module')
    .then( m => m.RequestFountainRegistryPageModule)
  },
  {
    path: '',
    redirectTo: '/user-tabs/home',
    pathMatch: 'full'
  },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserTabsPageRoutingModule {}
