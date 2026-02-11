const url = require('url');

class DeductionEngine {
    constructor() {
        this.blacklistedDomains = [
            'bit.ly', 'tinyurl.com', 'goo.gl', // Shorteners are WARN initially
            'free-gift', 'lottery-win', 'bank-verify', 'secure-login-update' // Keywords in domain
        ];
        this.suspiciousKeywords = [
            'congratulations', 'winner', 'lottery', 'claim prize', 'urgent',
            'verify account', 'bank', 'password', 'pin', 'cvv'
        ];
    }

    analyze(payload) {
        const result = {
            verdict: 'SAFE',
            riskScore: 0,
            detectedType: 'UNKNOWN',
            findings: []
        };

        if (!payload) return result;

        // 1. Detect Type
        if (payload.startsWith('upi://')) {
            result.detectedType = 'UPI';
            this.analyzeUPI(payload, result);
        } else if (payload.startsWith('http://') || payload.startsWith('https://')) {
            result.detectedType = 'URL';
            this.analyzeURL(payload, result);
        } else {
            result.detectedType = 'TEXT';
            this.analyzeText(payload, result);
        }

        // 2. Final Verdict Adjustment
        if (result.riskScore >= 80) result.verdict = 'DANGER';
        else if (result.riskScore >= 40) result.verdict = 'WARN';
        else result.verdict = 'SAFE';

        return result;
    }

    analyzeUPI(payload, result) {
        // Check for suspicious parameters
        const params = new URLSearchParams(payload.split('?')[1]);
        const pa = params.get('pa'); // Payee Address
        const am = params.get('am'); // Amount
        const pn = params.get('pn'); // Payee Name

        if (!pa) {
            result.riskScore += 50;
            result.findings.push('Invalid UPI: Missing Payee Address');
        }

        if (am) {
            result.riskScore += 40; // Pre-filled amount is suspicious
            result.findings.push(`Pre-filled amount detected: ${am}`);
        }

        // Generic checks
        if (pa && pa.includes('generic') || pa && pa.includes('test')) {
            result.riskScore += 30;
            result.findings.push('Suspicious VPA pattern');
        }
    }

    analyzeURL(payload, result) {
        try {
            const parsedUrl = new url.URL(payload);

            // Protocol Check
            if (parsedUrl.protocol === 'http:') {
                result.riskScore += 40;
                result.findings.push('Insecure Protocol (HTTP)');
            }

            // Domain Check
            const domain = parsedUrl.hostname.toLowerCase();

            // Check Blacklist/Suspicious keywords
            const isSuspicious = this.blacklistedDomains.some(d => domain.includes(d));
            if (isSuspicious) {
                result.riskScore += 60;
                result.findings.push('Suspicious Domain or Shortener Detected');
            }

            // IP Address check (simple regex)
            if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)) {
                result.riskScore += 70;
                result.findings.push('Direct IP Access Detected');
            }

        } catch (e) {
            result.riskScore += 20;
            result.findings.push('Malformed URL');
        }
    }

    analyzeText(payload, result) {
        const lowerPayload = payload.toLowerCase();

        let keywordCount = 0;
        this.suspiciousKeywords.forEach(word => {
            if (lowerPayload.includes(word)) {
                keywordCount++;
                result.findings.push(`Suspicious keyword: ${word}`);
            }
        });

        if (keywordCount > 0) {
            result.riskScore += (keywordCount * 20);
        }

        if (keywordCount >= 3) {
            result.verdict = 'DANGER'; // Override
        }
    }
}

module.exports = new DeductionEngine();
