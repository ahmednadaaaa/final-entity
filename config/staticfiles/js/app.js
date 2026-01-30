/* Entity Medical - Premium Clean JS
   app.js: global UI + auth + helpers (loaded on all pages)
*/
(function () {
  'use strict';

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const escapeHtml = (str) =>
    String(str || '').replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));


  function setupSmoothAnchors() {
    qsa('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href') || '';
        if (href === '#' || href.length < 2) return; // allow default
        const target = qs(href);
        if (!target) return; // allow default if target missing
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function setupRevealOnScroll() {
    if (!('IntersectionObserver' in window)) return;

    const els = qsa('.feature-card, .product-card, .service-card, .offer-card, .value-item, .shortcut-card');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    els.forEach((el) => observer.observe(el));
  }

  function setupContactForm() {
    const contactForm = qs('#contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = qs('#name')?.value || '';
      const email = qs('#email')?.value || '';
      const phone = qs('#phone')?.value || '';
      const subject = qs('#subject')?.value || '';
      const message = qs('#message')?.value || '';

      const whatsappMessage = `مرحباً، أريد التواصل معكم:
الاسم: ${name}
البريد الإلكتروني: ${email}
الهاتف: ${phone}
الموضوع: ${subject}
الرسالة: ${message}`;

      const whatsappUrl = `https://wa.me/201013928114?text=${encodeURIComponent(whatsappMessage)}`;

      const userChoice = window.confirm('تم حفظ رسالتك! هل تريد إرسالها عبر WhatsApp؟');
      if (userChoice) window.open(whatsappUrl, '_blank');

      contactForm.reset();
    });
  }

  function setupAuthForms() {
    const successDelay = 1500;

    // Helper to show message
    const showMsg = (form, msg, type = 'success') => {
      const msgBox = qs('.form-msg', form.parentElement);
      if (msgBox) {
        msgBox.textContent = msg;
        msgBox.className = `form-msg ${type}`;
        msgBox.style.display = 'block';
      } else {
        alert(msg);
      }
    };

    // Login Form
    const loginForm = qs('#loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = qs('button[type="submit"]', loginForm);
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الدخول...';

        // Simulate API Login
        setTimeout(() => {
          localStorage.setItem('currentUser', JSON.stringify({ name: 'د. عمر الشريف', role: 'admin' }));
          showMsg(loginForm, 'تم تسجيل الدخول بنجاح! جاري التحويل...', 'success');
          setTimeout(() => window.location.href = 'index.html', 1000);
        }, successDelay);
      });
    }

    // Signup Form
    const signupForm = qs('#signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = qs('button[type="submit"]', signupForm);
        const nameInput = qs('#signupName');
        const userName = nameInput ? nameInput.value : 'مستخدم جديد';

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إنشاء الحساب...';

        setTimeout(() => {
          localStorage.setItem('currentUser', JSON.stringify({ name: userName, role: 'member' }));
          showMsg(signupForm, 'تم إنشاء الحساب بنجاح! جاري التحويل...', 'success');
          setTimeout(() => window.location.href = 'index.html', 1500);
        }, successDelay);
      });
    }

    // Reset Password Form
    const resetForm = qs('#resetForm');
    if (resetForm) {
      resetForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const p1 = qs('#resetPassword').value;
        const p2 = qs('#resetPassword2').value;

        if (p1 !== p2) {
          showMsg(resetForm, 'كلمات المرور غير متطابقة', 'error');
          return;
        }

        const btn = qs('button[type="submit"]', resetForm);
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';

        setTimeout(() => {
          showMsg(resetForm, 'تم تغيير كلمة المرور بنجاح! قم بتسجيل الدخول.', 'success');
          setTimeout(() => window.location.href = 'login.html', 1500);
        }, successDelay);
      });
    }
  }

  function setupNavbarScroll() {
    const nav = qs('.navbar');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function setupMobileMenu() {
    const hamburger = qs('.hamburger');
    const mobileMenu = qs('.mobile-menu');
    const body = document.body;
    const mobileMenuLinks = qsa('.mobile-menu a');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
      });

      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
          body.classList.remove('menu-open');
        });
      });

      mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
          body.classList.remove('menu-open');
        }
      });
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        if (hamburger) hamburger.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (body) body.classList.remove('menu-open');
      }
    });
  }

  function setupFooterYear() {
    qsa('.js-year').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
  }

  function setupBackToTop() {
    let btn = qs('.back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'back-to-top';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'العودة للأعلى');
      btn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
      document.body.appendChild(btn);
    }

    const toggle = () => btn.classList.toggle('show', window.scrollY > 500);
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function renderAccountNav() {
    const nav = qs('.nav-links');
    if (!nav) return;

    let li = qs('#accountMenu');
    if (li) li.remove(); // Clean re-render if needed

    li = document.createElement('li');
    li.id = 'accountMenu';
    li.className = 'account-dropdown';

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (currentUser) {
      // Logged In State
      li.innerHTML = `
        <a class="account-link" href="#"><i class="fas fa-user-circle" aria-hidden="true"></i> حسابي</a>
        <div class="account-dropdown-menu">
           <div style="padding: 10px 15px; font-weight: bold; border-bottom: 1px solid #eee; color: var(--secondary-color);">
             ${currentUser.name}
           </div>
          <a href="profile.html"><i class="fas fa-id-card" aria-hidden="true"></i> الملف الشخصي</a>
          <a href="#" id="navLogout"><i class="fas fa-sign-out-alt" aria-hidden="true"></i> تسجيل الخروج</a>
        </div>
      `;
    } else {
      // Logged Out State
      li.innerHTML = `
        <a class="account-link" href="#"><i class="fas fa-user" aria-hidden="true"></i> دخول / تسجيل</a>
        <div class="account-dropdown-menu">
          <a href="login.html"><i class="fas fa-right-to-bracket" aria-hidden="true"></i> تسجيل الدخول</a>
          <a href="signup.html"><i class="fas fa-user-plus" aria-hidden="true"></i> إنشاء حساب</a>
        </div>
      `;
    }

    const cartLi = nav.querySelector('.cart-icon-container');
    if (cartLi) nav.insertBefore(li, cartLi);
    else nav.appendChild(li);

    // Bind Logout
    if (currentUser) {
      const logoutBtn = li.querySelector('#navLogout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
          }
        });
      }
    }
  }

  function setupProductsDetailsToggles() {
    // products.html only: show/hide section details
    const showButtons = qsa('[data-show-details]');
    const hideButtons = qsa('[data-hide-details]');
    const isProductsPage = !!qs('#searchInput') && !!qs('.products-section-details');
    if (!isProductsPage) return;

    function showDetails(categoryId) {
      qsa('.products-section-details').forEach((d) => d.classList.remove('active'));
      const target = qs('#' + categoryId);
      if (!target) return;
      target.classList.add('active');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function hideDetails(categoryId) {
      const target = qs('#' + categoryId);
      if (!target) return;
      target.classList.remove('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Backward compatibility with existing inline onclick calls (if any)
    window.showDetails = showDetails;
    window.hideDetails = hideDetails;

    // Optional data-attr hooks (future clean HTML)
    showButtons.forEach((btn) => btn.addEventListener('click', () => showDetails(btn.getAttribute('data-show-details'))));
    hideButtons.forEach((btn) => btn.addEventListener('click', () => hideDetails(btn.getAttribute('data-hide-details'))));

    // Search filtering within product items (products.html)
    const searchInput = qs('#searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const searchTerm = (searchInput.value || '').toLowerCase();
        qsa('.product-item').forEach((item) => {
          const name = item.querySelector('h5')?.textContent?.toLowerCase() || '';
          const desc = item.querySelector('p')?.textContent?.toLowerCase() || '';
          const match = name.includes(searchTerm) || desc.includes(searchTerm);
          item.style.display = match ? 'block' : 'none';
        });
      });
    }
  }

  function setupCategoriesSearchModule() {
    const searchContainer = qs('.search-container');
    const searchInput = qs('#searchInput');
    const categoriesGrid = qs('.categories-grid');

    if (!searchContainer || !searchInput || !categoriesGrid) return;

    // Avoid clashing with products page search filter (products.html)
    if (qs('.product-item')) return;

    let searchResults = qs('.search-results', searchContainer);
    if (!searchResults) {
      searchResults = document.createElement('div');
      searchResults.className = 'search-results';
      searchContainer.appendChild(searchResults);
    }

    searchInput.addEventListener('input', (e) => {
      const searchTerm = (e.target.value || '').trim().toLowerCase();

      if (!searchTerm) {
        searchResults.classList.remove('active');
        categoriesGrid.style.display = 'grid';
        return;
      }

      categoriesGrid.style.display = 'none';

      const categories = qsa('.category-card');
      const filtered = categories.filter((category) => {
        const title = category.querySelector('h3')?.textContent?.toLowerCase() || '';
        return title.includes(searchTerm);
      });

      if (filtered.length) {
        searchResults.innerHTML = filtered.map((category) => {
          const title = escapeHtml(category.querySelector('h3')?.textContent || '');
          const link = category.querySelector('a')?.getAttribute('href') || '#';
          return `<div class="search-result-item" role="button" tabindex="0" data-href="${escapeHtml(link)}">${title}</div>`;
        }).join('');
      } else {
        searchResults.innerHTML = '<div class="search-result-item">لا توجد نتائج</div>';
      }
      searchResults.classList.add('active');
    });

    searchResults.addEventListener('click', (e) => {
      const item = e.target.closest('.search-result-item[data-href]');
      if (!item) return;
      const href = item.getAttribute('data-href');
      if (href) window.location.href = href;
    });

    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchResults.classList.remove('active');
        categoriesGrid.style.display = 'grid';
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        searchResults.classList.remove('active');
        if (!searchInput.value) categoriesGrid.style.display = 'grid';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupSmoothAnchors();
    setupRevealOnScroll();
    setupContactForm();
    setupAuthForms();

    setupMobileMenu();
    setupNavbarScroll();
    setupFooterYear();
    setupBackToTop();

    // page-specific helpers
    setupProductsDetailsToggles();
    setupCategoriesSearchModule();

    // Auth UI
    renderAccountNav();

    // Favorites (Product Details Page Only)
    setupFavorites();
  });

  // Favorites System
  function setupFavorites() {
    const favorites = JSON.parse(localStorage.getItem('userFavorites') || '[]');

    // Target ONLY the main image on product details page
    // Using .product-details-grid .main-image as anchor
    const mainImageContainer = qs('.product-details-grid .main-image');

    if (mainImageContainer) {
      const productNameEl = qs('.product-title');
      const name = productNameEl ? productNameEl.textContent.trim() : 'منتج الحالي';

      // Prevent dupes
      if (!qs('.favorite-btn', mainImageContainer)) {
        const btn = document.createElement('button');
        btn.className = 'favorite-btn';
        btn.setAttribute('aria-label', 'أضف للمفضلة');

        // Random count generation (50-300)
        let count = Math.floor(Math.random() * 250) + 50;

        const isFav = favorites.includes(name);
        if (isFav) {
          btn.classList.add('active');
          count++; // Include user's like if active
        }

        btn.innerHTML = `
            <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
            <span class="like-count">${count}</span>
        `;

        btn.onclick = (e) => window.toggleFavorite(btn, name);
        mainImageContainer.appendChild(btn);
      }
    }

    // Expose toggle function globally
    window.toggleFavorite = function (btn, productName) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      const icon = btn.querySelector('i');
      const countSpan = btn.querySelector('.like-count');
      const isActive = btn.classList.toggle('active');
      let currentCount = parseInt(countSpan.textContent);

      // Toggle Icon Style
      if (isActive) {
        icon.className = 'fas fa-heart'; // Solid
        currentCount++;
      } else {
        icon.className = 'far fa-heart'; // Regular
        currentCount--;
      }

      countSpan.textContent = currentCount;

      // Update Storage
      let favs = JSON.parse(localStorage.getItem('userFavorites') || '[]');

      if (isActive) {
        if (!favs.includes(productName)) favs.push(productName);
      } else {
        favs = favs.filter(n => n !== productName);
      }

      localStorage.setItem('userFavorites', JSON.stringify(favs));
    };
  }
})();
