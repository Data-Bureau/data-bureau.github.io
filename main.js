// Check local storage for a contact email
function checkLocalStorageForEmail() {
    const storedEmail = localStorage.getItem('email');
  
    if (storedEmail) {
      alert(`Contact email found in local storage: ${storedEmail}`);
    } else {
      console.log('No contact email found in local storage.');
    }
  }
  
  // Check cookies for a contact email
  function checkCookiesForEmail() {
    const cookies = document.cookie.split(';');
    let contactEmail = null;
  
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'email') {
        contactEmail = value;
        break;
      }
    }
  
    if (contactEmail) {
      alert(`Contact email found in cookies: ${contactEmail}`);
    } else {
      console.log('No contact email found in cookies.');
    }
  }
  
  // Call the functions to check local storage and cookies
  checkLocalStorageForEmail();
  checkCookiesForEmail();
  