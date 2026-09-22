// =========================================================================
// Mr. Fixon - Dynamic Content & Category Loader
// =========================================================================

const ContentLoader = {
    repo: 'fixonsales1303-crypto/mrfixon',
    branch: 'main',

    defaultCategories: [
        'led-digital.json',
        'sign-boards.json',
        'safety.json',
        'boards.json',
        'corporate-acrylic-gifting.json'
    ],
    defaultProducts: [
        '3d-acrylic-led-letters.json',
        'p4-indoor-led-screen.json',
        'p10-outdoor-led-display.json',
        'magnetic-glass-whiteboard.json',
        'paper-weight.json'
    ],

    categories: [],
    products: [],

    async init() {
        await this.loadSettings();
        await this.loadCategoriesAndProducts();
    },

    /**
     * Load site settings
     */
    async loadSettings() {
        try {
            const res = await fetch(`/content/settings.json?t=${Date.now()}`);
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
            console.debug('CMS settings error:', e);
        }
    },

    /**
     * Normalize strings for comparisons and slug matching
     */
    slugify(str) {
        if (!str) return '';
        return str.toString().toLowerCase().trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    },

    /**
     * Discover and load all categories & products
     */
    async loadCategoriesAndProducts() {
        try {
            // 1. Fetch Categories List
            let categoryFiles = this.defaultCategories;
            try {
                const catRes = await fetch(`https://api.github.com/repos/${this.repo}/contents/content/categories?ref=${this.branch}`);
                if (catRes.ok) {
                    const catData = await catRes.json();
                    if (Array.isArray(catData)) {
                        categoryFiles = catData.filter(f => f.name.endsWith('.json')).map(f => f.name);
                    }
                }
            } catch (_) {}

            const catPromises = categoryFiles.map(file => 
                fetch(`/content/categories/${file}?t=${Date.now()}`)
                    .then(r => r.ok ? r.json() : null)
                    .catch(() => null)
            );
            this.categories = (await Promise.all(catPromises)).filter(Boolean);

            // 2. Fetch Products List
            let productFiles = this.defaultProducts;
            try {
                const prodRes = await fetch(`https://api.github.com/repos/${this.repo}/contents/content/products?ref=${this.branch}`);
                if (prodRes.ok) {
                    const prodData = await prodRes.json();
                    if (Array.isArray(prodData)) {
                        productFiles = prodData.filter(f => f.name.endsWith('.json')).map(f => f.name);
                    }
                }
            } catch (_) {}

            const prodPromises = productFiles.map(file => 
                fetch(`/content/products/${file}?t=${Date.now()}`)
                    .then(r => r.ok ? r.json() : null)
                    .catch(() => null)
            );
            this.products = (await Promise.all(prodPromises)).filter(Boolean);

            // 3. Render Dynamic Category Pills & Products
            this.renderCategoryPills();
            this.renderAndSyncProducts();
        } catch (e) {
            console.error('Error loading CMS data:', e);
        }
    },

    /**
     * Dynamically render Category Filter Pills
     */
    renderCategoryPills() {
        const filterContainer = document.querySelector('.filter-buttons');
        if (!filterContainer) return;

        let html = `<button class="filter-btn active" data-filter="all">All Products</button>`;

        // Map existing static categories to ensure exact slug match
        const staticCategories = [
            { title: 'LED & Digital', slug: 'led-digital' },
            { title: 'Sign Boards', slug: 'sign-boards' },
            { title: 'Safety Signage', slug: 'safety' },
            { title: 'Boards & Displays', slug: 'boards' }
        ];

        // Merge loaded CMS categories
        const allCategories = [...staticCategories];

        this.categories.forEach(cmsCat => {
            const cmsSlug = this.slugify(cmsCat.slug || cmsCat.title);
            const exists = allCategories.some(c => c.slug === cmsSlug || this.slugify(c.title) === this.slugify(cmsCat.title));
            if (!exists) {
                allCategories.push({
                    title: cmsCat.title,
                    slug: cmsSlug
                });
            }
        });

        allCategories.forEach(cat => {
            html += `<button class="filter-btn" data-filter="${cat.slug}">${cat.title}</button>`;
        });

        filterContainer.innerHTML = html;
        this.bindFilterEvents();
    },

    /**
     * Render newly added products and sync existing ones
     */
    renderAndSyncProducts() {
        const filterSection = document.querySelector('.filter-section');
        if (!filterSection) return;

        this.products.forEach(cmsItem => {
            if (!cmsItem || !cmsItem.title) return;

            const categorySlug = this.slugify(cmsItem.category || 'led-digital');
            
            // Check if product card already exists
            let matchedCard = document.querySelector(`.product-card[data-slug="${cmsItem.slug}"]`);
            if (!matchedCard) {
                document.querySelectorAll('.product-card').forEach(card => {
                    const title = card.querySelector('h3')?.textContent?.trim().toLowerCase();
                    if (title && title === cmsItem.title.toLowerCase()) {
                        matchedCard = card;
                    }
                });
            }

            if (matchedCard) {
                // Update existing card
                const img = matchedCard.querySelector('img');
                if (img && cmsItem.image) img.src = cmsItem.image;
                if (cmsItem.badge) {
                    let badge = matchedCard.querySelector('.product-badge');
                    if (!badge) {
                        badge = document.createElement('span');
                        badge.className = 'product-badge';
                        matchedCard.querySelector('.product-image-container')?.prepend(badge);
                    }
                    badge.textContent = cmsItem.badge;
                }
                const desc = matchedCard.querySelector('.product-description');
                if (desc && cmsItem.description) desc.textContent = cmsItem.description;
            } else {
                // Find or create category container
                let categoryGrid = document.querySelector(`.category-header[data-category="${categorySlug}"] + .products-grid`);
                
                if (!categoryGrid) {
                    // Create new category section dynamically
                    const catObj = this.categories.find(c => this.slugify(c.slug || c.title) === categorySlug) || { title: cmsItem.category };
                    const sectionHtml = `
                        <div class="category-header" data-category="${categorySlug}" data-aos="fade-up">
                            <h2>${catObj.title}</h2>
                            <p style="color: #9ca3af;">Premium customized solutions for ${catObj.title}</p>
                        </div>
                        <div class="products-grid"></div>
                    `;
                    filterSection.insertAdjacentHTML('beforeend', sectionHtml);
                    categoryGrid = document.querySelector(`.category-header[data-category="${categorySlug}"] + .products-grid`);
                }

                if (categoryGrid) {
                    const cardHtml = `
                        <div class="product-card" data-category="${categorySlug}" data-slug="${cmsItem.slug || ''}" data-aos="fade-up">
                            <div class="product-image-container">
                                ${cmsItem.badge ? `<span class="product-badge">${cmsItem.badge}</span>` : ''}
                                <img src="${cmsItem.image}" alt="${cmsItem.title}" class="product-image" loading="lazy">
                            </div>
                            <div class="product-info">
                                <div class="product-category">${this.getCategoryTitle(categorySlug)}</div>
                                <h3>${cmsItem.title}</h3>
                                <p class="product-description">${cmsItem.description || ''}</p>
                                <a href="https://wa.me/918384858678?text=Hi, I'm interested in ${encodeURIComponent(cmsItem.title)}" class="btn-quote" target="_blank">
                                    Get Quote <i class="fab fa-whatsapp"></i>
                                </a>
                            </div>
                        </div>
                    `;
                    categoryGrid.insertAdjacentHTML('beforeend', cardHtml);
                }
            }
        });

        this.bindFilterEvents();
    },

    getCategoryTitle(slug) {
        const found = this.categories.find(c => this.slugify(c.slug || c.title) === slug);
        return found ? found.title : slug;
    },

    /**
     * Bind click and search filters
     */
    bindFilterEvents() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');
        const categoryHeaders = document.querySelectorAll('.category-header');

        filterButtons.forEach(button => {
            button.onclick = () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                productCards.forEach(card => {
                    const cardCat = ContentLoader.slugify(card.getAttribute('data-category'));
                    card.style.display = (filterValue === 'all' || cardCat === filterValue) ? 'block' : 'none';
                });

                categoryHeaders.forEach(header => {
                    const headerCat = ContentLoader.slugify(header.getAttribute('data-category'));
                    header.style.display = (filterValue === 'all' || headerCat === filterValue) ? 'block' : 'none';
                });
            };
        });
    }
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ContentLoader.init());
} else {
    ContentLoader.init();
}
