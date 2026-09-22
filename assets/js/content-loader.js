// =========================================================================
// Mr. Fixon - Dynamic Content & CMS Loader
// =========================================================================

const ContentLoader = {
    products: [
        '/content/products/3d-acrylic-led-letters.json',
        '/content/products/p4-indoor-led-screen.json',
        '/content/products/p10-outdoor-led-display.json',
        '/content/products/magnetic-glass-whiteboard.json'
    ],
    settingsUrl: '/content/settings.json',

    async init() {
        await Promise.all([
            this.loadSettings(),
            this.syncProducts()
        ]);
    },

    /**
     * Load and apply site settings (Phone, Email, Address)
     */
    async loadSettings() {
        try {
            const res = await fetch(this.settingsUrl + '?t=' + Date.now());
            if (!res.ok) return;
            const settings = await res.json();

            document.querySelectorAll('[data-cms-bind]').forEach(el => {
                const key = el.getAttribute('data-cms-bind');
                if (settings[key]) {
                    if (el.tagName === 'A' && key.includes('Phone')) {
                        el.href = `tel:${settings[key].replace(/[^0-9+]/g, '')}`;
                    } else if (el.tagName === 'A' && key.includes('email')) {
                        el.href = `mailto:${settings[key]}`;
                    } else if (el.tagName === 'A' && key.includes('whatsapp')) {
                        el.href = `https://wa.me/${settings[key].replace(/[^0-9]/g, '')}`;
                    }
                    el.textContent = settings[key];
                }
            });
        } catch (e) {
            console.debug('CMS settings load error:', e);
        }
    },

    /**
     * Synchronize CMS products with HTML cards on the page
     */
    async syncProducts() {
        const productCards = document.querySelectorAll('.product-card');
        if (!productCards || productCards.length === 0) return;

        try {
            const fetchPromises = this.products.map(url => 
                fetch(url + '?t=' + Date.now())
                    .then(r => r.ok ? r.json() : null)
                    .catch(() => null)
            );

            const cmsProducts = (await Promise.all(fetchPromises)).filter(Boolean);
            if (cmsProducts.length === 0) return;

            cmsProducts.forEach(cmsItem => {
                if (!cmsItem || !cmsItem.title) return;

                // Find matching card by data-slug or by title similarity
                let matchedCard = null;

                if (cmsItem.slug) {
                    matchedCard = document.querySelector(`.product-card[data-slug="${cmsItem.slug}"]`);
                }

                if (!matchedCard) {
                    // Try matching by card title
                    productCards.forEach(card => {
                        const cardTitle = card.querySelector('h3')?.textContent?.trim().toLowerCase() || '';
                        const cmsTitle = cmsItem.title.toLowerCase();
                        
                        // Exact match or partial keyword match (e.g. "acrylic sign board" vs "3d acrylic led backlit letters")
                        if (
                            cardTitle === cmsTitle ||
                            (cardTitle.includes('acrylic') && cmsTitle.includes('acrylic')) ||
                            (cardTitle.includes('p4') && cmsTitle.includes('p4')) ||
                            (cardTitle.includes('p10') && cmsTitle.includes('p10')) ||
                            (cardTitle.includes('glass') && cmsTitle.includes('glass'))
                        ) {
                            if (!matchedCard) matchedCard = card;
                        }
                    });
                }

                if (matchedCard) {
                    // Update Image
                    const imgEl = matchedCard.querySelector('img.product-image') || matchedCard.querySelector('img');
                    if (imgEl && cmsItem.image) {
                        imgEl.src = cmsItem.image;
                        imgEl.alt = cmsItem.title;
                    }

                    // Update Badge if provided
                    if (cmsItem.badge) {
                        let badgeEl = matchedCard.querySelector('.product-badge');
                        if (!badgeEl) {
                            badgeEl = document.createElement('span');
                            badgeEl.className = 'product-badge';
                            const imgContainer = matchedCard.querySelector('.product-image-container') || matchedCard;
                            imgContainer.prepend(badgeEl);
                        }
                        badgeEl.textContent = cmsItem.badge;
                    }

                    // Update Description
                    const descEl = matchedCard.querySelector('.product-description');
                    if (descEl && cmsItem.description) {
                        descEl.textContent = cmsItem.description;
                    }

                    // Update Title
                    const titleEl = matchedCard.querySelector('h3');
                    if (titleEl && cmsItem.title) {
                        titleEl.textContent = cmsItem.title;
                    }
                }
            });
        } catch (e) {
            console.error('Error syncing CMS products:', e);
        }
    }
};

// Initialize as soon as DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ContentLoader.init());
} else {
    ContentLoader.init();
}
