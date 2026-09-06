/**
 * 2RISM TRAVEL PLATFORM - MODERN INTERACTION CONTROLLER
 * Smooth transitions, interactive filters, modals, wishlist bookmarks, and drawer navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. SCROLL REVEAL ANIMATIONS (Elegant & Non-Intrusive)
  // =========================================================================
  if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
      origin: 'bottom',
      distance: '24px',
      duration: 800,
      delay: 100,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      reset: false,
      mobile: false,
    });

    sr.reveal('.showcase-content .hero-tag', { delay: 100 });
    sr.reveal('.showcase-content h1', { delay: 200 });
    sr.reveal('.showcase-content .showcase-lead', { delay: 300 });
    sr.reveal('.hero-actions', { delay: 400 });
    sr.reveal('.showcase-search', { delay: 450, distance: '30px' });
    sr.reveal('.destinations .title-container', { delay: 200 });
    sr.reveal('.destinations .swiper', { delay: 300 });
    sr.reveal('.hotel-restaurants .title-container', { delay: 200 });
    sr.reveal('.hotel-card', { delay: 300 });
    sr.reveal('#tours .title-container', { delay: 200 });
    sr.reveal('.tours-cards', { delay: 300 });
    sr.reveal('#activities .title-container', { delay: 200 });
    sr.reveal('.activities-cards', { delay: 300 });
    sr.reveal('.trust-section', { delay: 200 });
    sr.reveal('.about-content', { origin: 'left', delay: 200 });
    sr.reveal('.about-img', { origin: 'right', delay: 300 });
  }

  // =========================================================================
  // 2. POPULAR DESTINATIONS SWIPER CAROUSEL
  // =========================================================================
  let swiperInstance = null;
  if (typeof Swiper !== 'undefined' && document.querySelector('.swiper1')) {
    swiperInstance = new Swiper('.swiper1', {
      slidesPerView: 1.4,
      spaceBetween: 14,
      loop: true,
      speed: 600,
      grabCursor: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      breakpoints: {
        480: {
          slidesPerView: 2.2,
          spaceBetween: 16,
        },
        768: {
          slidesPerView: 3.2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 4.4,
          spaceBetween: 22,
        },
        1280: {
          slidesPerView: 5.2,
          spaceBetween: 24,
        },
      },
    });

    // Custom Navigation Arrows
    const prevBtn = document.getElementById('swiperPrev');
    const nextBtn = document.getElementById('swiperNext');
    if (prevBtn && swiperInstance) {
      prevBtn.addEventListener('click', () => swiperInstance.slidePrev());
    }
    if (nextBtn && swiperInstance) {
      nextBtn.addEventListener('click', () => swiperInstance.slideNext());
    }
  }

  // =========================================================================
  // 3. TOAST NOTIFICATION SYSTEM
  // =========================================================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, iconClass = 'uil-check') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="uil ${iconClass}"></i>
      </div>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    // Fade in
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto dismiss
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    }, 3200);
  }

  // =========================================================================
  // 4. WISHLIST & FAVORITE BOOKMARKS (WITH OFF-CANVAS DRAWER)
  // =========================================================================
  const savedCounter = document.getElementById('savedCounter');
  const drawerCount = document.getElementById('drawerCount');
  const wishlistDrawer = document.getElementById('wishlistDrawer');
  const wishlistCloseBtn = document.getElementById('wishlistCloseBtn');
  const wishlistEmptyState = document.getElementById('wishlistEmptyState');
  const wishlistItemsList = document.getElementById('wishlistItemsList');
  const wishlistFooter = document.getElementById('wishlistFooter');
  const wishlistSubtotal = document.getElementById('wishlistSubtotal');
  const wishlistExploreBtn = document.getElementById('wishlistExploreBtn');
  const wishlistCheckoutBtn = document.getElementById('wishlistCheckoutBtn');

  let savedPlaces = [];

  function updateWishlistUI() {
    const count = savedPlaces.length;
    if (savedCounter) savedCounter.textContent = count;
    if (drawerCount) drawerCount.textContent = count;

    if (!wishlistItemsList) return;

    if (count === 0) {
      if (wishlistEmptyState) wishlistEmptyState.style.display = 'block';
      if (wishlistFooter) wishlistFooter.style.display = 'none';
      wishlistItemsList.innerHTML = '';
      return;
    }

    if (wishlistEmptyState) wishlistEmptyState.style.display = 'none';
    if (wishlistFooter) wishlistFooter.style.display = 'block';

    let totalVal = 0;
    wishlistItemsList.innerHTML = savedPlaces
      .map((item, idx) => {
        const numPrice = parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 0;
        totalVal += numPrice;
        return `
        <div class="wishlist-item" data-idx="${idx}">
          <img src="${item.img}" alt="${item.name}" />
          <div class="wishlist-item-info">
            <h4>${item.name}</h4>
            <p><i class="uil uil-map-pin"></i> ${item.loc}</p>
            <div class="wishlist-item-price">${item.price} / night</div>
          </div>
          <div class="wishlist-item-actions">
            <button type="button" class="wishlist-item-remove" data-idx="${idx}" title="Remove">
              <i class="uil uil-trash-alt"></i>
            </button>
            <button type="button" class="wishlist-item-book" data-idx="${idx}">Book</button>
          </div>
        </div>
      `;
      })
      .join('');

    if (wishlistSubtotal) {
      wishlistSubtotal.textContent = `$${totalVal}`;
    }
  }

  function openWishlistDrawer() {
    if (wishlistDrawer) wishlistDrawer.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('active');
  }

  function closeWishlistDrawer() {
    if (wishlistDrawer) wishlistDrawer.classList.remove('open');
    if (mobileOverlay && !document.getElementById('mainNavbar')?.classList.contains('navlistOn')) {
      mobileOverlay.classList.remove('active');
    }
  }

  if (wishlistCloseBtn) wishlistCloseBtn.addEventListener('click', closeWishlistDrawer);
  if (wishlistExploreBtn) {
    wishlistExploreBtn.addEventListener('click', () => {
      closeWishlistDrawer();
      const staysSec = document.getElementById('restaurants');
      if (staysSec) staysSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (wishlistCheckoutBtn) {
    wishlistCheckoutBtn.addEventListener('click', () => {
      closeWishlistDrawer();
      showToast('Concierge inquiry received! An itinerary specialist will contact you.', 'uil-check-circle');
    });
  }

  // Wishlist item action delegation (Remove / Book)
  if (wishlistItemsList) {
    wishlistItemsList.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.wishlist-item-remove');
      if (removeBtn) {
        const idx = parseInt(removeBtn.getAttribute('data-idx'), 10);
        const removed = savedPlaces.splice(idx, 1)[0];
        // unmark button on page if visible
        document.querySelectorAll('.card-fav-btn.active').forEach((btn) => {
          const card = btn.closest('.destination-card, .hotel-cards');
          const title = card ? card.getAttribute('data-title') || card.getAttribute('data-name') : '';
          if (title === removed.name) {
            btn.classList.remove('active');
          }
        });
        updateWishlistUI();
        showToast('Item removed from wishlist.', 'uil-trash');
        return;
      }

      const bookBtn = e.target.closest('.wishlist-item-book');
      if (bookBtn) {
        const idx = parseInt(bookBtn.getAttribute('data-idx'), 10);
        const item = savedPlaces[idx];
        closeWishlistDrawer();
        openQuickViewModal({
          title: item.name,
          location: item.loc,
          price: `${item.price} / night`,
          img: item.img,
          badge: 'Wishlist Item',
          description: `You saved this exquisite property located in ${item.loc}. Enjoy exclusive direct booking privileges with free cancellation up to 48 hours prior to check-in.`,
        });
      }
    });
  }

  // Handle heart button toggle on cards
  document.addEventListener('click', (e) => {
    const favBtn = e.target.closest('.card-fav-btn');
    if (!favBtn) return;
    e.stopPropagation();

    favBtn.classList.toggle('active');
    const isActive = favBtn.classList.contains('active');

    const card = favBtn.closest('.destination-card, .hotel-cards');
    const name = card ? card.getAttribute('data-title') || card.getAttribute('data-name') || 'Curated Place' : 'Curated Place';
    const loc = card ? card.getAttribute('data-loc') || '' : '';
    const price = card ? card.getAttribute('data-price') || '$250' : '$250';
    const imgEl = card ? card.querySelector('img') : null;
    const img = imgEl ? imgEl.src : '';

    if (isActive) {
      if (!savedPlaces.some((p) => p.name === name)) {
        savedPlaces.push({ name, loc, price, img });
      }
      showToast(`Added "${name}" to your wishlist!`, 'uil-heart');
    } else {
      savedPlaces = savedPlaces.filter((p) => p.name !== name);
      showToast(`Removed from wishlist.`, 'uil-heart-break');
    }

    updateWishlistUI();
  });

  const savedTripsBtn = document.getElementById('savedTripsBtn');
  if (savedTripsBtn) {
    savedTripsBtn.addEventListener('click', () => {
      openWishlistDrawer();
    });
  }

  // =========================================================================
  // 5. INTERACTIVE SEARCH BAR & DROPDOWNS
  // =========================================================================
  const filterLocation = document.getElementById('filterLocation');
  const locationInput = document.getElementById('locationInput');
  const locationDropdown = document.getElementById('locationDropdown');

  const filterDate = document.getElementById('filterDate');
  const dateInput = document.getElementById('dateInput');
  const dateDropdown = document.getElementById('dateDropdown');

  const filterGuests = document.getElementById('filterGuests');
  const guestDisplay = document.getElementById('guestDisplay');
  const guestsDropdown = document.getElementById('guestsDropdown');

  const allFilters = [filterLocation, filterDate, filterGuests];

  // Helper to close all dropdowns
  function closeAllDropdowns() {
    allFilters.forEach((f) => f && f.classList.remove('open'));
  }

  // Toggle Dropdowns
  if (filterLocation) {
    filterLocation.addEventListener('click', (e) => {
      if (e.target.closest('.dropdown-item')) return;
      const isOpen = filterLocation.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) filterLocation.classList.add('open');
    });
  }

  if (filterDate) {
    filterDate.addEventListener('click', (e) => {
      if (e.target.closest('.dropdown-item')) return;
      const isOpen = filterDate.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) filterDate.classList.add('open');
    });
  }

  if (filterGuests) {
    filterGuests.addEventListener('click', (e) => {
      if (e.target.closest('.stepper-btn')) return;
      const isOpen = filterGuests.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) filterGuests.classList.add('open');
    });
  }

  // Click outside to dismiss dropdowns
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.filter')) {
      closeAllDropdowns();
    }
  });

  // Location item selection
  if (locationDropdown && locationInput) {
    locationDropdown.querySelectorAll('.dropdown-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = item.getAttribute('data-val');
        locationInput.value = val;
        closeAllDropdowns();
      });
    });
  }

  // Date item selection
  if (dateDropdown && dateInput) {
    dateDropdown.querySelectorAll('.dropdown-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const d = item.getAttribute('data-date');
        dateInput.value = d;
        closeAllDropdowns();
      });
    });
  }

  // Guests Stepper logic
  let adults = 2;
  let children = 0;
  const adultCount = document.getElementById('adultCount');
  const childCount = document.getElementById('childCount');
  const adultMinus = document.getElementById('adultMinus');
  const adultPlus = document.getElementById('adultPlus');
  const childMinus = document.getElementById('childMinus');
  const childPlus = document.getElementById('childPlus');

  function updateGuestText() {
    const total = adults + children;
    if (guestDisplay) {
      guestDisplay.textContent = `${total} guest${total > 1 ? 's' : ''}, 1 room`;
    }
    if (adultCount) adultCount.textContent = adults;
    if (childCount) childCount.textContent = children;
  }

  if (adultMinus) {
    adultMinus.addEventListener('click', (e) => {
      e.stopPropagation();
      if (adults > 1) {
        adults--;
        updateGuestText();
      }
    });
  }
  if (adultPlus) {
    adultPlus.addEventListener('click', (e) => {
      e.stopPropagation();
      if (adults < 8) {
        adults++;
        updateGuestText();
      }
    });
  }
  if (childMinus) {
    childMinus.addEventListener('click', (e) => {
      e.stopPropagation();
      if (children > 0) {
        children--;
        updateGuestText();
      }
    });
  }
  if (childPlus) {
    childPlus.addEventListener('click', (e) => {
      e.stopPropagation();
      if (children < 6) {
        children++;
        updateGuestText();
      }
    });
  }

  // Search Action
  const searchSubmitBtn = document.getElementById('searchSubmitBtn');
  const searchBanner = document.getElementById('searchBanner');
  const searchBannerText = document.getElementById('searchBannerText');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  function executeSearch() {
    closeAllDropdowns();
    const query = (locationInput ? locationInput.value.trim() : '').toLowerCase();
    const hotelCards = document.querySelectorAll('.hotel-cards');
    let matchCount = 0;

    hotelCards.forEach((card) => {
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const loc = (card.getAttribute('data-loc') || '').toLowerCase();

      if (!query || name.includes(query) || loc.includes(query)) {
        card.style.display = 'flex';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (searchBanner && searchBannerText) {
      searchBannerText.textContent = query
        ? `Found ${matchCount} match${matchCount === 1 ? '' : 'es'} for "${query}".`
        : `Showing all ${matchCount} certified luxury recommendations.`;
      searchBanner.classList.add('visible');
    }

    showToast(`Found ${matchCount} available properties.`, 'uil-search');

    const staysSection = document.getElementById('restaurants');
    if (staysSection) {
      staysSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (searchSubmitBtn) {
    searchSubmitBtn.addEventListener('click', executeSearch);
  }
  if (locationInput) {
    locationInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executeSearch();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (locationInput) locationInput.value = '';
      if (dateInput) dateInput.value = 'Flexible Dates';
      const hotelCards = document.querySelectorAll('.hotel-cards');
      hotelCards.forEach((card) => {
        if (card.classList.contains('off') && !card.classList.contains('on')) {
          card.style.display = 'none';
        } else {
          card.style.display = 'flex';
        }
      });
      if (searchBanner) searchBanner.classList.remove('visible');
      showToast('Search filters reset.', 'uil-redo');
    });
  }

  // =========================================================================
  // 6. HOTEL CATEGORY FILTER TABS
  // =========================================================================
  const categoryTabBtns = document.querySelectorAll('#hotelCategoryTabs .filter-tab-btn');
  const hotelCards = document.querySelectorAll('.hotel-cards');

  categoryTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryTabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      hotelCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        const isOff = card.classList.contains('off') && !card.classList.contains('on');

        if (isOff) {
          card.style.display = 'none';
          return;
        }

        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 7. EXPAND / COLLAPSE HOTELS ("VIEW ALL" BUTTON)
  // =========================================================================
  const hotelToggleBtn = document.getElementById('hotelToggleBtn');
  const hiddenHotelCards = document.querySelectorAll('.hotel-cards.off');

  if (hotelToggleBtn) {
    hotelToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = hotelToggleBtn.getAttribute('data-expanded') === 'true';

      hiddenHotelCards.forEach((card) => {
        card.classList.toggle('on', !isExpanded);
        if (!isExpanded) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      if (!isExpanded) {
        hotelToggleBtn.innerHTML = `<span>Show Less</span> <img src="/Imgs/icons/bleft.png" style="transform: rotate(180deg);" alt="">`;
        hotelToggleBtn.setAttribute('data-expanded', 'true');
      } else {
        hotelToggleBtn.innerHTML = `<span>View All</span> <img src="/Imgs/icons/bleft.png" alt="">`;
        hotelToggleBtn.setAttribute('data-expanded', 'false');
      }
    });
  }

  // =========================================================================
  // 8. QUICK VIEW / BOOKING MODAL
  // =========================================================================
  const quickViewModal = document.getElementById('quickViewModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalLocation = document.getElementById('modalLocation');
  const modalPrice = document.getElementById('modalPrice');
  const modalReserveBtn = document.getElementById('modalReserveBtn');

  function openPlaceModal(data) {
    if (!quickViewModal) return;
    if (modalImg && data.img) modalImg.src = data.img;
    if (modalTitle && data.title) modalTitle.textContent = data.title;
    if (modalLocation && data.loc) {
      modalLocation.innerHTML = `<i class="uil uil-map-pin" style="color: #7b61ff"></i> <span>${data.loc}</span>`;
    }
    if (modalPrice && data.price) {
      modalPrice.innerHTML = `${data.price} <span>${data.unit || '/ night'}</span>`;
    }
    quickViewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePlaceModal() {
    if (!quickViewModal) return;
    quickViewModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closePlaceModal);
  if (quickViewModal) {
    quickViewModal.addEventListener('click', (e) => {
      if (e.target === quickViewModal) closePlaceModal();
    });
  }

  if (modalReserveBtn) {
    modalReserveBtn.addEventListener('click', () => {
      const title = modalTitle ? modalTitle.textContent : 'Stay';
      closePlaceModal();
      showToast(`Reservation confirmed for "${title}"! Check your email.`, 'uil-check-circle');
    });
  }

  // Click on Hotel Cards opens Modal
  document.querySelectorAll('.hotel-cards').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-fav-btn')) return;
      const img = card.querySelector('img.hotel-thumb')?.src;
      const title = card.getAttribute('data-name') || card.querySelector('h5')?.textContent;
      const loc = card.getAttribute('data-loc') || card.querySelector('h6')?.textContent;
      const price = card.getAttribute('data-price') || '$350';
      openPlaceModal({ img, title, loc, price, unit: '/ night' });
    });
  });

  // Click on Tour Cards opens Modal
  document.querySelectorAll('.tours-card').forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.tour-img img')?.src;
      const title = card.getAttribute('data-title') || card.querySelector('h3')?.textContent;
      const loc = card.getAttribute('data-loc') || 'New York, USA';
      const price = card.getAttribute('data-price') || '$65';
      openPlaceModal({ img, title, loc, price, unit: '' });
    });
  });

  // =========================================================================
  // 9. TRAVEL REEL VIDEO MODAL
  // =========================================================================
  const videoModal = document.getElementById('videoModal');
  const playReelBtn = document.getElementById('playReelBtn');
  const videoModalCloseBtn = document.getElementById('videoModalCloseBtn');
  const videoIframe = document.getElementById('videoIframe');

  if (playReelBtn && videoModal) {
    playReelBtn.addEventListener('click', () => {
      videoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (videoIframe) {
        // Play scenic tourism reel video
        videoIframe.src = 'https://www.youtube-nocookie.com/embed/35npVaFGHMY?autoplay=1&mute=0';
      }
    });
  }

  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.classList.remove('active');
    document.body.style.overflow = '';
    if (videoIframe) {
      videoIframe.src = '';
    }
  }

  if (videoModalCloseBtn) videoModalCloseBtn.addEventListener('click', closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  // =========================================================================
  // 10. NEWSLETTER SUBSCRIPTION FORM
  // =========================================================================
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterEmail ? newsletterEmail.value.trim() : '';
      if (!email || !email.includes('@')) {
        showToast('Please provide a valid email address.', 'uil-exclamation-triangle');
        return;
      }

      if (newsletterEmail) newsletterEmail.value = '';
      showToast("You're subscribed! Enjoy 15% off your first luxury stay.", 'uil-envelope-heart');
    });
  }

  // =========================================================================
  // 11. RESPONSIVE MOBILE NAVIGATION DRAWER
  // =========================================================================
  const toggleOnBtn = document.getElementById('toggleOnBtn');
  const toggleCloseBtn = document.getElementById('toggleCloseBtn');
  const mainNavbar = document.getElementById('mainNavbar');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const navLinks = document.querySelectorAll('.navlist a');

  function openMobileNav() {
    if (mainNavbar) mainNavbar.classList.add('navlistOn');
    if (toggleCloseBtn) toggleCloseBtn.classList.add('toggleCloseOn');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (mainNavbar) mainNavbar.classList.remove('navlistOn');
    if (toggleCloseBtn) toggleCloseBtn.classList.remove('toggleCloseOn');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleOnBtn) toggleOnBtn.addEventListener('click', openMobileNav);
  if (toggleCloseBtn) toggleCloseBtn.addEventListener('click', closeMobileNav);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  // Action buttons trigger toasts
  const tourExploreBtn = document.getElementById('tourExploreBtn');
  if (tourExploreBtn) {
    tourExploreBtn.addEventListener('click', () => {
      showToast('Showing all 24 curated cultural itineraries.', 'uil-compass');
    });
  }

  const activityViewBtn = document.getElementById('activityViewBtn');
  if (activityViewBtn) {
    activityViewBtn.addEventListener('click', () => {
      showToast('Browsing all 85 outdoor expeditions.', 'uil-mountain');
    });
  }

  const readMoreAboutBtn = document.getElementById('readMoreAboutBtn');
  if (readMoreAboutBtn) {
    readMoreAboutBtn.addEventListener('click', () => {
      showToast('Our 2026 Sustainability & Conscious Travel Manifesto is being downloaded.', 'uil-file-download-alt');
    });
  }

  // =========================================================================
  // 12. TRENDING SEARCH PILLS & DESTINATION CARD CLICKS
  // =========================================================================
  document.querySelectorAll('.trending-tag-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dest = btn.getAttribute('data-dest');
      if (locationInput) {
        locationInput.value = dest;
        executeSearch();
      }
    });
  });

  document.querySelectorAll('.destination-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-fav-btn')) return;
      const title = card.getAttribute('data-title') || '';
      const loc = card.getAttribute('data-loc') || '';
      if (locationInput) {
        locationInput.value = title;
        executeSearch();
      }
    });
  });

  // Quick Reserve button click handler
  document.addEventListener('click', (e) => {
    const resBtn = e.target.closest('.hotel-quick-reserve-btn');
    if (!resBtn) return;
    e.stopPropagation();

    const card = resBtn.closest('.hotel-cards');
    if (card) {
      const name = card.getAttribute('data-name') || 'Curated Hotel';
      const loc = card.getAttribute('data-loc') || 'World Destination';
      const price = card.getAttribute('data-price') || '$350';
      const thumb = card.querySelector('img.hotel-thumb');
      const img = thumb ? thumb.src : '';

      openQuickViewModal({
        title: name,
        location: loc,
        price: `${price} / night`,
        img: img,
        badge: 'Certified Luxury Stay',
        description: `Experience timeless architectural serenity and peerless hospitality at ${name} in ${loc}. Featuring panoramic vistas, daily farm-to-table breakfast, dedicated host service, and flexible check-in.`,
      });
    }
  });

  // =========================================================================
  // 13. STICKY HEADER & FLOATING BACK TO TOP
  // =========================================================================
  const header = document.querySelector('.header');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (header) {
      if (scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    if (backToTopBtn) {
      if (scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Concierge icon box interaction
  const conciergeBox = document.getElementById('conciergeIconBox');
  if (conciergeBox) {
    conciergeBox.addEventListener('click', () => {
      showToast('Concierge team is active & online. Ready to assist 24/7!', 'uil-headset');
    });
  }
});
