import { Component, Inject, OnInit } from '@angular/core';
import { PopoutData, POPOUT_MODAL_DATA } from '../popout.token';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  constructor(
    @Inject(POPOUT_MODAL_DATA) public data: PopoutData
  ) { }

  htmlContent;
  ngOnInit(): void {
    this.htmlContent = this.data.htmlContent;
  }

}
