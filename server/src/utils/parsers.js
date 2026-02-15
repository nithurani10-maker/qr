const { URL } = require('url');

/**
 * Extracts structured data from UPI strings
 * Format: upi://pay?pa=address&pn=name&am=amount...
 */
const parseUPI = (payload) => {
    try {
        const urlObj = new URL(payload);
        if (urlObj.protocol !== 'upi:') return null;

        const params = {};
        urlObj.searchParams.forEach((value, key) => {
            params[key] = value;
        });

        return {
            type: 'UPI',
            valid: true,
            data: {
                vpa: params.pa || null,
                payeeName: params.pn || null,
                amount: params.am ? parseFloat(params.am) : null,
                transactionNote: params.tn || null,
                currency: params.cu || 'INR'
            }
        };
    } catch (e) {
        return { type: 'UPI', valid: false, error: 'Malformed UPI URI' };
    }
};

/**
 * Parses and validates URLs
 */
const parseURL = (payload) => {
    try {
        // Add protocol if missing for parsing
        const urlString = payload.startsWith('http') ? payload : `http://${payload}`;
        const urlObj = new URL(urlString);

        return {
            type: 'URL',
            valid: true,
            data: {
                protocol: urlObj.protocol.replace(':', ''),
                domain: urlObj.hostname,
                path: urlObj.pathname,
                params: Object.fromEntries(urlObj.searchParams)
            }
        };
    } catch (e) {
        return { type: 'URL', valid: false, error: 'Invalid URL' };
    }
};

/**
 * Identifies and structures Text/Barcode data
 */
const parseGeneral = (payload) => {
    // EAN-13 Check (13 digits)
    if (/^\d{13}$/.test(payload)) {
        return {
            type: 'product',
            valid: true,
            data: {
                format: 'EAN-13',
                prefix: payload.substring(0, 3)
            }
        };
    }

    // Default to Text
    return {
        type: 'TEXT',
        valid: true,
        data: {
            preview: payload.substring(0, 50)
        }
    };
};

exports.parsePayload = (payload) => {
    let result;

    if (payload.startsWith('upi://')) {
        result = parseUPI(payload);
    } else if (payload.startsWith('http') || (payload.includes('.') && !payload.includes(' '))) {
        result = parseURL(payload);
    } else {
        result = parseGeneral(payload);
    }

    return result;
};
