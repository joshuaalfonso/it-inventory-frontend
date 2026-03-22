import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";


@Injectable({
  providedIn: 'root'
})
export class ToastService {

    constructor(
        private messageService: MessageService
    ) {}

    success(detail: string, summary: string = 'Success') {
        console.log(detail)
        this.messageService.add({
            key: "global",
            severity: 'success',
            summary,
            detail
        });
    }

    error(detail: string, summary: string = 'Error') {
        this.messageService.add({
            key: "global",
            severity: 'error',
            summary,
            detail
        });
    }

    warn(detail: string, summary: string = 'Warning') {
        this.messageService.add({
            key: "global",
            severity: 'warn',
            summary,
            detail
        });
    }

    info(detail: string, summary: string = 'Info') {
        this.messageService.add({
            key: "global",
            severity: 'info',
            summary,
            detail
        });
    }

}