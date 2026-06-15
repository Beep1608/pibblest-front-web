// src/libs/shared/data-access/services/barcode-scanner.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable, buffer, debounceTime, filter, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BarcodeScannerService {
    private keyPresses = new Subject<KeyboardEvent>();

    /**
     * Observable that emits the full barcode string when a scan is detected.
     */
    public readonly scan$: Observable<string>;

    constructor(private ngZone: NgZone) {
        // We buffer keystrokes and emit them when there's a pause of 50ms.
        // A barcode scanner works like a fast keyboard, emitting all characters almost instantly.
        this.scan$ = this.keyPresses.pipe(
            buffer(this.keyPresses.pipe(debounceTime(50))),
            map(events => {
                // If it's too slow (e.g. human typing), it might not buffer all chars together,
                // or we can explicitly filter out sequences that are too short to be barcodes.
                // Usually barcodes are at least 5-8 chars.
                return events.map(e => e.key).join('');
            }),
            // Usually, scanners append 'Enter' at the end of the scan.
            map(str => str.replace(/Enter$/, '').trim()),
            filter(str => str.length >= 4) // Only emit if it looks like a barcode
        );

        this.listenToGlobalKeys();
    }

    private listenToGlobalKeys() {
        this.ngZone.runOutsideAngular(() => {
            window.addEventListener('keydown', (event: KeyboardEvent) => {
                // Check if the focus is NOT on an input/textarea/select field.
                // We only want to capture global scans when the user isn't actively typing.
                const target = event.target as HTMLElement;
                const isInputArea = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
                
                if (!isInputArea) {
                    // It's a keypress outside an input. Might be a scanner.
                    // We only care about printable characters and Enter.
                    if (event.key.length === 1 || event.key === 'Enter') {
                        this.keyPresses.next(event);
                    }
                }
            });
        });
    }
}
