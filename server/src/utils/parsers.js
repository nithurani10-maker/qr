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
                currency: params.cu || 'INR',
                merchantCode: params.mc || null,
                refId: params.tr || null
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

        // Detect IP address usage
        const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(urlObj.hostname);

        return {
            type: 'URL',
            valid: true,
            data: {
                protocol: urlObj.protocol.replace(':', ''),
                domain: urlObj.hostname,
                path: urlObj.pathname,
                params: Object.fromEntries(urlObj.searchParams),
                isIp: isIp,
                tld: urlObj.hostname.split('.').pop()
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
    // EAN-13 / UPC Check (12-13 digits)
    if (/^\d{12,13}$/.test(payload)) {
        const prefix = payload.substring(0, 3);
        let origin = "Unknown";

        // Basic GS1 Prefix Map
        const p = parseInt(prefix);
        if (p >= 0 && p <= 19) origin = "USA/Canada";
        else if (p >= 30 && p <= 39) origin = "USA (Drugs)";
        else if (p >= 400 && p <= 440) origin = "Germany";
        else if (p >= 450 && p <= 459) origin = "Japan";
        else if (p >= 490 && p <= 499) origin = "Japan";
        else if (p >= 500 && p <= 509) origin = "UK";
        else if (p >= 690 && p <= 699) origin = "China";
        else if (p >= 890) origin = "India";

        return {
            type: 'product',
            valid: true,
            data: {
                format: payload.length === 13 ? 'EAN-13' : 'UPC-A',
                prefix: prefix,
                origin: origin,
                code: payload
            }
        };
    }

    // Default to Text
    return {
        type: 'TEXT',
        valid: true,
        data: {
            preview: payload.substring(0, 50),
            length: payload.length
        }
    };
};

exports.parsePayload = (payload) => {
    let result;

    if (payload.startsWith('upi://')) {
        result = parseUPI(payload);
    } else if (payload.startsWith('http') || (payload.includes('.') && !payload.includes(' ') && !/^\d+$/.test(payload))) {
        result = parseURL(payload);
    } else {
        result = parseGeneral(payload);
    }

    return result;
};
