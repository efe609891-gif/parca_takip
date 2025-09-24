// REST API Tabanlı Veritabanı İstemcisi
class Database {
    constructor() {
        // Varsayılan olarak PHP API kullan (aynı host altında /api/..)
        // Alt klasörde çalıştığı için kök slash kullanma; relative 'api'
        this.API_BASE = (window.API_BASE && window.API_BASE.trim()) || 'api';
    }

    async addVehicle(vehicle) {
        const res = await fetch(`${this.API_BASE}/vehicles.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vehicle)
        });
        if (!res.ok) throw new Error(await res.text());
        const raw = await res.json();
        const row = Array.isArray(raw) ? raw[0] : raw;
        // snake_case -> camelCase
        return {
            id: row.id,
            brand: row.brand,
            model: row.model,
            year: row.year,
            fuel: row.fuel,
            km: Number(row.km || 0),
            price: Number(row.price || 0),
            color: row.color,
            vin: row.vin,
            condition: row.condition,
            description: row.description || null,
            photo: row.photo || null,
            totalSales: Number(row.total_sales || 0),
            status: row.status,
            dateAdded: row.date_added,
            parts: []
        };
    }

    async updateVehicle(vehicle) {
        const res = await fetch(`${this.API_BASE}/vehicles.php?id=${encodeURIComponent(vehicle.id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vehicle)
        });
        if (!res.ok) throw new Error(await res.text());
        return true;
    }

    async getAllVehicles() {
        const res = await fetch(`${this.API_BASE}/vehicles.php`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        // snake_case -> camelCase dönüşümü ve uyum
        return (data || []).map(v => ({
            id: v.id,
            brand: v.brand,
            model: v.model,
            year: v.year,
            fuel: v.fuel,
            km: Number(v.km || 0),
            price: Number(v.price || 0),
            color: v.color,
            vin: v.vin,
            condition: v.condition,
            description: v.description || null,
            photo: v.photo || null,
            totalSales: Number(v.total_sales || 0),
            status: v.status,
            dateAdded: v.date_added,
            parts: []
        }));
    }

    async deleteVehicle(id) {
        const res = await fetch(`${this.API_BASE}/vehicles.php?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(await res.text());
        return true;
    }

    async addPart(vehicleId, part) {
        const res = await fetch(`${this.API_BASE}/vehicles.php?id=${encodeURIComponent(vehicleId)}&part=1`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(part)
        });
        if (!res.ok) throw new Error(await res.text());
        return (await res.json()).id;
    }

    async getVehicle(vehicleId) {
        const res = await fetch(`${this.API_BASE}/vehicles.php?id=${encodeURIComponent(vehicleId)}`);
        if (!res.ok) throw new Error(await res.text());
        const v = await res.json();
        return {
            id: v.id,
            brand: v.brand,
            model: v.model,
            year: v.year,
            fuel: v.fuel,
            km: Number(v.km || 0),
            price: Number(v.price || 0),
            color: v.color,
            vin: v.vin,
            condition: v.condition,
            description: v.description || null,
            photo: v.photo || null,
            totalSales: Number(v.total_sales || 0),
            status: v.status,
            dateAdded: v.date_added,
            parts: (v.parts || []).map(p => ({
                id: p.id,
                name: p.name,
                price: Number(p.price || 0),
                description: p.description || '',
                dateAdded: p.date_added
            }))
        };
    }

    async deletePart(vehicleId, partId) {
        const res = await fetch(`${this.API_BASE}/vehicles.php?id=${encodeURIComponent(vehicleId)}&partId=${encodeURIComponent(partId)}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(await res.text());
        return true;
    }

    async addSale(sale) {
        const res = await fetch(`${this.API_BASE}/sales.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sale)
        });
        if (!res.ok) throw new Error(await res.text());
        return (await res.json()).id;
    }

    async getSalesReport(startDate, endDate) {
        const params = new URLSearchParams({ startDate, endDate });
        params.set('report', '1');
        const res = await fetch(`${this.API_BASE}/sales.php?${params.toString()}`);
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    }

    // Kullanıcı uç noktaları devre dışı
    async addUser() { throw new Error('Users API disabled'); }
    async getUser() { return null; }
}

window.database = new Database();