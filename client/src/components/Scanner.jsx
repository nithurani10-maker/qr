import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';

const Scanner = ({ onScan }) => {
    const [scanError, setScanError] = useState(null);

    useEffect(() => {
        // Accessibility: Announce scanner ready
        const regionId = "html5qr-code-full-region";

        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE, Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.UPC_A]
        };

        const scanner = new Html5QrcodeScanner(
            regionId,
            config,
            /* verbose= */ false
        );

        scanner.render(
            (decodedText, decodedResult) => {
                scanner.clear();
                // A11y: Focus management handled by parent switching views
                onScan(decodedText);
            },
            (errorMessage) => {
                // Ignore frame-by-frame errors to avoid screen reader spam
            }
        );

        return () => {
            scanner.clear().catch(err => console.error("Scanner clear fail", err));
        };
    }, [onScan]);

    return (
        <div className="w-full max-w-md mx-auto relative group">
            <div
                id="html5qr-code-full-region"
                className="overflow-hidden rounded-xl shadow-2xl border-4 border-slate-700 bg-slate-900 focus-within:border-blue-500 transition-colors"
                style={{ minHeight: '300px' }}
                role="application"
                aria-label="Camera Viewfinder"
            ></div>

            <div className="absolute top-4 left-0 right-0 text-center pointer-events-none">
                <span className="bg-slate-900/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    Position code in frame
                </span>
            </div>
        </div>
    );
};

export default Scanner;
