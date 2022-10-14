import {Directive, ElementRef, HostListener, Input} from "@angular/core";

@Directive({
  selector: '[appColor]'
})
export class ColorDirective {

  @Input() col:any;
  @Input() currentCol:number;
  @Input() currentRow:number;
  @Input() indexRow:number;
  @Input() indexCol:number;

  constructor(private el: ElementRef) {

    if(this.currentCol == this.indexCol && this.currentRow == this.indexRow){
      console.log(this)
      this.el.nativeElement.style.className = "active";
    }
  }

  @HostListener('click') onMouseEnter() {
    this.highlight('yellow');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {


    this.el.nativeElement.style.backgroundColor = "yellow";
  }

}
