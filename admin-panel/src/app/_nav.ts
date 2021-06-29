import { INavData } from "@coreui/angular";

export const navItems: INavData[] = [
  {
    name: "Dashboard",
    url: "dashboard",
    icon: "icon-speedometer",
  },
  {
    name: "Users",
    url: "users",
    icon: "fa fa-users",
    // linkProps: {
    //   queryParams: {
    //     page: 1,
    //   },
    //   preserveFragment: true,
    // },
  },
  {
    name: "Fee",
    url: "fee",
    icon: "fa fa-money",
  },
  {
    name: "Quota",
    url: "quota",
    icon: "icon-docs icons",
  },
  {
    name: "Transactions",
    url: "transactions",
    icon: "fa fa-vcard",
  },
  {
    name: "Shops",
    url: "shops",
    icon: "fa fa-building",
  },
];
