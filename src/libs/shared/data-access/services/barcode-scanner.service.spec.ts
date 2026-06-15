import { TestBed } from '@angular/core/testing';
import { BarcodeScannerService } from './barcode-scanner.service';

describe('BarcodeScannerService', () => {
    let service: BarcodeScannerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BarcodeScannerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should emit a barcode when a sequence of keys is pressed rapidly', (done) => {
        service.scan$.subscribe((barcode) => {
            expect(barcode).toBe('123456789');
            done();
        });

        // Simulate fast typing (like a scanner) outside of an input
        const events = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Enter'].map(
            (key) => new KeyboardEvent('keydown', { key })
        );

        events.forEach((event) => window.dispatchEvent(event));
    });

    it('should not emit if focus is on an input element', () => {
        let emitted = false;
        service.scan$.subscribe(() => {
            emitted = true;
        });

        const input = document.createElement('input');
        document.body.appendChild(input);
        
        // Simulate typing inside an input
        const event = new KeyboardEvent('keydown', { key: '1', bubbles: true });
        Object.defineProperty(event, 'target', { value: input, enumerable: true });
        
        window.dispatchEvent(event);

        setTimeout(() => {
            expect(emitted).toBeFalse();
            input.remove();
        }, 100);
    });

    it('should not emit while disabled and resume after being re-enabled', (done) => {
        let emitCount = 0;
        const lastBarcode = { value: '' };
        service.scan$.subscribe((barcode) => {
            emitCount += 1;
            lastBarcode.value = barcode;
        });

        const dispatch = (chars: string[]) =>
            chars.forEach((key) => window.dispatchEvent(new KeyboardEvent('keydown', { key })));

        // Disabled: the scan must be swallowed.
        service.disable();
        dispatch(['1', '2', '3', '4', '5', 'Enter']);

        setTimeout(() => {
            expect(emitCount).toBe(0);

            // Re-enabled: scanning works again.
            service.enable();
            dispatch(['9', '8', '7', '6', '5', 'Enter']);

            setTimeout(() => {
                expect(emitCount).toBe(1);
                expect(lastBarcode.value).toBe('98765');
                done();
            }, 100);
        }, 100);
    });
});
