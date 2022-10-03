import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  lastLog: string;

  printLog(message: string) {
    console.log('printLog - message => ', message);
    console.log('printLog - lastLog => ', this.lastLog);
    this.lastLog = message;
  }
}
