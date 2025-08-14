import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
  jsonLd?: Record<string, any>;
}

const SEO = ({ title, description, canonical, jsonLd }: SEOProps) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    if (description) setMeta("description", description);

    // Canonical
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    const url = canonical || window.location.href;
    if (existingCanonical) {
      existingCanonical.setAttribute("href", url);
    } else {
      const link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", url);
      document.head.appendChild(link);
    }

    // JSON-LD structured data
    let script = document.getElementById("seo-jsonld") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "seo-jsonld";
      (script as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(
      jsonLd || {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Business Suitability Assessment (BSA)",
        applicationCategory: "BusinessApplication",
        inLanguage: "th-TH",
        url: window.location.href,
      }
    );
  }, [title, description, canonical, jsonLd]);

  return null;
};

// Force rebuild
export default SEO;
