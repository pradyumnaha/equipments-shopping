import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  goldBalance;
  listItems = [];
  buyNumInput = [];
  totalGold = [];
  sum = 0;
  goldNotAvilable: boolean = false;
  itemNotAvailable: boolean = false;

  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.getUser();
    this.getItemList();
  }

  getUser() {
    this.dataService.getUser().then(value => {
      this.goldBalance= value['balance'];
    },
    (err) => {
      this.dataService.sendBackendFailedAlert(true);
    });
  }

  getItemList() {
    this.dataService.getList().then(value => {
     let size = Object.keys(value).length;
     for(let i=0; i<size;i++){
      this.listItems[i] = value[i]; 
      this.buyNumInput[i] = 0;
     } 
    });
  }

  onPlusClick(i, item){
    this.itemNotAvailable = false;
    if(this.buyNumInput[i] < item.quantity){
      this.buyNumInput[i]++;
      this.totalGold[i] = this.buyNumInput[i] * item.price;
      this.sum = this.totalGold.reduce(function(a, b) { return a + b; }, 0);
    }
    else{
      this.itemNotAvailable = true;
    }
    if(item.quantity == 0){
      this.itemNotAvailable = true;
    }
    this.isGoldBalanceSufficient();
  }

  onMinusClick(i, item){

    if (this.buyNumInput[i] > 0 && this.buyNumInput[i] < item.quantity){
      this.buyNumInput[i]--;
      this.totalGold[i] -= item.price;
      this.caclulateGoldSum();
    }
    else{
      if (this.buyNumInput[i] > 0){
        this.buyNumInput[i]--;
        this.totalGold[i] -= item.price;
        this.caclulateGoldSum();
      }
    }
    this.isGoldBalanceSufficient();
  }

  getDisplayName(item) {
    return item.name.split(' ').slice(0,2).join(' ').replace(":", "").replace(",", "");
  }

  onInputType(val, i, item ){
    this.itemNotAvailable = false;
    if(val <= item.quantity){
      this.buyNumInput[i] = val;
      this.totalGold[i] = val*item.price;
      this.caclulateGoldSum();
      this.isGoldBalanceSufficient();
    }
    else{
      this.itemNotAvailable = true;
      this.buyNumInput[i] = 0;
      this.totalGold[i] = 0;
      this.caclulateGoldSum();
    }
    if(item.quantity == 0){
      this.itemNotAvailable = true;
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  caclulateGoldSum(){
    this.sum = this.totalGold.reduce(function(a, b) { return a + b; }, 0);
  }
  
  isGoldBalanceSufficient(): boolean {

    this.goldNotAvilable = false;
    if(this.sum > this.goldBalance)
      this.goldNotAvilable = true;

    return this.goldNotAvilable;

  }

  resetOrderDialog(){
    this.sum = 0;
    this.goldNotAvilable = false;
    this.itemNotAvailable = false;
    for(let i=0; i < this.buyNumInput.length;i++){
      this.buyNumInput[i] = 0;
    }

    for(let i=0; i < this.totalGold.length;i++){
      this.totalGold[i] = 0;
    }
  }

  onCancelClick(){
    this.resetOrderDialog();
  }

  onCloseClick(){
    this.resetOrderDialog();
  }

  onBuyClick(){
    this.goldBalance-= this.sum;
    for(let i=0; i<this.buyNumInput.length; i++){
      if (this.buyNumInput[i] == 0){
        continue;
      }
      this.listItems[i].quantity -= this.buyNumInput[i];
    }
    this.dataService.sendStockBuyInfo(this.buyNumInput);
  }

  onBuyLinkClick(){
    this.resetOrderDialog();
  }

}
