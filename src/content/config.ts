import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),
		permalink: z.string().optional(), // Custom permalink for the post

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});

const moviesCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		originalTitle: z.string().optional().default(""),
		year: z.number().int(),
		watchedDate: z.date(),
		rating: z.number().min(0).max(10),
		poster: z.string().optional().default(""),
		genres: z.array(z.string()).optional().default([]),
		country: z.string().optional().default(""),
		director: z.string().optional().default(""),
		status: z.enum(["watched", "rewatched", "watchlist"]).default("watched"),
		tags: z.array(z.string()).optional().default([]),
		draft: z.boolean().optional().default(false),
	}),
});

export const collections = {
	posts: postsCollection,
	movies: moviesCollection,
};
