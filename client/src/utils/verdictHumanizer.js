export const humanizeVerdict = (result) => {
    if (!result) return null;

    const { verdict, riskScore, detectedType, findings, layers, riskBreakdown } = result;

    let summary = '';
    let description = '';
    let action = '';
    let actionColor = '';
    let icon = ''; // simple text icon or class name equivalent

    // 1. DANGER / SCAM
    if (verdict === 'DANGER' || verdict === 'SCAM') {
        summary = 'High Risk Detected';
        actionColor = 'bg-red-600 hover:bg-red-700';
        icon = '🚫';

        if (detectedType === 'UPI') {
            description = 'This payment request matches known scam patterns or uses high-risk techniques.';
            action = 'Do NOT Pay. Exit immediately.';
        } else if (detectedType === 'URL') {
            description = 'This website is flagged as dangerous. It may try to steal your information or install malware.';
            action = 'Do NOT Open Link. Close this immediately.';
        } else if (detectedType === 'PRODUCT') {
            description = 'This product barcode appears to be counterfeit or invalid.';
            action = 'Do NOT purchase. Verify vendor.';
        } else {
            description = 'This content is flagged as highly unsafe.';
            action = 'Avoid interaction.';
        }
    }
    // 2. WARN / SUSPICIOUS
    else if (verdict === 'WARN' || verdict === 'SUSPICIOUS') {
        summary = 'Proceed with Caution';
        actionColor = 'bg-yellow-600 hover:bg-yellow-700';
        icon = '⚠️';

        if (detectedType === 'UPI') {
            description = 'This payment looks unusual. Check the amount and payee name carefully.';
            action = 'Verify details before paying.';
        } else if (detectedType === 'URL') {
            description = 'This link has some suspicious traits or is unverified.';
            action = 'Only open if you trust the source.';
        } else if (detectedType === 'PRODUCT') {
            description = 'We could not verify this product completely.';
            action = 'Check physical packaging details.';
        } else {
            description = 'This content has some irregularities.';
            action = 'Be careful.';
        }
    }
    // 3. SAFE
    else {
        summary = 'No Threats Found';
        actionColor = 'bg-green-600 hover:bg-green-700';
        icon = '✅';
        description = 'We found no known scam indicators in this scan.';
        action = 'You can proceed.';
    }

    // Top 3 Evidence Signals (Simplified)
    const signals = findings ? findings.slice(0, 3).map(f => {
        // Simple mapping to remove jargon if needed, otherwise pass through
        return f.replace('High Entropy Domain', 'Random-looking Domain Name')
            .replace('Invalid Barcode Checksum', 'Fake Barcode Number')
            .replace('Suspicious Keyword', 'Misleading Words');
    }) : [];

    return {
        summary,
        description,
        action,
        actionColor,
        icon,
        signals,
        riskScore
    };
};
