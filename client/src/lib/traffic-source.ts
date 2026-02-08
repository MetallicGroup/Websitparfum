/**
 * Detect traffic source from URL parameters, localStorage, or referrer
 */
export function detectTrafficSource(): 'facebook' | 'tiktok' | 'organic' {
  if (typeof window === 'undefined') {
    return 'organic';
  }

  // Check URL parameters first
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check for TikTok Click ID
  const ttclid = urlParams.get('ttclid');
  if (ttclid) {
    // Store in localStorage for future use
    localStorage.setItem('ttclid', ttclid);
    return 'tiktok';
  }

  // Check for Facebook Click ID
  const fbclid = urlParams.get('fbclid');
  if (fbclid) {
    // Store in localStorage for future use
    localStorage.setItem('fbclid', fbclid);
    return 'facebook';
  }

  // Check localStorage for stored click IDs
  const storedTtclid = localStorage.getItem('ttclid');
  if (storedTtclid) {
    return 'tiktok';
  }

  const storedFbclid = localStorage.getItem('fbclid');
  if (storedFbclid) {
    return 'facebook';
  }

  // Check referrer
  const referrer = document.referrer.toLowerCase();
  if (referrer.includes('tiktok.com') || referrer.includes('tiktok')) {
    return 'tiktok';
  }
  
  if (referrer.includes('facebook.com') || referrer.includes('fb.com') || referrer.includes('instagram.com')) {
    return 'facebook';
  }

  // Check UTM parameters
  const utmSource = urlParams.get('utm_source');
  if (utmSource) {
    const source = utmSource.toLowerCase();
    if (source.includes('tiktok')) {
      return 'tiktok';
    }
    if (source.includes('facebook') || source.includes('fb') || source.includes('instagram')) {
      return 'facebook';
    }
  }

  // Default to organic
  return 'organic';
}
