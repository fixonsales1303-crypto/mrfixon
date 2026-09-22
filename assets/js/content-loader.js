// =========================================================================
// Mr. Fixon - Dynamic Content & CMS Loader
// =========================================================================

const ContentLoader = {
    // List of known content items (updated automatically or fetched)
    products: [
        '/content/products/p4-indoor-led-screen.json',
        '/content/products/p10-outdoor-led-display.json',
        '/content/products/3d-acrylic-led-letters.json',
        '/content/products/magnetic-glass-whiteboard.json'
    ],
    
    settingsUrl: '/content/settings.json',

    /**
     * Initialize content loading
     */
    async init() {
        await this.loadSettings();
        if (document.getElementById('dynamic-products-container') || document.querySelector('.products-grid')) {
            await this.loadProducts();
        }
    },

    /**
     * Load and apply site settings (Phone, Email, Address)
     */
    async loadSettings() {
        try {
            const res = await fetch(this.settingsUrl);
            if (!res.ok) return;
            const settings = await res.json();

            // Update elements with data-cms-bind attribute
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
            console.debug('CMS settings load skipped (using static defaults):', e);
        }
    },

    /**
     * Load and render CMS products
     */
    async loadProducts() {
        const container = document.getElementById('dynamic-products-container');
        if (!container) return;

        try {
            const productPromises = this.products.map(url => fetch(url).then(r => r.ok ? r.json() : null));
            const products = (await Promise.all(productPromises)).filter(Boolean);

            if (products.length === 0) return;

            // Render dynamic cards
            container.innerHTML = products.map(product => this.renderProductCard(product)).join('');
        } catch (e) {
            console.debug('CMS products load skipped (using static HTML):', e);
        }
    },

    /**
     * Generate HTML for a product card matching Mr. Fixon design
     */
    renderProductCard(product) {
        const badgeHtml = product.badge 
            ? `<div class="product-badge">${product.badge}</div>` 
            : '';

        const featuresHtml = product.features && product.features.length 
            ? `<div class="product-features">
                 ${product.features.slice(0, 3).map(f => `<span class="feature-tag"><i class="fas fa-check-circle"></i> ${f}</span>`).join('')}
               </div>`
            : '';

        return `
        <div class="product-card" data-category="${product.category || 'led-digital'}" data-aos="fade-up">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
                ${badgeHtml}
            </div>
            <div class="product-content">
                <span class="product-category">${this.getCategoryLabel(product.category)}</span>
                <h3>${product.title}</h3>
                <p class="product-description">${product.description || ''}</p>
                ${featuresHtml}
                <div class="product-footer">
                    <a href="/contact.html?product=${encodeURIComponent(product.title)}" class="btn-quote">
                        <i class="fas fa-envelope"></i> Request Quote
                    </a>
                </div>
            </div>
        </div>
        `;
    },

    getCategoryLabel(categoryKey) {
        const map = {
            'led-digital': 'LED & Digital Displays',
            'acrylic': 'Acrylic Signages',
            'boards': 'Premium Whiteboards',
            'safety': 'Safety Signage',
            'decor': 'Decorative Mirrors'
        };
        return map[categoryKey] || 'Display Solutions';
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => ContentLoader.init());
