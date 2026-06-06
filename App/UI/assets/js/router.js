const router = {
    routes: {},
    register(hash, handler) {
        this.routes[hash] = handler;
    },
    navigate(hash) {
        window.location.hash = hash;
    },
    init() {
        const run = () => {
            const hash = window.location.hash.replace('#', '') || 'companies';
            // highlight nav
            document.querySelectorAll('.nav-link').forEach(el => {
                el.classList.toggle('active', el.dataset.route === hash);
            });
            const handler = this.routes[hash];
            const content = document.getElementById('page-content');
            if (handler) {
                content.innerHTML = '';
                handler(content);
            } else {
                content.innerHTML = `<div class="empty-state"><p>Page not found: #${hash}</p></div>`;
            }
        };
        window.addEventListener('hashchange', run);
        run();
    }
};
