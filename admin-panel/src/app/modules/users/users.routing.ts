import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";


import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersListComponent } from './users-list/users-list.component';

const routes: Routes = [
  {
    path: "",
    component: UsersListComponent
  },
  {
    path: "view-user",
    component: UserProfileComponent
  },
  // {
  //   path: "editUser",
  //   component: EdituserComponent
  // },
  // {
  //   path: "chat",
  //   component: ChatComponent
  // }
  // {
  //   path:'payments',
  //   component:UserpaymentsComponent
  // },
  // {
  //   path:'detail',
  //   component:PaymentdetailComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
