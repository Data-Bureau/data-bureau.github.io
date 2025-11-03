// Data Bureau — Client-side i18n and UI interactions
document.addEventListener('DOMContentLoaded', function(){
  console.log('Data Bureau — visualização científica (dev)');

  // ---------- page preloader ----------
  var preloader = document.createElement('div');
  preloader.className = 'page-preloader';
  preloader.innerHTML = '<div class="spinner"></div>';
  document.body.insertBefore(preloader, document.body.firstChild);
  
  window.addEventListener('load', function(){
    setTimeout(function(){
      preloader.style.opacity = '0';
      setTimeout(function(){
        preloader.remove();
      }, 300);
    }, 300);
  });

  // ---------- i18n JSON loader and applier ----------
  function loadLocale(locale){
    return fetch('/i18n/' + locale + '.json').then(function(res){
      if(!res.ok) throw new Error('Locale not found: ' + locale);
      return res.json();
    });
  }

  function applyTranslations(dict){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      if(!key) return;
      var val = dict[key];
      if(val!==undefined){
        if(el.tagName.toLowerCase()==='input' || el.tagName.toLowerCase()==='textarea'){
          el.placeholder = val;
        } else {
          el.textContent = val;
        }
      }
    });
    // update meta title/description if provided
    if(dict['meta.title']) document.title = dict['meta.title'];
    var md = document.querySelector('meta[name="description"]');
    if(md && dict['meta.description']) md.setAttribute('content', dict['meta.description']);
  }

  // Expose for component loader
  window.applyTranslationsToElement = function(element){
    var stored = localStorage.getItem('db_lang');
    var locale = stored || document.documentElement.lang || 'pt';
    loadLocale(locale).then(function(dict){
      element.querySelectorAll('[data-i18n]').forEach(function(el){
        var key = el.getAttribute('data-i18n');
        if(!key) return;
        var val = dict[key];
        if(val!==undefined){
          if(el.tagName.toLowerCase()==='input' || el.tagName.toLowerCase()==='textarea'){
            el.placeholder = val;
          } else {
            el.textContent = val;
          }
        }
      });
    });
  };

  var stored = localStorage.getItem('db_lang');
  var initial = stored || document.documentElement.lang || 'pt';

  function setLocale(locale){
    loadLocale(locale).then(function(dict){
      document.documentElement.lang = locale;
      applyTranslations(dict);
      localStorage.setItem('db_lang', locale);
      // update visible toggle buttons
      document.querySelectorAll('.lang-toggle').forEach(function(b){ 
        var icon = b.querySelector('.lang-icon');
        var text = b.querySelector('.lang-text');
        if(icon && text){
          if(locale === 'pt'){
            icon.textContent = '🇺🇸';
            text.textContent = 'EN';
          } else {
            icon.textContent = '🇧🇷';
            text.textContent = 'PT';
          }
        } else {
          // Fallback for old buttons without spans
          b.textContent = locale === 'pt' ? 'EN' : 'PT';
        }
      });
    }).catch(function(err){
      console.warn('i18n load failed:', err);
    });
  }

  // init
  setLocale(initial);

  // wire toggle buttons using event delegation (works for dynamic content)
  document.addEventListener('click', function(e){
    if(e.target.classList.contains('lang-toggle') || e.target.closest('.lang-toggle')){
      e.preventDefault();
      var next = (document.documentElement.lang==='pt')? 'en' : 'pt';
      setLocale(next);
    }
  });

  // ---------- mobile menu toggle ----------
  var mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  var navActions = document.querySelector('.nav-actions');
  
  if(mobileMenuToggle && navActions){
    var body = document.body;
    
    // Create overlay for mobile menu
    var overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    body.appendChild(overlay);
    
    mobileMenuToggle.addEventListener('click', function(){
      var isActive = navActions.classList.contains('active');
      
      if(isActive){
        navActions.classList.remove('active');
        overlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
      } else {
        navActions.classList.add('active');
        overlay.classList.add('active');
        mobileMenuToggle.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        body.style.overflow = 'hidden';
      }
    });
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', function(){
      navActions.classList.remove('active');
      overlay.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    });
    
    // Close menu when clicking a link
    navActions.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        if(window.innerWidth <= 768){
          navActions.classList.remove('active');
          overlay.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
          body.style.overflow = '';
        }
      });
    });
  }

  // ---------- simple testimonial rotation ----------
  var quotes = document.querySelectorAll('.carousel blockquote');
  if(quotes.length>0){
    var idx = 0;
    quotes.forEach(function(q,i){ if(i!==0) q.style.display='none'; });
    setInterval(function(){
      quotes[idx].style.display='none';
      idx = (idx+1)%quotes.length;
      quotes[idx].style.display='block';
    },4000);
  }

  // ---------- smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
    anchor.addEventListener('click', function(e){
      var target = this.getAttribute('href');
      if(target.length>1){
        var el = document.querySelector(target);
        if(el){
          e.preventDefault();
          el.scrollIntoView({behavior:'smooth',block:'start'});
        }
      }
    });
  });

  // ---------- scroll reveal animation ----------
  var scrollElements = document.querySelectorAll('.scroll-reveal');
  
  var elementInView = function(el, offset){
    var elementTop = el.getBoundingClientRect().top;
    return elementTop <= (window.innerHeight || document.documentElement.clientHeight) - (offset || 100);
  };
  var displayScrollElement = function(el){
    el.classList.add('revealed');
  };
  var handleScrollAnimation = function(){
    scrollElements.forEach(function(el){
      if(elementInView(el,100)){
        displayScrollElement(el);
      }
    });
  };
  window.addEventListener('scroll', function(){
    handleScrollAnimation();
  });
  
  // Run on load and after a slight delay to ensure DOM is ready
  handleScrollAnimation();
  setTimeout(handleScrollAnimation, 100);

  // ---------- parallax effect for hero ----------
  var hero = document.querySelector('.hero');
  if(hero){
    window.addEventListener('scroll', function(){
      var scrolled = window.pageYOffset;
      var parallax = hero.querySelector('.hero-figure');
      if(parallax && scrolled < 800){
        parallax.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
      }
    });
  }

  // ---------- add hover transitions ----------
  var cards = document.querySelectorAll('.card, .btn');
  cards.forEach(function(card){
    card.addEventListener('mouseenter', function(){
      this.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
  });

  // ---------- counter animation for numbers (if any) ----------
  var counters = document.querySelectorAll('[data-counter]');
  counters.forEach(function(counter){
    var target = parseInt(counter.getAttribute('data-counter'));
    var count = 0;
    var increment = target / 100;
    var timer = setInterval(function(){
      count += increment;
      if(count >= target){
        count = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(count);
    }, 20);
  });

  // ---------- back to top button ----------
  var backToTop = document.createElement('button');
  backToTop.innerHTML = '↑';
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Voltar ao topo');
  document.body.appendChild(backToTop);
  
  window.addEventListener('scroll', function(){
    if(window.pageYOffset > 300){
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  
  backToTop.addEventListener('click', function(){
    window.scrollTo({top:0, behavior:'smooth'});
  });

  // ---------- image zoom lightbox for case detail images ----------
  var caseImages = document.querySelectorAll('.case-detail .frame img');
  if(caseImages.length > 0){
    // Create lightbox overlay
    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<div class="lightbox-content"><img src="" alt=""><button class="lightbox-close" aria-label="Fechar">&times;</button></div>';
    document.body.appendChild(lightbox);
    
    var lightboxImg = lightbox.querySelector('img');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    
    // Add click handlers to case images
    caseImages.forEach(function(img){
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function(){
        lightboxImg.src = this.src;
        lightboxImg.alt = this.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    
    // Close lightbox
    function closeLightbox(){
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on background click
    lightbox.addEventListener('click', function(e){
      if(e.target === lightbox){
        closeLightbox();
      }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && lightbox.classList.contains('active')){
        closeLightbox();
      }
    });
  }

  // ---------- Before/After Comparison Slider ----------
  function initComparisonSlider(){
    var container = document.querySelector('.comparison-container');
    if(!container){
      console.log('Comparison slider: Container not found');
      return;
    }
    
    var afterDiv = document.querySelector('.comparison-after');
    var divider = document.querySelector('.comparison-divider');
    
    if(!afterDiv || !divider){
      console.log('Comparison slider: After div or divider not found');
      return;
    }
    
    var isDragging = false;

    function updatePosition(percentage){
      percentage = Math.max(0, Math.min(100, percentage));
      afterDiv.style.width = percentage + '%';
      divider.style.left = percentage + '%';
    }

    function getPercentage(clientX){
      var rect = container.getBoundingClientRect();
      var x = clientX - rect.left;
      return (x / rect.width) * 100;
    }

    // Mouse events
    container.addEventListener('mousedown', function(e){
      isDragging = true;
      updatePosition(getPercentage(e.clientX));
      e.preventDefault();
    });

    document.addEventListener('mousemove', function(e){
      if(isDragging){
        updatePosition(getPercentage(e.clientX));
      }
    });

    document.addEventListener('mouseup', function(){
      isDragging = false;
    });

    // Touch events
    container.addEventListener('touchstart', function(e){
      isDragging = true;
      if(e.touches && e.touches.length > 0){
        updatePosition(getPercentage(e.touches[0].clientX));
      }
      e.preventDefault();
    });

    document.addEventListener('touchmove', function(e){
      if(isDragging && e.touches && e.touches.length > 0){
        updatePosition(getPercentage(e.touches[0].clientX));
        e.preventDefault();
      }
    }, {passive: false});

    document.addEventListener('touchend', function(){
      isDragging = false;
    });

    // Initialize at 50%
    updatePosition(50);
    console.log('Comparison slider initialized at 50%');
  }
  
  // ---------- Initialize zoom slider (same logic for modal) ----------
  function initZoomSlider(){
    var zoomContainer = document.getElementById('zoomContainer');
    if(!zoomContainer){
      console.log('Zoom slider: Container not found');
      return;
    }
    
    var zoomAfter = document.getElementById('zoomAfter');
    var zoomDivider = document.getElementById('zoomDivider');
    
    if(!zoomAfter || !zoomDivider){
      console.log('Zoom slider: After div or divider not found');
      return;
    }
    
    var isDragging = false;

    function updatePosition(percentage){
      percentage = Math.max(0, Math.min(100, percentage));
      zoomAfter.style.width = percentage + '%';
      zoomDivider.style.left = percentage + '%';
    }

    function getPercentage(clientX){
      var rect = zoomContainer.getBoundingClientRect();
      var x = clientX - rect.left;
      return (x / rect.width) * 100;
    }

    zoomContainer.addEventListener('mousedown', function(e){
      isDragging = true;
      updatePosition(getPercentage(e.clientX));
      e.preventDefault();
    });

    document.addEventListener('mousemove', function(e){
      if(isDragging){
        updatePosition(getPercentage(e.clientX));
      }
    });

    document.addEventListener('mouseup', function(){
      isDragging = false;
    });

    zoomContainer.addEventListener('touchstart', function(e){
      isDragging = true;
      if(e.touches && e.touches.length > 0){
        updatePosition(getPercentage(e.touches[0].clientX));
      }
      e.preventDefault();
    });

    document.addEventListener('touchmove', function(e){
      if(isDragging && e.touches && e.touches.length > 0){
        updatePosition(getPercentage(e.touches[0].clientX));
        e.preventDefault();
      }
    }, {passive: false});

    document.addEventListener('touchend', function(){
      isDragging = false;
    });

    updatePosition(50);
    console.log('Zoom slider initialized at 50%');
  }
  
  // ---------- Zoom modal controls ----------
  var zoomBtn = document.querySelector('.zoom-slider-btn');
  var zoomModal = document.getElementById('sliderZoomModal');
  var zoomClose = document.querySelector('.slider-zoom-close');
  
  if(zoomBtn && zoomModal){
    zoomBtn.addEventListener('click', function(){
      zoomModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(initZoomSlider, 100);
    });
    
    if(zoomClose){
      zoomClose.addEventListener('click', function(){
        zoomModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    
    zoomModal.addEventListener('click', function(e){
      if(e.target === zoomModal){
        zoomModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && zoomModal.classList.contains('active')){
        zoomModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Wait for images to load before initializing comparison slider
  setTimeout(initComparisonSlider, 500);

  // ---------- Budget Modal (Formulário de Orçamento) ----------
  var budgetModal = document.getElementById('budgetModal');
  var budgetModalClose = document.getElementById('budgetModalClose');
  var openBudgetBtns = document.querySelectorAll('.open-budget-modal');
  
  if(budgetModal && budgetModalClose){
    // Open modal when clicking any button with class .open-budget-modal
    openBudgetBtns.forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        budgetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    
    // Close modal - X button
    budgetModalClose.addEventListener('click', function(){
      budgetModal.classList.remove('active');
      document.body.style.overflow = '';
    });
    
    // Close modal - click outside (on overlay)
    budgetModal.addEventListener('click', function(e){
      if(e.target === budgetModal){
        budgetModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    
    // Close modal - ESC key
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && budgetModal.classList.contains('active')){
        budgetModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  console.log('All Data Bureau scripts initialized successfully');
});
