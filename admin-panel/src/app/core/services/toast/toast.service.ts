import { Injectable } from '@angular/core';

import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toaster: ToastrService) { }

  success(message: string) {
    this.toaster.success(message, "", {
      timeOut: 3000,
      closeButton: true,
      positionClass: "toast-top-right",
      tapToDismiss: true
    });
  }

  error(message: string) {
    this.toaster.error(message, "", {
      timeOut: 3000,
      closeButton: true,
      positionClass: "toast-top-right",
      tapToDismiss: true
    });
  }
}
