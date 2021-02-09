import { Component, OnInit ,Input,} from '@angular/core';

@Component({
  selector: 'app-sc-ip-simulated-td',
  templateUrl: './sc-ip-simulated-td.component.html',
  styleUrls: ['./sc-ip-simulated-td.component.scss']
})
export class ScIpSimulatedTdComponent implements OnInit {
  decimalFormat = '1.0-2';
  @Input() value: number;
  @Input() isCHG : boolean;
  constructor() { }
  ngOnInit(): void {
  }

}
