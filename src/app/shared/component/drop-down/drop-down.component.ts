import { Component, OnInit,Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Observable,
  of,
  from,
  BehaviorSubject,
  combineLatest,
  ReplaySubject,
  pipe,
} from 'rxjs';

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit {
@Input('name') name;
@Input('formControl1') formControl1 : FormControl;
@Input('filterCtrl') filterCtrl : FormControl;
@Input('filtered') filtered : ReplaySubject<any[]>;
@Input('filter_value') filter_value ;
@Input('placeholder') placeholder;
@Input('noentries') noentries

  constructor() { }

  ngOnInit(): void {
    this.filterCtrl.valueChanges.subscribe(data=>{
      console.log(data ,"data")
      this.filterValue()
       
    })
  }
  private filterValue(){
    console.log(this.filter_value , "filter value ")
    if (!this.filter_value) {
      return;
    }

    // get the search keyword
    let search = this.filterCtrl.value;
    console.log(search , "SEARCH")
    if (!search) {
      this.filtered.next(this.filter_value.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    // filter the banks
    let t  = this.filter_value.filter(data => data.toLowerCase().indexOf(search) > -1)
    console.log(t , "TTTT")
    this.filtered.next(
      
      t
    );
    // console.log(this.filtered.g , "FILERED ")

  }

}
