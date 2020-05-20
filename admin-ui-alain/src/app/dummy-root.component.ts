import {
  Component,
  OnInit,
} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';

@Component({
  selector: 'dummy-root',
  template: ``,
})
export class DummyRootComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
    const menus = JSON.parse(localStorage.getItem('acc-menus'));

    if (menus['project-console']) {
      this.router.navigateByUrl('service-dashboard', {replaceUrl: true});
    } else if (menus['tenant-console']) {
      this.router.navigateByUrl('project/dashboard', {replaceUrl: true});
    } else if (menus['platform-console']) {
      this.router.navigateByUrl('platform/dashboard', {replaceUrl: true});
    } else {
      this.router.navigateByUrl('exception/403', {replaceUrl: true});
    }
  }
}
