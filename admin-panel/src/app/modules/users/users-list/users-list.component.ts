import { Component, OnInit } from "@angular/core";

import { ActivatedRoute, Router } from "@angular/router";

import { Subject } from "rxjs";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";

import * as queryString from "query-string";

import { FilterType } from "./../../../core/constants/filter-type";

import { ModalComponent } from "./../../modal/modal.component";

import { AuthService } from "./../../../core/services/auth/auth.service";
import { UsersService } from "./../../../core/services/users/users.service";
import { ErrorhandlerService } from "./../../../core/services/error-handler/error-handler.service";
import { ToastService } from "./../../../core/services/toast/toast.service";
import { PaginationService } from "./../../../core/services/pagination/pagination.service";
import { ModalTypes } from "./../../../core/constants/modal-types";

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.css"],
})
export class UsersListComponent implements OnInit {
  obj = Object;

  queryString: any;
  // dtOptions: DataTables.Settings = {
  //   paging: false,
  //   info: false,
  //   searching: false,
  //   order: [],
  //   retrieve: true,
  //   language: {
  //     zeroRecords: " "
  //   },
  //   columnDefs: [
  //     {
  //       targets: [0, 6],
  //       orderable: false
  //     }
  //   ]
  // };
  // dtTrigger: Subject<any> = new Subject();
  usersData: Array<any> = [];
  // userIds: Array<any> = [];
  loadingSpinner: boolean = true;
  // profile: any = {};
  // isOpen: boolean = true;
  // isShowFilter: Boolean = false;
  // isChatExits: boolean;
  // chatId: string;
  // userId: string;
  // filters: any = {};
  // blockUserStatus: boolean;
  // payments: Array<any> = [];
  // pageNum: number = 1;
  // totalItems: number = 0;
  // itemsPerPage: number = 5;
  // lastSnapShot: any;
  // firstSnapShot: any;
  // isFilterPage: boolean = false;
  // isParam: boolean = false;
  // disable_prev: boolean = false;
  // disable_next: boolean = false;

  constructor(
    private usersService: UsersService,
    private toastService: ToastService,
    private modalService: NgbModal,
    // private router: Router,
    // private authService: AuthService,
    // private chatService: ChatService,
    // private location: Location,
    // private activatedRoute: ActivatedRoute,
    // private paginationService: PaginationService,
    private errorHandlerService: ErrorhandlerService
  ) {
    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.filters = params;
    //   this.pageNum = parseInt(params["page"]);
    // });
    // let copied = Object.assign({}, this.filters);
    // delete copied.page;
    // this.filters = copied;
    // this.paginationService.getCollectionSize("users").then(size => {
    //   this.totalItems = size;
    // });
  }

  ngOnInit() {
    // const isEmpty = Object.values(this.filters).every(
    //   x => x === null || x === ""
    // );
    // if (!isEmpty && this.filters.type) {
    //   this.applyFilter(this.filters);
    //   this.isShowFilter = true;
    //   this.isParam = true;
    // } else {
    //   this.userList();
    // }
    this.usersService.getUsers().subscribe((users) => {
      console.log(users);
      this.usersData = users;
      this.loadingSpinner = false;
    });
  }

  showUserDeleteConfirmationModal(user) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.data = {
      title: "Delete Confirmation",
      content: "Please confirm that you want to delete this user?",
      type: ModalTypes.confirmation,
    };
    modalRef.result
      .then((result) => {
        this.deleteAuthUser(user).subscribe(
          () => {
            this.deleteUser(user)
              .then(() => {
                this.toastService.success("User has been deleted Successfully");
              })
              .catch(() => {
                this.handleError("documentDeleteError");
              });
          },
          (error) => {
            this.handleError("documentDeleteError");
          }
        );
      })
      .catch((result) => {
        console.log(result);
      });
  }

  deleteAuthUser(user) {
    return this.usersService.deleteAuthenticatedUser(user);
  }

  deleteUser(user) {
    return this.usersService.deleteUserFromFirestore(user.id);
  }

  showToggleUserBlockModal(userId, isBlocking: boolean) {
    const modalTitle = isBlocking ? "Confirm Block" : "Confirm unblock";
    const modalContent = isBlocking
      ? "Are you sure you want to block this user"
      : "Are you sure you want to unblock this user";

    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.data = {
      title: modalTitle,
      content: modalContent,
      type: ModalTypes.confirmation,
    };

    modalRef.result
      .then((result) => {
        if (result === "yes") this.toggleUserBlock(userId, isBlocking);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  toggleUserBlock(id, isBlocking: boolean) {
    const data = { userId: id, blockStatus: isBlocking };
    const successMsg = isBlocking
      ? "User has been blocked Successfully"
      : "User has been unblocked Successfully";
    this.usersService.toggleUserBlockStatus(data).subscribe(
      () => {
        this.toastService.success(successMsg);
      },
      (error) => {
        this.handleError("documentDeleteError");
      }
    );
  }

  handleError(errMsg: string) {
    this.errorHandlerService.displayErrorMessage(errMsg);
  }

  // sortBy(value) {
  //   this.userService.sorting(value).subscribe(
  //     sorting => {
  //       this.usersData = sorting;
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   );
  // }

  // applyFilter(filters: any) {
  //   this.filters = filters;
  //   let copied = Object.assign({}, this.filters);
  //   delete copied.page;
  //   this.isFilterPage = true;
  //   let queryStr = queryString.stringify(copied);
  //   this.queryString = queryStr;
  //   //  if(!this.isParam){
  //   this.location.go(`home/users?page=${this.pageNum}&${queryStr}`);
  //   //  }
  //   if (
  //     filters.type == FilterType.all &&
  //     filters.name == "" &&
  //     filters.phone == "" &&
  //     filters.email == "" &&
  //     filters.from == 0 &&
  //     filters.to == 0
  //   ) {
  //     this.userList();
  //   } else {
  //     this.filterPaginationCursors(this.pageNum).then(cursors => {
  //       this.userService
  //         .filteredUser(this.filters, this.pageNum, cursors)
  //         .subscribe(
  //           (user: any) => {
  //             this.usersData = user;
  //             this.loadingSpinner = false;
  //           },
  //           error => {
  //             this.errorHandlerService.displayErrorMessage(error.code);
  //             this.loadingSpinner = false;
  //             console.log(error);
  //           }
  //         );
  //     });
  //   }
  // }

  // userList() {
  //   this.getPaginationCursors(this.pageNum).then((cursors: any) => {
  //     this.paginationService
  //       .getCollection("users", "createdAt", this.pageNum, cursors.lastSnapshot)
  //       .subscribe(
  //         users => {
  //           this.usersData = users;
  //           this.loadingSpinner = false;
  //           // this.dtTrigger.next();
  //         },
  //         error => {
  //           this.errorHandlerService.displayErrorMessage(error.code);
  //           this.loadingSpinner = false;
  //         }
  //       );
  //   });
  // }

  // getPaginationCursors(pageNum) {
  //   return new Promise((resolve, reject) => {
  //     let results = this.paginationService.getPaginationQueryCursors(
  //       "users",
  //       "createdAt",
  //       pageNum
  //     );
  //     results.subscribe(cursorDocs => {
  //       let queryCursors = {
  //         firstSnapshot: cursorDocs[0],
  //         lastSnapshot: cursorDocs[cursorDocs.length - 1]
  //       };
  //       resolve(queryCursors);
  //     });
  //   });
  // }

  // filterPaginationCursors(pageNum) {
  //   return new Promise((resolve, reject) => {
  //     let results = this.userService.filterPaginationQueryCursors(
  //       this.filters,
  //       pageNum
  //     );
  //     results.subscribe(cursorDocs => {
  //       let queryCursors = {
  //         firstSnapshot: cursorDocs[0],
  //         lastSnapshot: cursorDocs[cursorDocs.length - 1]
  //       };
  //       resolve(queryCursors);
  //     });
  //   });
  // }

  // nextPageFilterData() {
  //   this.pageNum++;
  //   this.filterPaginationCursors(this.pageNum)
  //     .then(cursors => {
  //       this.userService.filterPageNext(this.filters, cursors).subscribe(
  //         res => {
  //           this.usersData = res;
  //         },
  //         error => {
  //           console.log(error);
  //         }
  //       );
  //     })
  //     .catch(eror => {
  //       this.errorHandlerService.displayErrorMessage(eror.code);
  //       console.log(eror);
  //     });
  // }

  // previousPageFilterData() {
  //   this.pageNum--;
  //   this.filterPaginationCursors(this.pageNum)
  //     .then(cursors => {
  //       this.userService.filterPagePrevious(this.filters, cursors).subscribe(
  //         res => {
  //           this.usersData = res;
  //         },
  //         error => {
  //           console.log(error);
  //         }
  //       );
  //     })
  //     .catch(eror => {
  //       console.log(eror);
  //     });
  // }

  // nextPage() {
  //   this.pageNum++;
  //   this.loadingSpinner = true;
  //   this.getPaginationCursors(this.pageNum).then((cursors: any) => {
  //     this.paginationService
  //       .nextPageData("users", "createdAt", cursors.lastSnapshot)
  //       .subscribe(
  //         data => {
  //           this.usersData = data;
  //           this.loadingSpinner = false;
  //         },
  //         error => {
  //           this.errorHandlerService.displayErrorMessage(error.code);
  //           this.loadingSpinner = false;
  //         }
  //       );
  //   });
  // }

  // prevPage() {
  //   this.pageNum--;
  //   this.loadingSpinner = true;
  //   this.getPaginationCursors(this.pageNum + 1).then((cursors: any) => {
  //     this.paginationService
  //       .previousPageData("users", "createdAt", cursors.lastSnapshot)
  //       .subscribe(
  //         profiles => {
  //           this.usersData = profiles;
  //           this.loadingSpinner = false;
  //         },
  //         error => {
  //           console.log(error);
  //           this.loadingSpinner = false;
  //         }
  //       );
  //   });
  // }

  // onPageChanged(event) {
  //   this.pageNum = event.page;
  //   if (this.isFilterPage) {
  //     this.location.go(`home/users?page=${this.pageNum}&${this.queryString}`);
  //   } else {
  //     this.location.go(`home/users?page=${this.pageNum}`);
  //   }
  // }

  // chatNav(user) {
  //   let data = {
  //     userId: user.id,
  //     adminId: this.authService.currentUserId,
  //     isOpen: this.isOpen
  //   };
  //   this.chatService.getChat(this.authService.currentUserId, user.id).subscribe(
  //     (chat: Array<ChatI>) => {
  //       chat.find(result => {
  //         this.chatId = result.id;
  //         console.log("result", result);
  //         this.userId = result.userId;
  //       });
  //       if (this.userId === user.id) {
  //         this.isChatExits = true;
  //         this.router.navigate(["home/users/chat"], {
  //           queryParams: {
  //             chatId: this.chatId,
  //             userId: user.id,
  //             adminId: this.authService.currentUserId
  //           }
  //         });
  //       } else {
  //         this.isChatExits = false;
  //         this.createChat(data);
  //         return;
  //       }
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   );
  // }

  // createChat(data) {
  //   if (!this.isChatExits) {
  //     this.chatService
  //       .createChat(data)
  //       .then(response => {})
  //       .catch(error => {
  //         console.log(error);
  //       });
  //   }
  // }

  // confirm(data) {
  //   const modalRef = this.modalService.open(ModalComponent);
  //   modalRef.componentInstance.data = {
  //     title: "Delete Confirmation",
  //     content: "Are you sure that you want to Delete ?",
  //     type: "confirmation"
  //   };
  //   modalRef.result
  //     .then(result => {
  //       if (result == "yes") {
  //         this.deleteAuthUser(data);
  //       }
  //     })
  //     .catch(result => {
  //       console.log(result);
  //     });
  // }

  // deleteAuthUser(data) {
  //   this.userService
  //     .deleteFirebaseAuthUser(data)
  //     .then(() => {
  //       this.userService
  //         .deleteUser(data.id)
  //         .then(res => {
  //           this.toastService.success("User Deleted Successfully");
  //         })
  //         .catch(error => {
  //           console.log(error);
  //         });
  //     })
  //     .catch(error => {
  //       this.errorHandlerService.displayErrorMessage("documentDeleteError");
  //     });
  // }

  // blockUser(data) {
  //   this.profile = data;
  //   this.profile.blockedUser = true;
  //   this.userService
  //     .blockFirebaseAuthUser({ data: this.profile, unblock: false })
  //     .then(res => {
  //       this.toastService.success("User Blocked Successfully");
  //     })
  //     .catch(error => {
  //       this.errorHandlerService.displayErrorMessage("documentUpdateError");
  //       console.log(error);
  //     });
  // }

  // unblockUser(data) {
  //   this.profile = data;
  //   this.profile.blockedUser = false;
  //   this.userService
  //     .blockFirebaseAuthUser({ data: this.profile, unblock: true })
  //     .then(res => {
  //       console.log(res);
  //       this.blockUserStatus = false;
  //       this.toastService.success("User Unblocked Successfully");
  //     })
  //     .catch(err => {
  //       this.errorHandlerService.displayErrorMessage("documentUpdateError");
  //     });
  // }

  // blockUserConform(data, status) {
  //   if (status) {
  //     const modalRef = this.modalService.open(ModalComponent);
  //     modalRef.componentInstance.data = {
  //       title: "UnBlock Confirmation",
  //       content: "Are you sure that you want to unblock user ?",
  //       type: "confirmation"
  //     };
  //     modalRef.result
  //       .then(result => {
  //         if (result == "yes") {
  //           this.unblockUser(data);
  //         }
  //       })
  //       .catch(result => {
  //         console.log(result);
  //       });
  //   } else {
  //     const modalRef = this.modalService.open(ModalComponent);
  //     modalRef.componentInstance.data = {
  //       title: "Block Confirmation",
  //       content: "Are you sure that you want to block user ?",
  //       type: "confirmation"
  //     };
  //     modalRef.result
  //       .then(result => {
  //         if (result == "yes") {
  //           this.blockUser(data);
  //         }
  //       })
  //       .catch(result => {
  //         console.log(result);
  //       });
  //   }
  // }

  // openFilterModal() {
  //   let ngbModalOptions: NgbModalOptions = {
  //     backdrop: "static",
  //     keyboard: false
  //   };
  //   const modalRef = this.modalService.open(ModalComponent, ngbModalOptions);
  //   modalRef.componentInstance.data = {
  //     title: "Filters ",
  //     content: "",
  //     type: "filtersUser",
  //     queryParamsFilters: this.filters
  //   };
  //   modalRef.result
  //     .then(result => {
  //       console.log(result);
  //       if (result !== "no") {
  //         this.applyFilter(result);
  //       }
  //     })
  //     .catch(result => {
  //       console.log(result);
  //     });
  // }

  // viewUserProfile(userId) {
  //   this.router.navigate(["home/users/view"], {
  //     queryParams: { userId: userId }
  //   });
  // }
}
