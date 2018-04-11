import { Directive, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appEndNgFor]'
})
export class EndNgForDirective implements OnInit {

  @Input() last: number;
  @Input() startSlider: any;

  constructor() { }

  ngOnInit(): void {
    if (this.last) {
      this.startSlider.emit();
    }
  }

}
