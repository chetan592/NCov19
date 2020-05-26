import { Component, ViewChild, ChangeDetectorRef } from "@angular/core";
import { WebserviceService } from "./webservice.service";
import { compileInjectable, ThrowStmt } from "@angular/compiler";
import { Subscription, timer, of } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { switchMap, catchError } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { country } from "./Models/country.model";
import { MediaMatcher } from "@angular/cdk/layout";
import { MediaObserver, MediaChange } from "@angular/flex-layout";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Corona";
  district_data;
  activeCount = 0;
  confirmedCount = 0;
  recoveredCases = 0;
  sub: Subscription;
  sub2: Subscription;
  states: Array<string> = [];
  loaded = false;
  mobileQuery: MediaQueryList;
  //private paginator:MatPaginator
  /*
  worldStats= {
    "NewConfirmed": 101362,
    "TotalConfirmed": 4617583,
    "NewDeaths": 5335,
    "TotalDeaths": 313328,
    "NewRecovered": 49174,
    "TotalRecovered": 1636416
  }*/
  worldStats: World;
  mediaSub: Subscription;
  navbaropen = false;
  constructor(
    private routes: ActivatedRoute,
    public web: WebserviceService,
    private route: Router,
    private changeDetector: ChangeDetectorRef,
    public media: MediaObserver
  ) {}

  ngOnInit(): void {
    this.mediaSub = this.media.media$.subscribe((change: MediaChange) => {
      console.log(change.mediaQuery);
    });

    this.sub2 = timer(0, 610000)
      .pipe(
        catchError((err) => of(err)),
        switchMap(() => this.web.getGlobalStats())
      )
      .subscribe((result) => {
        this.worldStats = result;
        this.loaded = true;
      });
  }

  openNav() {
    console.log("open called");
    if (this.navbaropen == false) {
      document.getElementById("mySidenav").style.width = "250px";
      this.navbaropen = true;

      console.log("open");
    } else if (this.navbaropen == true) {
      document.getElementById("mySidenav").style.width = "0";
      this.navbaropen = false;
      console.log("close");
    }
  }

  /* Set the width of the side navigation to 0 */

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.sub2.unsubscribe();
  }
  toggleNavbar() {
    this.navbaropen = !this.navbaropen;
  }
}
