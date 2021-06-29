import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Import Containers
import { DefaultLayoutComponent } from "./containers";

import { RedirectGuard } from "./core/guards/redirect/redirect.guard";
import { AuthGuard } from "./core/guards/auth/auth.guard";

import { LoginComponent } from "./modules/auth/login/login.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "",
    pathMatch: "full",
    canActivate: [RedirectGuard],
  },
  {
    path: "login",
    component: LoginComponent,
    data: {
      title: "Login Page",
    },
  },
  {
    path: "home",
    component: DefaultLayoutComponent,
    // canActivate: [AuthGuard],
    data: {
      title: "Home",
    },
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./views/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "users",
        loadChildren: () =>
          import("./modules/users/users.module").then((m) => m.UsersModule),
      },
      {
        path: "fee",
        loadChildren: () => import("./modules/fee/fee.module").then((m) => m.FeeModule)
      },
      {
        path: "quota",
        loadChildren: () => import("./modules/quota/quota.module").then((m) => m.QuotaModule)
      },
      {
        path: "transactions",
        loadChildren: () => import("./modules/transactions/transactions.module").then((m) => m.TransactionsModule)
      },
      {
        path: "shops",
        loadChildren: () => import("./modules/shops/shops.module").then((m) => m.ShopsModule)
      }
    ],
  },
  { path: "**", component: DefaultLayoutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
