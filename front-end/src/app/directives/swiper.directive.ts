import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import * as Swiper from 'swiper/dist/js/swiper.js';

@Directive({
  selector: '[appSwiper]'
})
export class SwiperDirective implements OnInit{

  @Input() startSlider;
  swiper: any = null;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.startSlider.subscribe(() => {
        this.swiper = new Swiper (this.elementRef.nativeElement, {
          slidesPerView: 'auto',
          spaceBetween: 30,
          freeMode: true
        })
    });
  }
}
