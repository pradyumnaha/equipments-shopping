import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userName;
  backendCallFailedInHome: boolean = false;
  backendCallFailedInHeader: boolean = false;
  subscription: Subscription;
  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.backendCallFailedInHome = false;
    this.dataService.getUser().then(value => {
      this.userName= value['login'];
    },
    (err) => {
      this.backendCallFailedInHome = true;
      //alert("Backend call failed");
    });

    this.subscription = this.dataService.currentCallFailStatus.subscribe(callfailStatus => {
      this.backendCallFailedInHeader = callfailStatus;
    });
  }

  

}
