const API_BASE = 'http://localhost:3000/api';

const api = {
    async request(method, endpoint, body = null) {
        const opts = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (body) opts.body = JSON.stringify(body);
        const res = await fetch(`${API_BASE}${endpoint}`, opts);
        if (res.status === 204) return null;
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
        return data;
    },
    get:    (ep)         => api.request('GET',    ep),
    post:   (ep, body)   => api.request('POST',   ep, body),
    put:    (ep, body)   => api.request('PUT',    ep, body),
    delete: (ep)         => api.request('DELETE', ep),
};
