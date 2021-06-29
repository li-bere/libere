import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalTypes } from './../../core/constants/modal-types';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  modalTypes = ModalTypes

  @Input('data') data: any;

  feeCreationForm: FormGroup

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {
    this.feeCreationForm = this.formBuilder.group({
      name: [""],
      value: [""]
    })
  }

  ngOnInit(): void {
    if (this.data.fee) {
      this.feeCreationForm.patchValue(this.data.fee);
    }
  }

  updateFee() {
    this.activeModal.close(this.feeCreationForm.value);
  }

}
