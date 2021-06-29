import { Injectable } from "@angular/core";

import { ToastService } from "../toast/toast.service";

import { ErrorMessageGenerator } from "../../constants/error-codes";

@Injectable({
  providedIn: "root",
})
export class ErrorhandlerService {
  constructor(private toastService: ToastService) {}

  displayErrorMessage(error) {
    if (error !== "permission-denied") {
      this.toastService.error(ErrorMessageGenerator(error));
    } else {
      return;
    }
  }
}
