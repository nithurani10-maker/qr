import useAuth from '../hooks/useAuth';

const Profile = () => {
    const { user, logout } = useAuth();

    return (
        <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{
                    width: '6rem',
                    height: '6rem',
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                    borderRadius: '50%',
                    margin: '0 auto 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    color: 'white',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    {user?.username?.charAt(0).toUpperCase() || '👤'}
                </div>

                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{user?.username}</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{user?.email}</p>

                <div style={{ display: 'grid', gap: '1rem', textAlign: 'left', marginBottom: '2rem' }}>
                    <div style={{ padding: '1rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Account Status</p>
                        <p style={{ fontWeight: 600, color: 'var(--success)' }}>Active • Standard Plan</p>
                    </div>
                    <div style={{ padding: '1rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Member Since</p>
                        <p style={{ fontWeight: 600 }}>{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="btn btn-outline"
                    style={{
                        color: 'var(--danger)',
                        borderColor: 'var(--danger-border)',
                        width: '100%'
                    }}
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Profile;
