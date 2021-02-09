import { Directive,Input ,OnInit, ElementRef , Renderer2} from '@angular/core';

@Directive({
  selector: '[appTdDirective]',
  host: {
    '[class.color-danger]': '(n === "% Change" || n === "ABS Change") && value  < 0',
    '[class.color-success]': '(n === "% Change" || n === "ABS Change") && value  > 0',
  }
})
export class TdDirectiveDirective implements OnInit {
  @Input()
  n: string;
  @Input()
  value : number
  @Input() reverse : boolean

  constructor(private el: ElementRef , private renderer : Renderer2) { 
  
  }
  ngOnInit(){
    
    if(this.reverse && (this.n === "% Change" || this.n === "ABS Change")){
      let color = "green";
      if(this.value > 0){
        color = 'red'

      }
      this.renderer.setStyle(this.el.nativeElement, 'color' , color)
    }
  }

}
