import { Component, OnInit } from "@angular/core";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ErrorhandlerService } from "./../../../core/services/error-handler/error-handler.service";
import { ToastService } from "./../../../core/services/toast/toast.service";
import { FeeService } from "./../../../core/services/fee/fee.service";

import { FeeI } from "./../../../core/models/fee";
import { ModalTypes } from "./../../../core/constants/modal-types";

import { ModalComponent } from "../../modal/modal.component";

@Component({
  selector: "app-fee-list",
  templateUrl: "./fee-list.component.html",
  styleUrls: ["./fee-list.component.css"],
})
export class FeeListComponent implements OnInit {
  loadingSpinner: boolean = true;

  feeData: Array<FeeI> = [];

  constructor(
    private feeService: FeeService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private errorHandlerService: ErrorhandlerService
  ) {}

  ngOnInit(): void {
    this.feeService.getFees().subscribe((fee) => {
      console.log(fee);
      this.feeData = fee;
      this.loadingSpinner = false;
    });
  }

  showFeeCreationModal() {
    const feeCreationModalRef = this.modalService.open(ModalComponent);
    feeCreationModalRef.componentInstance.data = {
      title: "Create New Fee",
      type: ModalTypes.feeCreation,
    };
    feeCreationModalRef.result
      .then((data) => {
        this.updateFee(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  showFeeEditModal(fee) {
    const feeEditModalRef = this.modalService.open(ModalComponent);
    feeEditModalRef.componentInstance.data = {
      title: "Edit Fee",
      type: ModalTypes.feeEdit,
      fee: {
        name: fee.id,
        value: fee.value,
      },
    };
    feeEditModalRef.result
      .then((data) => {
        this.updateFee(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateFee(data) {
    this.feeService
      .updateFee(data)
      .then(() => {
        this.toastService.success("Fee Created Successfully");
      })
      .catch((err) => {
        this.errorHandlerService.displayErrorMessage("documentCreateError");
      });
  }

  showFeeDeleteConfirmationModal(feeId) {
    const feeDeleteModalRef = this.modalService.open(ModalComponent);
    feeDeleteModalRef.componentInstance.data = {
      title: "Delete Fee",
      content: "Are you sure you want to delete this fee?",
      type: ModalTypes.confirmation,
    };
    feeDeleteModalRef.result
      .then(() => {
        this.deleteFee(feeId);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteFee(id) {
    this.feeService
      .deleteFee(id)
      .then(() => {
        this.toastService.success("Fee Deleted Successfully");
      })
      .catch((err) => {
        this.errorHandlerService.displayErrorMessage("documentDeleteError");
      });
  }
}
