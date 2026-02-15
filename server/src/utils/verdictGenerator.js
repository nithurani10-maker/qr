/**
 * Generates human-readable explanations based on risk score and flags.
 */
exports.generateExplanation = (verdict, riskScore, availableData) => {
    let summary = "";
    let findings = [];
    let riskFactors = [];
    let recommendation = "";

    // 1. Generate Summary & Findings
    if (availableData.type === 'UPI') {
        const { payeeName, amount, vpa } = availableData.data || {};
        summary = `This is a UPI payment request${amount ? ` for ₹${amount}` : ''}.`;

        if (payeeName) findings.push(`Payee identified as "${payeeName}"`);
        if (vpa) findings.push(`VPA Address: ${vpa}`);
        if (amount) findings.push(`Amount is pre-filled to ₹${amount}`);

    } else if (availableData.type === 'URL') {
        const { domain, isIp } = availableData.data || {};
        summary = `This is a web link pointing to ${domain}.`;

        findings.push(`Destination: ${domain}`);
        if (isIp) findings.push("Hostname is an IP address (uncommon for legitimate sites)");

    } else if (availableData.type === 'product') {
        const { origin, format } = availableData.data || {};
        summary = `This is a ${format} product barcode from ${origin}.`;
        findings.push(`GS1 Origin: ${origin}`);

    } else {
        summary = "This is a standard text or raw data code.";
        findings.push("Contains raw text data");
    }

    // 2. Risk Factors based on Score/Verdict
    if (verdict === 'SAFE') {
        riskFactors.push("No known threats detected");
        recommendation = "You can proceed safely, but always stay alert.";
    } else if (verdict === 'SUSPICIOUS') {
        riskFactors.push("Unusual pattern detected");
        if (availableData.type === 'URL') riskFactors.push("Domain has low reputation or suspicious structure");
        if (availableData.type === 'UPI') riskFactors.push("Payee name may be missing or mismatched");
        recommendation = "Verify the source carefully before proceeding. Do not enter sensitive info.";
    } else if (verdict === 'DANGER' || verdict === 'SCAM') {
        riskFactors.push("Matches known scam pattern");
        riskFactors.push("High risk score indicates Malicious Content");
        recommendation = "DO NOT PROCEED. Close this link or cancel the payment immediately.";
    }

    // 3. Fallback text
    if (recommendation === "") recommendation = "Proceed with caution.";

    return JSON.stringify({
        summary,
        findings,
        riskFactors,
        recommendation
    });
};
