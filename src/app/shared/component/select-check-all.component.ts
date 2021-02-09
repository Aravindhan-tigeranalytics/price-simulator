import { Component, Input, OnInit } from '@angular/core';
import { NgModel , FormControl } from '@angular/forms';
// import { MatCheckboxChange } from '@angular/material'
import {MatCheckboxChange} from "@angular/material/checkbox"

@Component({
  selector: 'app-select-check-all',
  template: `
    <mat-checkbox class="mat-option"
                [disableRipple]="true"
                [indeterminate]="isIndeterminate()"
                [checked]="isChecked()"
                (click)="$event.stopPropagation()"
                (change)="toggleSelection($event)">
      {{text}}
    </mat-checkbox>
  `,
  styles: ['']
})
export class SelectCheckAllComponent implements OnInit {
  @Input() model: FormControl;
  @Input() values = [];
  @Input() text = 'All';

  constructor() { }

  ngOnInit() {
    // console.log(this.model , "MODEL ")
    // console.log(this.values , "VALUES ")
  }

  isChecked(): boolean {
    return this.model.value && this.values.length
      && this.model.value.length === this.values.length;
  }

  isIndeterminate(): boolean {
    return this.model.value && this.values.length && this.model.value.length
      && this.model.value.length < this.values.length;
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.model.patchValue(this.values);
    } else {
      this.model.patchValue([]);
    }
  }
}
