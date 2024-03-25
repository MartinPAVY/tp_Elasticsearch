import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'error-box',
  templateUrl: './error-box.component.html',
  styleUrls: ['./error-box.component.less']
})
export class ErrorBoxComponent {
  @Input()
  public error: any = null;

  public sanitizeError(error: any): any {
    return JSON.parse(JSON.stringify(error));
  }
}
