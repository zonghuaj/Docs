import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { _HttpClient, TitleService } from "@delon/theme";

@Component({
  selector: 'service-console',
  templateUrl: './service-console.component.html'
})
export class ServiceConsoleComponent implements OnInit {
  servId: string;

  constructor(
    private http: _HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private titleSrv: TitleService) {
  }

  ngOnInit() {
    this.titleSrv.setTitle('控制台');

    this.servId = this.route.parent.snapshot.paramMap.get('id');
    this.getDetails(this.servId);

  }

  getDetails(id: string) {

  }
}
