/**
 * ============================================================================
 * ATELIER — Contemporary Fashion & Lifestyle Brand
 * Production JavaScript Interactive System
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. STATE & DATA STORE
  // --------------------------------------------------------------------------
  const FREE_SHIPPING_THRESHOLD = 250;
  
  // Initial sample cart items or empty state
  const cartState = {
    items: [],
    isOpen: false
  };

  // Product Database for Best Sellers
  const productDatabase = {
    'prod-1': {
      id: 'prod-1',
      name: 'The Sculpted Cashmere Blazer',
      price: 480,
      category: 'Tailoring',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85',
      defaultColor: 'Oat Sand',
      defaultSize: 'S'
    },
    'prod-2': {
      id: 'prod-2',
      name: 'The Double-Breasted Trench',
      price: 540,
      category: 'Outerwear',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=85',
      defaultColor: 'Sand Khaki',
      defaultSize: 'M'
    },
    'prod-3': {
      id: 'prod-3',
      name: 'The Fluid Mulberry Silk Blouse',
      price: 295,
      category: 'Silk & Knitwear',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
      defaultColor: 'Champagne',
      defaultSize: 'S'
    },
    'prod-4': {
      id: 'prod-4',
      name: 'The Pleated Wide-Leg Trouser',
      price: 320,
      category: 'Trousers',
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=85',
      defaultColor: 'Ecru',
      defaultSize: 'M'
    }
  };

  // --------------------------------------------------------------------------
  // 2. DOM ELEMENT REFERENCES
  // --------------------------------------------------------------------------
  const announcementBar = document.getElementById('announcement-bar');
  const closeAnnouncementBtn = document.getElementById('close-announcement');
  const siteHeader = document.getElementById('site-header');

  // Search Drawer
  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const searchDrawer = document.getElementById('search-drawer');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const searchInput = document.getElementById('site-search-input');
  const suggestionTags = document.querySelectorAll('.suggestion-tag');

  // Mobile Menu
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Shopping Bag Drawer
  const bagToggleBtn = document.getElementById('bag-toggle-btn');
  const bagDrawer = document.getElementById('bag-drawer');
  const bagBackdrop = document.getElementById('bag-backdrop');
  const bagCloseBtn = document.getElementById('bag-close-btn');
  const bagCountEl = document.getElementById('bag-count');
  const drawerItemsCountEl = document.getElementById('drawer-items-count');
  const bagItemsListEl = document.getElementById('bag-items-list');
  const bagEmptyStateEl = document.getElementById('bag-empty-state');
  const bagSubtotalEl = document.getElementById('bag-subtotal');
  const bagShippingEl = document.getElementById('bag-shipping');
  const bagTotalEl = document.getElementById('bag-total');
  const meterTextEl = document.getElementById('meter-text');
  const meterFillEl = document.getElementById('meter-fill');
  const checkoutBtn = document.getElementById('checkout-btn');
  const emptyBrowseBtn = document.getElementById('empty-browse-btn');

  // Newsletter
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const formFeedback = document.getElementById('form-feedback');

  // Toast Notification
  const toastNotification = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  // Back to Top
  const backToTopBtn = document.getElementById('back-to-top');

  // --------------------------------------------------------------------------
  // 3. ANNOUNCEMENT BAR DISMISSAL
  // --------------------------------------------------------------------------
  if (closeAnnouncementBtn && announcementBar) {
    closeAnnouncementBtn.addEventListener('click', () => {
      announcementBar.classList.add('is-hidden');
      document.documentElement.style.scrollPaddingTop = 'calc(var(--header-height) + 16px)';
    });
  }

  // --------------------------------------------------------------------------
  // 4. STICKY HEADER SCROLL LISTENER
  // --------------------------------------------------------------------------
  const handleScrollHeader = () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader();

  // --------------------------------------------------------------------------
  // 5. SMOOTH ANCHOR SCROLLING WITH OFFSET
  // --------------------------------------------------------------------------
  const allAnchorLinks = document.querySelectorAll('a[href^="#"]');

  allAnchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Close mobile drawer if open
        if (mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) {
          closeMobileMenu();
        }

        // Close search drawer if open
        if (searchDrawer && searchDrawer.classList.contains('is-open')) {
          closeSearch();
        }

        // Close bag drawer if open
        if (cartState.isOpen) {
          closeBagDrawer();
        }

        const headerHeight = siteHeader.offsetHeight;
        const announcementHeight = announcementBar && !announcementBar.classList.contains('is-hidden') 
          ? announcementBar.offsetHeight 
          : 0;

        const totalOffset = headerHeight + announcementHeight + 10;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. MOBILE MENU OVERLAY
  // --------------------------------------------------------------------------
  function openMobileMenu() {
    mobileNavDrawer.classList.add('is-open');
    menuToggleBtn.classList.add('is-active');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileNavDrawer.classList.remove('is-open');
    menuToggleBtn.classList.remove('is-active');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', () => {
      const isOpen = mobileNavDrawer.classList.contains('is-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // --------------------------------------------------------------------------
  // 7. SEARCH DRAWER LOGIC
  // --------------------------------------------------------------------------
  function toggleSearch() {
    const isOpen = searchDrawer.classList.contains('is-open');
    if (isOpen) {
      closeSearch();
    } else {
      openSearch();
    }
  }

  function openSearch() {
    searchDrawer.classList.add('is-open');
    searchInput.focus();
  }

  function closeSearch() {
    searchDrawer.classList.remove('is-open');
    searchInput.value = '';
  }

  if (searchToggleBtn) {
    searchToggleBtn.addEventListener('click', toggleSearch);
  }

  if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', closeSearch);
  }

  // Handle Search Suggestion clicks
  suggestionTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const query = tag.getAttribute('data-query');
      closeSearch();

      // Find matching product card and scroll to it
      const targetCard = document.querySelector(`.product-card[data-product-id]`);
      const bestsellersSection = document.getElementById('bestsellers');
      
      if (bestsellersSection) {
        bestsellersSection.scrollIntoView({ behavior: 'smooth' });
        showToast(`Showing results for: ${tag.textContent}`);
      }
    });
  });

  // Handle search input Enter key
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          closeSearch();
          const bestsellersSection = document.getElementById('bestsellers');
          if (bestsellersSection) {
            bestsellersSection.scrollIntoView({ behavior: 'smooth' });
            showToast(`Searched for: "${query}"`);
          }
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. SCROLL REVEAL (INTERSECTION OBSERVER)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // --------------------------------------------------------------------------
  // 9. PRODUCT CARD CONTROLS (COLOR & SIZE SELECTORS)
  // --------------------------------------------------------------------------
  const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    // Color Swatches
    const colorDots = card.querySelectorAll('.color-dot');
    colorDots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        colorDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      });
    });

    // Size Pills
    const sizePills = card.querySelectorAll('.size-pill');
    sizePills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        sizePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });

    // Quick Add Button
    const quickAddBtn = card.querySelector('.quick-add-btn');
    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = card.getAttribute('data-product-id');
        const productInfo = productDatabase[productId];

        if (!productInfo) return;

        // Get currently selected color and size
        const activeColorEl = card.querySelector('.color-dot.active');
        const activeSizeEl = card.querySelector('.size-pill.active');

        const selectedColor = activeColorEl ? activeColorEl.getAttribute('data-color') : productInfo.defaultColor;
        const selectedSize = activeSizeEl ? activeSizeEl.getAttribute('data-size') : productInfo.defaultSize;

        addToCart({
          id: productInfo.id,
          name: productInfo.name,
          price: productInfo.price,
          image: productInfo.image,
          color: selectedColor,
          size: selectedSize
        });
      });
    }
  });

  // --------------------------------------------------------------------------
  // 10. SHOPPING BAG (CART) LOGIC & UI UPDATES
  // --------------------------------------------------------------------------
  function addToCart(item) {
    // Check if item with same ID, size, and color already exists
    const existingIndex = cartState.items.findIndex(
      cartItem => cartItem.id === item.id && cartItem.size === item.size && cartItem.color === item.color
    );

    if (existingIndex > -1) {
      cartState.items[existingIndex].quantity += 1;
    } else {
      cartState.items.push({
        ...item,
        quantity: 1
      });
    }

    updateCartUI();
    openBagDrawer();
    showToast(`Added to Bag: ${item.name} (${item.size} / ${item.color})`);
  }

  function removeFromCart(index) {
    if (index >= 0 && index < cartState.items.length) {
      const removed = cartState.items.splice(index, 1)[0];
      updateCartUI();
      showToast(`Removed from Bag: ${removed.name}`);
    }
  }

  function updateQuantity(index, delta) {
    if (cartState.items[index]) {
      cartState.items[index].quantity += delta;
      if (cartState.items[index].quantity <= 0) {
        removeFromCart(index);
      } else {
        updateCartUI();
      }
    }
  }

  function updateCartUI() {
    const totalCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update Header Badge
    if (bagCountEl) {
      bagCountEl.textContent = totalCount;
    }

    // Update Drawer Header Count
    if (drawerItemsCountEl) {
      drawerItemsCountEl.textContent = `(${totalCount} ${totalCount === 1 ? 'item' : 'items'})`;
    }

    // Update Shipping Threshold Meter
    if (meterTextEl && meterFillEl) {
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        meterTextEl.innerHTML = `<strong>Congratulations!</strong> You have unlocked complimentary delivery.`;
        meterFillEl.style.width = '100%';
        if (bagShippingEl) bagShippingEl.textContent = 'Complimentary';
      } else {
        const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
        meterTextEl.textContent = `Add $${remaining} more for complimentary global delivery`;
        const percentage = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        meterFillEl.style.width = `${percentage}%`;
        if (bagShippingEl) bagShippingEl.textContent = '$25';
      }
    }

    // Update Subtotal & Total
    if (bagSubtotalEl) {
      bagSubtotalEl.textContent = `$${subtotal.toLocaleString()}`;
    }

    if (bagTotalEl) {
      const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 25;
      const total = subtotal + shippingCost;
      bagTotalEl.textContent = `$${total.toLocaleString()}`;
    }

    // Render Cart Items
    renderCartItems();
  }

  function renderCartItems() {
    if (!bagItemsListEl) return;

    if (cartState.items.length === 0) {
      bagItemsListEl.innerHTML = `
        <div class="bag-empty-state" id="bag-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="empty-icon">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <p class="empty-title">Your shopping bag is empty</p>
          <p class="empty-sub">Explore our curated chapters and select timeless essentials.</p>
          <a href="#bestsellers" class="btn btn-secondary empty-browse-btn" id="empty-browse-btn">DISCOVER BEST SELLERS</a>
        </div>
      `;

      const browseBtn = document.getElementById('empty-browse-btn');
      if (browseBtn) {
        browseBtn.addEventListener('click', (e) => {
          e.preventDefault();
          closeBagDrawer();
          const target = document.getElementById('bestsellers');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
      }
      return;
    }

    // Generate HTML for cart items
    let itemsHtml = '';
    cartState.items.forEach((item, index) => {
      itemsHtml += `
        <div class="cart-item" data-index="${index}">
          <div class="cart-item-thumb">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-info">
            <h4 class="cart-item-name">${item.name}</h4>
            <span class="cart-item-specs">${item.color} &bull; Size ${item.size}</span>
            <span class="cart-item-price">$${item.price}</span>
            <div class="cart-qty-ctrls">
              <button type="button" class="qty-btn minus-btn" data-index="${index}" aria-label="Decrease quantity">&minus;</button>
              <span class="qty-val">${item.quantity}</span>
              <button type="button" class="qty-btn plus-btn" data-index="${index}" aria-label="Increase quantity">&#43;</button>
            </div>
          </div>
          <button type="button" class="cart-item-remove" data-index="${index}" aria-label="Remove item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `;
    });

    bagItemsListEl.innerHTML = itemsHtml;

    // Attach listeners to newly rendered quantity and remove buttons
    const minusBtns = bagItemsListEl.querySelectorAll('.minus-btn');
    const plusBtns = bagItemsListEl.querySelectorAll('.plus-btn');
    const removeBtns = bagItemsListEl.querySelectorAll('.cart-item-remove');

    minusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        updateQuantity(idx, -1);
      });
    });

    plusBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        updateQuantity(idx, 1);
      });
    });

    removeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        removeFromCart(idx);
      });
    });
  }

  function openBagDrawer() {
    cartState.isOpen = true;
    bagDrawer.classList.add('is-open');
    bagBackdrop.classList.add('is-active');
    bagDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeBagDrawer() {
    cartState.isOpen = false;
    bagDrawer.classList.remove('is-open');
    bagBackdrop.classList.remove('is-active');
    bagDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (bagToggleBtn) {
    bagToggleBtn.addEventListener('click', openBagDrawer);
  }

  if (bagCloseBtn) {
    bagCloseBtn.addEventListener('click', closeBagDrawer);
  }

  if (bagBackdrop) {
    bagBackdrop.addEventListener('click', closeBagDrawer);
  }

  // Simulated Checkout Celebration
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartState.items.length === 0) {
        showToast('Your bag is currently empty.');
        return;
      }

      checkoutBtn.disabled = true;
      checkoutBtn.innerHTML = `<span>SECURING ATELIER ORDER...</span>`;

      setTimeout(() => {
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = `
          <span>PROCEED TO CHECKOUT</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;
        closeBagDrawer();
        showToast('Thank you for exploring ATELIER. This portfolio preview has prepared your collection.');
        
        // Optionally reset cart for demonstration
        cartState.items = [];
        updateCartUI();
      }, 1500);
    });
  }

  // --------------------------------------------------------------------------
  // 11. NEWSLETTER SUBSCRIPTION INTERACTION
  // --------------------------------------------------------------------------
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailValue = newsletterEmail.value.trim();

      // Simple email validation regex
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValue || !emailPattern.test(emailValue)) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please enter a valid email address to receive Atelier correspondences.';
        newsletterEmail.focus();
        return;
      }

      // Valid submission
      formFeedback.className = 'form-feedback success';
      formFeedback.textContent = 'Welcome to the ATELIER circle. A private seasonal preview has been dispatched to your inbox.';
      newsletterEmail.value = '';

      showToast('Subscription confirmed. Thank you.');

      setTimeout(() => {
        formFeedback.textContent = '';
        formFeedback.className = 'form-feedback';
      }, 7000);
    });
  }

  // --------------------------------------------------------------------------
  // 12. TOAST NOTIFICATION UTILITY
  // --------------------------------------------------------------------------
  function showToast(message) {
    if (!toastNotification || !toastMessage) return;

    toastMessage.textContent = message;
    toastNotification.classList.add('is-visible');

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('is-visible');
    }, 4200);
  }

  // --------------------------------------------------------------------------
  // 13. BACK TO TOP SCROLL
  // --------------------------------------------------------------------------
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 14. FOOTER CLIENT SERVICE ACCORDION / TOASTS
  // --------------------------------------------------------------------------
  const serviceLinks = document.querySelectorAll('.footer-service-link');
  serviceLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const service = link.getAttribute('data-service');
      const messages = {
        care: 'Garment Preservation: Hand wash cool or dry clean only with eco-solvent. Store on cedar hangers.',
        sizing: 'Silhouette Guide: Our garments are tailored to true European dimensions with relaxed drape.',
        shipping: 'Complimentary Delivery: Worldwide carbon-neutral courier dispatched within 48 hours.',
        returns: 'Atelier Return: Enjoy 30-day effortless returns with complimentary pre-paid packaging.'
      };
      if (messages[service]) {
        showToast(messages[service]);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 15. ESCAPE KEY GLOBAL HANDLER
  // --------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (cartState.isOpen) closeBagDrawer();
      if (searchDrawer && searchDrawer.classList.contains('is-open')) closeSearch();
      if (mobileNavDrawer && mobileNavDrawer.classList.contains('is-open')) closeMobileMenu();
    }
  });

  // Pre-populate 1 sample item in cart for impressive first-glance testing
  // (User can immediately see the luxury bag badge and open it to explore!)
  setTimeout(() => {
    cartState.items.push({
      id: 'prod-1',
      name: 'The Sculpted Cashmere Blazer',
      price: 480,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85',
      color: 'Oat Sand',
      size: 'S',
      quantity: 1
    });
    updateCartUI();
  }, 300);

});
