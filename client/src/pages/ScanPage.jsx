import { useNavigate } from 'react-router-dom';
import Scanner from '../components/Scanner';

const ScanPage = () => {
    const navigate = useNavigate();

    const handleScan = (decodedText) => {
        if (navigator.vibrate) navigator.vibrate(200);

        let type = 'TEXT';
        if (decodedText.startsWith('upi://')) type = 'UPI';
        else if (decodedText.startsWith('http')) type = 'URL';
        else if (/^\d{12,13}$/.test(decodedText)) type = 'PRODUCT';

        navigate('/analyze', {
            state: { rawPayload: decodedText, type: type }
        });
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }} className="fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Scan Code</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Point your camera at a QR code, UPI, or Barcode to analyze threats.</p>
            </div>

            <div className="card" style={{ padding: '0.5rem', background: 'black', border: '4px solid white', boxShadow: 'var(--shadow-lg)' }}>
                <Scanner onScan={handleScan} />
            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                    <div>
                        <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚀</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Instant</span>
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</span>
                        <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Private</span>
                    </div>
                    <div>
                        <span style={{ display: 'block', fontSize: '1.5rem', marginBottom: '0.5rem' }}>🤖</span>
                        <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>AI Powered</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScanPage;
