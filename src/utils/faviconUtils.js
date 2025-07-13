const getFaviconCacheKey = (url) => {
  try {
    const hostname = new URL(url).hostname;
    return `favicon_${hostname}`;
  } catch (e) {
    return null;
  }
};

const fetchAndCacheFavicon = async (url) => {
  const cacheKey = getFaviconCacheKey(url);
  if (!cacheKey) return `https://favicon.im/${new URL(url).hostname}?larger=true`; // Fallback if URL is invalid

  const hostname = new URL(url).hostname;
  const faviconSources = [
    `https://favicon.im/${hostname}?larger=true`,
    `https://www.google.com/s2/favicons?domain=${hostname}`
  ];

  let fetchedBase64 = null;

  for (const sourceUrl of faviconSources) {
    try {
      const response = await fetch(sourceUrl);
      if (response.ok) {
        const blob = await response.blob();
        if (blob.size < 100) { // Threshold of 100 bytes, adjust if necessary
          console.warn(`Fetched favicon from ${sourceUrl} is too small (${blob.size} bytes), trying next source.`);
          continue;
        }

        fetchedBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        break;
      }
    } catch (error) {
      console.warn(`Failed to fetch favicon from ${sourceUrl}:`, error);
    }
  }

  if (fetchedBase64) {
    try {
      localStorage.setItem(cacheKey, fetchedBase64);
    } catch (e) {
      console.error("Failed to save favicon to localStorage", e);
    }
    return fetchedBase64;
  } else {
    // If all sources fail, fall back to the original favicon.im URL
    return `https://favicon.im/${hostname}?larger=true`;
  }
};

export { getFaviconCacheKey, fetchAndCacheFavicon };