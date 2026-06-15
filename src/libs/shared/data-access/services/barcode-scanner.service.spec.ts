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
});
