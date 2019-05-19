import { Injectable } from '@angular/core';
import { resolve, reject } from 'q';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class DataService {
  private stockBuy = new BehaviorSubject<any>([]);
  currentStockBuy = this.stockBuy.asObservable();
  private callFail = new BehaviorSubject<boolean>(false);
  currentCallFailStatus = this.callFail.asObservable();

  private user = {
    id : 1,
    login : "user1@example.com",
    balance : 120
  };

  private items = [
    {
      id : 1,
      name : "Bronze sword: low quality, low price",
      price : 8,
      quantity : 10,
      imgUrl: "../../assets/img/bronze_sword.png"
    },
    {
      id : 2,
      name : "Wooden shield",
      price : 15,
      quantity : 5,
      imgUrl: "../../assets/img/wooden_shield.png"
    },
    {
      id : 3,
      name : "Battle axe",
      price : 12,
      quantity : 2,
      imgUrl: "../../assets/img/battle_axe.png"
    },
    {
      id : 4,
      name : "Long sword, carefully crafted to slay your enemies",
      price : 31,
      quantity : 1,
      imgUrl: "../../assets/img/longsword.png"
    }
  ];

  constructor() { }

  sendStockBuyInfo(buyNumber) {
    this.stockBuy.next(buyNumber);
  }

  sendBackendFailedAlert(callFailAlert){
    this.callFail.next(callFailAlert);
  }

  private simulateSuccessfulRequest(result) {
    return new Promise((resolve, reject) =>{
      setTimeout(()=>{
        resolve(result);
      },Math.random() * 100)
    });
  }

  private simulateFailureRequest() {
    return new Promise((resolve, reject) =>{
      setTimeout(()=>{
        reject();
      },Math.random() * 100)
    });
  }

  getUser(){
    let randomVal = Math.floor(Math.random() * 10) + 1;
    if(randomVal == 3 || randomVal == 6){
      return this.simulateFailureRequest();
    }
    return this.simulateSuccessfulRequest(this.user);
  }

  getList(){
    return this.simulateSuccessfulRequest(this.items);
  }
}
