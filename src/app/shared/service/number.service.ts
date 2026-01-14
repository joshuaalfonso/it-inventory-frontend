// shared/percentage.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberService {

  getPercentage(value: number, total: number, round = true): number {
    if (!total || total <= 0) return 0;

    const result = (value / total) * 100;
    return round ? Math.round(result) : result;
  }
}
