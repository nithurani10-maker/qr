/**
 * Generates human-readable explanations based on risk score and flags.
 */
exports.generateExplanation = (verdict, riskScore, availableData) => {
    let explanation = "We analyzed this code finding: ";
    const parts = [];

    if (availableData.type === 'UPI') {
        parts.push(`a payment request for ${availableData.data.payeeName || 'an unknown payee'}`);
        if (availableData.data.amount) parts.push(`amounting to ₹${availableData.data.amount}`);
    } else if (availableData.type === 'URL') {
        parts.push(`a link to ${availableData.data.domain}`);
    } else if (availableData.type === 'product') {
        parts.push(`a product barcode (${availableData.data.format})`);
    } else {
        parts.push("raw text content");
    }

    explanation += parts.join(', ') + ". ";

    if (verdict === 'SAFE') {
        explanation += "No known security threats were detected. The format is valid and the destination appears clean.";
    } else if (verdict === 'SUSPICIOUS') {
        explanation += `Caution is advised. We detected some irregularities (Risk Score: ${riskScore}/100). Verify the source before proceeding.`;
    } else if (verdict === 'DANGER' || verdict === 'SCAM') {
        explanation += `HIGH RISK WARNING. This content matches known scam patterns or blacklisted sources (Risk Score: ${riskScore}/100). DO NOT PROCEED.`;
    }

    return explanation;
};
