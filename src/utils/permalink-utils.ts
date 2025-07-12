import { siteConfig } from "../config";

export interface PermalinkData {
	slug: string;
	title: string;
	published: Date;
	category?: string | null;
	permalink?: string;
}

/**
 * Generate permalink from pattern and post data
 */
export function generatePermalink(data: PermalinkData): string {
	// If custom permalink is specified in frontmatter, use it directly
	if (data.permalink) {
		return ensureTrailingSlash(data.permalink);
	}

	// Use the configured pattern
	const pattern = siteConfig.permalink?.pattern || "/posts/:slug/";
	
	// Extract date components
	const publishedDate = new Date(data.published);
	const year = publishedDate.getFullYear().toString();
	const month = (publishedDate.getMonth() + 1).toString().padStart(2, '0');
	const day = publishedDate.getDate().toString().padStart(2, '0');
	
	// Generate slug from title if needed
	const slug = data.slug || slugify(data.title);
	
	// Generate title slug (URL-safe version of title)
	const titleSlug = slugify(data.title);
	
	// Generate category slug
	const categorySlug = data.category ? slugify(data.category) : '';
	
	// Replace variables in pattern
	let permalink = pattern
		.replace(/:year/g, year)
		.replace(/:month/g, month)
		.replace(/:day/g, day)
		.replace(/:slug/g, slug)
		.replace(/:title/g, titleSlug)
		.replace(/:category/g, categorySlug);
	
	return ensureTrailingSlash(permalink);
}

/**
 * Convert string to URL-friendly slug
 */
export function slugify(text: string): string {
	return text
		.toString()
		.toLowerCase()
		.trim()
		// Remove special characters
		.replace(/[^\w\s-]/g, '')
		// Replace spaces and multiple hyphens with single hyphen
		.replace(/[\s_-]+/g, '-')
		// Remove leading/trailing hyphens
		.replace(/^-+|-+$/g, '');
}

/**
 * Ensure URL has trailing slash
 */
function ensureTrailingSlash(url: string): string {
	if (!url.endsWith('/')) {
		return url + '/';
	}
	return url;
}

/**
 * Parse permalink pattern to extract variables
 */
export function parsePermalinkPattern(pattern: string): string[] {
	const matches = pattern.match(/:(\w+)/g);
	return matches ? matches.map(match => match.substring(1)) : [];
}

/**
 * Get all possible permalink patterns for a post (for static path generation)
 */
export function getPermalinkVariations(data: PermalinkData): string[] {
	const variations = [];
	
	// Add custom permalink if specified
	if (data.permalink) {
		variations.push(ensureTrailingSlash(data.permalink));
	}
	
	// Add pattern-based permalink
	const patternPermalink = generatePermalink({ ...data, permalink: undefined });
	variations.push(patternPermalink);
	
	// Remove duplicates and return
	return [...new Set(variations)];
}
