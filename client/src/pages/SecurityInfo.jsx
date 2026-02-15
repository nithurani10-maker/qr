const SecurityInfo = () => {
    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Security Knowledge Base</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Understanding threats in the QR & Barcode landscape.</p>
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
                <section className="card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>🎣</span> QR Phishing (QRishing)
                    </h2>
                    <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                        Attackers place malicious QR codes over legitimate ones (e.g., on parking meters or restaurant menus).
                        Scanning these takes you to a fake website designed to steal your credit card numbers or login credentials.
                    </p>
                    <div style={{ background: 'var(--warning-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--warning)' }}>
                        <strong>Defense:</strong> Always check the URL in your scanner before tapping "Go". If the site looks weird or asks for login immediately, close it.
                    </div>
                </section>

                <section className="card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>💸</span> UPI Payment Fraud
                    </h2>
                    <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                        Fraudsters often manipulate UPI QRs to include a "Collect Request" instead of a payment, or change the payee name to look like a shop.
                    </p>
                    <div style={{ background: 'var(--success-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--success)' }}>
                        <strong>Defense:</strong> Verify the VPA (Virtual Payment Address) and the verified name on your payment app before entering your PIN.
                    </div>
                </section>

                <section className="card" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>🦠</span> Malware Downloads
                    </h2>
                    <p style={{ marginBottom: '1rem', lineHeight: 1.6 }}>
                        Scanning a code can trigger a direct file download (.apk or .exe). Installing these can compromise your entire device.
                    </p>
                    <div style={{ background: 'var(--danger-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--danger)' }}>
                        <strong>Defense:</strong> Never install an application just to view a menu or pay. Only install apps from the Google Play Store or App Store.
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SecurityInfo;
