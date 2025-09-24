// Basit Auth Stub: kullanıcı yönetimi olmadan doğrudan giriş
class AuthStub {
    constructor() {
        this.currentUser = {
            id: 'auto',
            username: 'auto',
            role: 'admin',
            name: 'Otomatik Giriş'
        };
        try {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } catch {}
    }

    async init() { /* no-op */ }
    async login() { return true; }
    logout() { /* no-op */ }
    hasPermission() { return true; }
    getCurrentUser() { return this.currentUser; }
}

// Global auth instance
window.auth = new AuthStub();