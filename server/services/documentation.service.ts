/**
 * Documentation Service
 * Business logic for documentation pages
 */

import DocumentationRepository from "../repositories/documentation.repository";
import type {
  DocumentationPage,
  CreateDocPageData,
  UpdateDocPageData,
} from "../repositories/documentation.repository";

export interface PageListOptions {
  page?: number;
  limit?: number;
  category?: string;
  publishedOnly?: boolean;
  parentId?: string | null;
}

export interface FormattedPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  category: string;
  parentId: string | null;
  sortOrder: number;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

function formatPage(page: DocumentationPage): FormattedPage {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    content: page.content,
    excerpt: page.excerpt,
    category: page.category,
    parentId: page.parent_id,
    sortOrder: page.sort_order,
    isPublished: Boolean(page.is_published),
    publishedAt: page.published_at,
    createdAt: page.created_at,
    updatedAt: page.updated_at,
  };
}

/**
 * Create a new documentation page
 */
export async function createPage(
  data: CreateDocPageData,
  userId: string,
): Promise<FormattedPage> {
  const page = await DocumentationRepository.create({
    ...data,
    created_by: userId,
  });
  return formatPage(page);
}

/**
 * Update an existing documentation page
 */
export async function updatePage(
  slug: string,
  data: UpdateDocPageData,
  userId: string,
): Promise<FormattedPage> {
  const existing = await DocumentationRepository.findBySlug(slug);

  if (!existing) {
    throw new Error("Page not found");
  }

  const page = await DocumentationRepository.update(existing.id, {
    ...data,
    updated_by: userId,
  });

  return formatPage(page);
}

/**
 * Delete a documentation page
 */
export async function deletePage(slug: string): Promise<void> {
  const existing = await DocumentationRepository.findBySlug(slug);

  if (!existing) {
    throw new Error("Page not found");
  }

  await DocumentationRepository.delete(existing.id);
}

/**
 * Get a single documentation page by slug
 */
export async function getPage(slug: string): Promise<FormattedPage | null> {
  const page = await DocumentationRepository.findBySlug(slug);
  return page ? formatPage(page) : null;
}

/**
 * List documentation pages with filters
 */
export async function listPages(
  options: PageListOptions = {},
): Promise<{
  pages: FormattedPage[];
  total: number;
  page: number;
  limit: number;
}> {
  const { pages, total } = await DocumentationRepository.list(options);

  return {
    pages: pages.map(formatPage),
    total,
    page: options.page || 1,
    limit: options.limit || 50,
  };
}

/**
 * Publish a documentation page
 */
export async function publishPage(
  slug: string,
  userId: string,
): Promise<FormattedPage> {
  const existing = await DocumentationRepository.findBySlug(slug);

  if (!existing) {
    throw new Error("Page not found");
  }

  const page = await DocumentationRepository.update(existing.id, {
    is_published: true,
    updated_by: userId,
  });

  return formatPage(page);
}
