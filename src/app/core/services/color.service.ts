import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ColorService {
    getColor(level: number): string {
        switch (level) {
            case 1:
                return '#955ba5';
            case 2:
                return '#6278b2';
            case 3:
                return '#2e95be';
            case 4:
                return '#8fae6b';
            case 5:
                return '#f0c419';
            case 6:
                return '#f28f3c';
            case 7:
                return '#f35959';
        }
    }
}
