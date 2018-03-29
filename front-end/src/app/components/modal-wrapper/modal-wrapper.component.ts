import { Component, OnInit, HostBinding, HostListener, Input, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-modal-wrapper',
  templateUrl: './modal-wrapper.component.html',
  styleUrls: ['./modal-wrapper.component.scss']
})
export class ModalWrapperComponent implements OnInit {

  @HostBinding('class.close-overlay') closeModBody: boolean = false;
  @HostBinding('attr.data-host') dataHost: boolean = true;
  @Input() emitter: EventEmitter<null>;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) { }

  @HostListener('click', ['$event']) onHostClick($event) {
    $event.target.attributes['data-host'] && this.closeModal();
  }

  ngOnInit() {
    this.emitter.subscribe(() => {
      this.closeModal();
    })
  }

  closeModal(): void {
    this.closeModBody = true;
    let timeout = setTimeout(() => {
      this.router.navigate(['../'], {relativeTo: this.activatedRoute});
      clearTimeout(timeout);
    }, 300)
  }
}
