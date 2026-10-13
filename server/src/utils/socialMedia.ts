export interface SocialMediaMetadata {
    success: boolean;
    platform: string;
    title: string | null;
    thumbnailUrl: string | null;
    postUrl: string;
    error?: string;
}

export function detectPlatform(urlStr: string): string {
    try {
        const parsed = new URL(urlStr);
        const host = parsed.hostname.toLowerCase();
        if (host.includes('instagram.com') || host.includes('instagr.am')) return 'instagram';
        if (host.includes('facebook.com') || host.includes('fb.watch') || host.includes('fb.com')) return 'facebook';
        if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
        if (host.includes('twitter.com') || host.includes('x.com')) return 'twitter';
        if (host.includes('tiktok.com')) return 'tiktok';
        if (host.includes('linkedin.com')) return 'linkedin';
        return 'other';
    } catch {
        return 'other';
    }
}

export function isValidUrl(urlStr: string): boolean {
    try {
        const parsed = new URL(urlStr);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

// Fetch helper with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 5000): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        return res;
    } finally {
        clearTimeout(timer);
    }
}

// Extract Open Graph and Twitter tags from raw HTML
function extractMetaTags(html: string, baseUrl: string): { title: string | null; image: string | null } {
    let title: string | null = null;
    let image: string | null = null;

    // og:image or twitter:image
    const imageMatch =
        html.match(/<meta\s+[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
        html.match(/<meta\s+[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i) ||
        html.match(/<meta\s+[^>]*property=["']og:image:url["'][^>]*content=["']([^"']+)["']/i);

    if (imageMatch && imageMatch[1]) {
        let rawImg = imageMatch[1].trim();
        // Decode html entities like &amp;
        rawImg = rawImg.replace(/&amp;/g, '&');
        try {
            image = new URL(rawImg, baseUrl).href;
        } catch {
            image = rawImg;
        }
    }

    // og:title or twitter:title or <title>
    const titleMatch =
        html.match(/<meta\s+[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i) ||
        html.match(/<meta\s+[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<title>([^<]+)<\/title>/i);

    if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim().replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
    }

    return { title, image };
}

// YouTube helper
async function fetchYouTubeMetadata(url: string): Promise<{ title: string | null; image: string | null }> {
    let videoId: string | null = null;
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes('youtu.be')) {
            videoId = parsed.pathname.slice(1).split('/')[0];
        } else if (parsed.pathname.includes('/shorts/')) {
            const parts = parsed.pathname.split('/shorts/');
            videoId = parts[1]?.split('/')[0]?.split('?')[0] || null;
        } else if (parsed.pathname.includes('/embed/')) {
            const parts = parsed.pathname.split('/embed/');
            videoId = parts[1]?.split('/')[0]?.split('?')[0] || null;
        } else {
            videoId = parsed.searchParams.get('v');
        }
    } catch {
        // ignore
    }

    // Try YouTube oEmbed first for official title + thumbnail
    try {
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
        const res = await fetchWithTimeout(oembedUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        }, 4000);
        if (res.ok) {
            const data: any = await res.json();
            return {
                title: data.title || null,
                image: data.thumbnail_url || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null)
            };
        }
    } catch {
        // Fallback below
    }

    if (videoId) {
        return {
            title: null,
            image: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        };
    }

    return { title: null, image: null };
}

// TikTok helper
async function fetchTikTokMetadata(url: string): Promise<{ title: string | null; image: string | null }> {
    try {
        const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
        const res = await fetchWithTimeout(oembedUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        }, 4000);
        if (res.ok) {
            const data: any = await res.json();
            return {
                title: data.title || (data.author_name ? `TikTok by ${data.author_name}` : null),
                image: data.thumbnail_url || null
            };
        }
    } catch {
        // Fallback
    }
    return { title: null, image: null };
}

// Twitter / X helper
async function fetchTwitterMetadata(url: string): Promise<{ title: string | null; image: string | null }> {
    // 1. Try fxtwitter API for media photos
    try {
        const parsed = new URL(url);
        const tweetMatch = parsed.pathname.match(/status\/(\d+)/);
        if (tweetMatch && tweetMatch[1]) {
            const tweetId = tweetMatch[1];
            const fxRes = await fetchWithTimeout(`https://api.fxtwitter.com/status/${tweetId}`, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            }, 3000);
            if (fxRes.ok) {
                const fxData: any = await fxRes.json();
                const tweet = fxData?.tweet;
                if (tweet) {
                    const mediaImg = tweet.media?.photos?.[0]?.url || tweet.media?.videos?.[0]?.thumbnail_url || null;
                    return {
                        title: tweet.text ? (tweet.text.length > 80 ? tweet.text.slice(0, 77) + '...' : tweet.text) : null,
                        image: mediaImg
                    };
                }
            }
        }
    } catch {
        // fallback
    }

    // 2. Try Twitter oEmbed
    try {
        const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`;
        const res = await fetchWithTimeout(oembedUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        }, 3000);
        if (res.ok) {
            const data: any = await res.json();
            return {
                title: data.author_name ? `Post by ${data.author_name} on X` : null,
                image: null
            };
        }
    } catch {
        // fallback
    }

    return { title: null, image: null };
}

export async function fetchSocialMediaMetadata(rawUrl: string): Promise<SocialMediaMetadata> {
    let cleanUrl = rawUrl.trim();
    if (!cleanUrl) {
        return {
            success: false,
            platform: 'other',
            title: null,
            thumbnailUrl: null,
            postUrl: rawUrl,
            error: 'URL is required'
        };
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
    }

    if (!isValidUrl(cleanUrl)) {
        return {
            success: false,
            platform: 'other',
            title: null,
            thumbnailUrl: null,
            postUrl: cleanUrl,
            error: 'Invalid URL format'
        };
    }

    const platform = detectPlatform(cleanUrl);

    try {
        if (platform === 'youtube') {
            const yt = await fetchYouTubeMetadata(cleanUrl);
            return {
                success: true,
                platform,
                title: yt.title || 'YouTube Video',
                thumbnailUrl: yt.image,
                postUrl: cleanUrl
            };
        }

        if (platform === 'tiktok') {
            const tt = await fetchTikTokMetadata(cleanUrl);
            if (tt.image || tt.title) {
                return {
                    success: true,
                    platform,
                    title: tt.title || 'TikTok Post',
                    thumbnailUrl: tt.image,
                    postUrl: cleanUrl
                };
            }
        }

        if (platform === 'twitter') {
            const tw = await fetchTwitterMetadata(cleanUrl);
            return {
                success: true,
                platform,
                title: tw.title || 'X / Twitter Post',
                thumbnailUrl: tw.image,
                postUrl: cleanUrl
            };
        }

        // Generic Open Graph fetch for Instagram, Facebook, and other URLs
        const response = await fetchWithTimeout(cleanUrl, {
            headers: {
                'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.html) Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        }, 5000);

        if (response.ok) {
            const html = await response.text();
            const { title, image } = extractMetaTags(html, cleanUrl);
            return {
                success: true,
                platform,
                title: title || (platform === 'instagram' ? 'Instagram Post' : platform === 'facebook' ? 'Facebook Post' : null),
                thumbnailUrl: image,
                postUrl: cleanUrl
            };
        } else {
            // Even if HTTP status wasn't 200 (e.g. 403 or redirect), return platform info gracefully
            return {
                success: true,
                platform,
                title: platform === 'instagram' ? 'Instagram Post' : platform === 'facebook' ? 'Facebook Post' : null,
                thumbnailUrl: null,
                postUrl: cleanUrl
            };
        }
    } catch (err: any) {
        // Return gracefully so nothing crashes
        return {
            success: true,
            platform,
            title: platform === 'instagram' ? 'Instagram Post' : platform === 'facebook' ? 'Facebook Post' : null,
            thumbnailUrl: null,
            postUrl: cleanUrl
        };
    }
}
