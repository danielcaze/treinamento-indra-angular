import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { NavigationEnd, Router } from '@angular/router';
import { delay, filter } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  page: string;

  constructor(
    private dataService: DataService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.page = String(this.route.url);
    this.route.events
      .pipe(
        delay(10),
        filter((e) => e instanceof NavigationEnd),
      )
      .subscribe((event: any) => {
        this.page = event.url;
      });
  }


  create() {
    this.dataService.sendCreateButtonClick();
  }
}
