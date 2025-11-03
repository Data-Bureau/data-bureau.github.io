// Simple UI interactions: language toggle and testimonial rotation
document.addEventListener('DOMContentLoaded', function(){
  console.log('Data Bureau — visualização científica (dev)');

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

  var stored = localStorage.getItem('db_lang');
  var initial = stored || document.documentElement.lang || 'pt';

  function setLocale(locale){
    loadLocale(locale).then(function(dict){
      document.documentElement.lang = locale;
      applyTranslations(dict);
      localStorage.setItem('db_lang', locale);
      // update visible toggle buttons
      document.querySelectorAll('.lang-toggle').forEach(function(b){ b.textContent = locale==='pt'? 'EN' : 'PT'; });
    }).catch(function(err){
      console.warn('i18n load failed:', err);
    });
  }

  // init
  setLocale(initial);

  // wire toggle buttons
  document.querySelectorAll('.lang-toggle').forEach(function(btn){
    btn.addEventListener('click', function(){
      var next = (document.documentElement.lang==='pt')? 'en' : 'pt';
      setLocale(next);
    });
  });

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

});