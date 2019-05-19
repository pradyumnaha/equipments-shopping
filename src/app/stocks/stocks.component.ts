import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { DataService } from '../shared/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit{

  listItems = [];
  subscription: Subscription;
  serviceCallMade: boolean = false;
  constructor(private dataService:DataService) {}

  ngOnInit() {
    this.dataService.getList().then(value => {
     let size = Object.keys(value).length;
     for(let i=0; i<size;i++){
      this.listItems[i] = value[i]; 
     } 
    });

    if(this.listItems.length)
      this.updateChanges();
    
  }

  updateChanges(){
    this.subscription = this.dataService.currentStockBuy.subscribe(buyNumArr => {
      if(buyNumArr.length > 0){
        for(let i=0; i< buyNumArr.length; i++){
          if (buyNumArr[i] == 0){  
            continue;
          }
          this.listItems[i].quantity -= buyNumArr[i];
        }
      }
      
    });
  }

}
