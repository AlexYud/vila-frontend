import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.testConnection().subscribe(data => {
      console.log(data);
      
    })
    
  }

}
