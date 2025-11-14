import { useEffect } from 'react';

interface SeoHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  structuredData?: any;
  noindex?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

const SeoHead: React.FC<SeoHeadProps> = ({
  title = 'MiniTube - YouTube Clone | Watch & Share Videos',
  description = 'MiniTube - Free video sharing platform. Watch, upload and share videos with the world.',
  keywords = 'videos, youtube clone, video sharing, watch videos',
  canonical = 'https://your-frontend-url.onrender.com',
  structuredData,
  noindex = false,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.name = name;
        document.head.appendChild(metaTag);
      }
      metaTag.content = content;
    };

    const updateMetaProperty = (property: string, content: string) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.content = content;
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Update robots meta tag
    updateMetaTag('robots', noindex ? 'noindex, follow' : 'index, follow');

    // Update Open Graph tags
    updateMetaProperty('og:title', ogTitle || title);
    updateMetaProperty('og:description', ogDescription || description);
    updateMetaProperty('og:image', ogImage || '');
    updateMetaProperty('og:url', ogUrl || canonical);
    updateMetaProperty('og:type', ogType);
    updateMetaProperty('og:site_name', 'MiniTube');

    // Update Twitter Card tags
    updateMetaProperty('twitter:card', twitterCard);
    updateMetaProperty('twitter:title', twitterTitle || title);
    updateMetaProperty('twitter:description', twitterDescription || description);
    updateMetaProperty('twitter:image', twitterImage || '');

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    // Add structured data
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }

  }, [
    title, description, keywords, canonical, structuredData, noindex,
    ogTitle, ogDescription, ogImage, ogUrl, ogType,
    twitterCard, twitterTitle, twitterDescription, twitterImage
  ]);

  return null; // This component doesn't render anything
};

export default SeoHead;