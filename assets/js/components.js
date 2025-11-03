// Component loader - injects header and footer automatically
(function(){
  // Load component HTML
  function loadComponent(elementId, componentPath){
    var placeholder = document.getElementById(elementId);
    if(!placeholder) return;
    
    return fetch(componentPath)
      .then(function(res){ return res.text(); })
      .then(function(html){
        placeholder.innerHTML = html;
        // Trigger i18n update if available
        if(window.applyTranslationsToElement){
          window.applyTranslationsToElement(placeholder);
        }
      })
      .catch(function(err){
        console.warn('Failed to load component:', componentPath, err);
      });
  }

  // Auto-load on DOMContentLoaded
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      Promise.all([
        loadComponent('header-placeholder', '/components/header.html'),
        loadComponent('footer-placeholder', '/components/footer.html')
      ]).then(function(){
        // Dispatch event when components are loaded
        document.dispatchEvent(new CustomEvent('componentsLoaded'));
      });
    });
  } else {
    Promise.all([
      loadComponent('header-placeholder', '/components/header.html'),
      loadComponent('footer-placeholder', '/components/footer.html')
    ]).then(function(){
      // Dispatch event when components are loaded
      document.dispatchEvent(new CustomEvent('componentsLoaded'));
    });
  }
})();
