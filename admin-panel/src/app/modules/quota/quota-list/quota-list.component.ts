import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { QuotaI } from './../../../core/models/quota';
import { ModalTypes } from "./../../../core/constants/modal-types";

import { ModalComponent } from "../../modal/modal.component";

import { QuotaService } from './../../../core/services/quota/quota.service';
import { ErrorhandlerService } from "./../../../core/services/error-handler/error-handler.service";
import { ToastService } from "./../../../core/services/toast/toast.service";

@Component({
  selector: "app-quota-list",
  templateUrl: "./quota-list.component.html",
  styleUrls: ["./quota-list.component.css"],
})
export class QuotaListComponent implements OnInit {
  loadingSpinner: boolean = true;
  quotaData: Array<QuotaI> = [];

  constructor(
    private quotaService: QuotaService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private errorHandlerService: ErrorhandlerService
  ) {}

  ngOnInit(): void {
    this.quotaService.getQuotas().subscribe((quotas) => {
      console.log(quotas);
      this.quotaData = quotas;
      this.loadingSpinner = false;
    });
  }

  showQuotaCreationModal() {
    const quotaCreationModalRef = this.modalService.open(ModalComponent);
    quotaCreationModalRef.componentInstance.data = {
      title: "Create New Quota",
      type: ModalTypes.feeCreation,
    };
    quotaCreationModalRef.result
      .then((data) => {
        this.updateQuota(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  showQuotaEditModal(fee) {
    const quotaEditModalRef = this.modalService.open(ModalComponent);
    quotaEditModalRef.componentInstance.data = {
      title: "Edit Fee",
      type: ModalTypes.feeEdit,
      fee: {
        name: fee.id,
        value: fee.value,
      },
    };
    quotaEditModalRef.result
      .then((data) => {
        this.updateQuota(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateQuota(data) {
    this.quotaService
      .updateQuota(data)
      .then(() => {
        this.toastService.success("Fee Created Successfully");
      })
      .catch((err) => {
        this.errorHandlerService.displayErrorMessage("documentCreateError");
      });
  }

  showQuotaDeleteConfirmationModal(feeId) {
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
    this.quotaService
      .deleteQuota(id)
      .then(() => {
        this.toastService.success("Fee Deleted Successfully");
      })
      .catch((err) => {
        this.errorHandlerService.displayErrorMessage("documentDeleteError");
      });
  }
}
