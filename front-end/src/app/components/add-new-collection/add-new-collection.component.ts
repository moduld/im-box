import { Component, OnInit, HostBinding, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-add-new-collection',
  templateUrl: './add-new-collection.component.html',
  styleUrls: ['./add-new-collection.component.scss']
})
export class AddNewCollectionComponent implements OnInit {

  @HostBinding('class.close-overlay') closeModBody: boolean = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    let self = this;
    window.addEventListener('popstate', function(event) {
      console.log(event)
      event.preventDefault();
      self.closeModBody = true;
    });
  }

  closeModal(): void {
    this.closeModBody = true;
    let timeout = setTimeout(() => {
      this.router.navigate(['../'], {relativeTo: this.activatedRoute});
      clearTimeout(timeout);
    }, 300)
  }

}
