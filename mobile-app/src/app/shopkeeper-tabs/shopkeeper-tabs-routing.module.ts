import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopkeeperTabsPage } from './shopkeeper-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: ShopkeeperTabsPage,
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
      // {
      //   path: 'map',
      //   loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
      // },
      {
        path: 'shops',
        children: [
          {
            path: '',
            loadChildren: () => import('./shops/shops.module').then( m => m.ShopsPageModule)
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
        redirectTo: '/shopkeeper-tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'shops/add',
    loadChildren: () => import('./shops/add/add.module').then( m => m.AddPageModule)
  },
  {
    path: 'shops/view/:id',
    loadChildren: () => import('./shops/view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'shops/edit/:id',
    loadChildren: () => import('./shops/edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: 'add',
    loadChildren: () => import('./transactions/add/add.module').then( m => m.AddPageModule)
  },
  // {
  //   path: 'ratings',
  //   loadChildren: () => import('../shared/pages/ratings/ratings.module').then( m => m.RatingsPageModule)
  // },
  {
    path: '',
    redirectTo: '/shopkeeper-tabs/home',
    pathMatch: 'full'
  },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopkeeperTabsPageRoutingModule {}
