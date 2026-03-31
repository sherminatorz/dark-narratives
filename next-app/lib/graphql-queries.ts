/**
 * GraphQL Queries for WordPress Headless CMS
 * Used with WPGraphQL to fetch content from WordPress
 */

// ─── Get all posts with ACF fields ──────────────────────────────────────────

export const GET_POSTS_QUERY = `
  query GetPosts($first: Int = 9, $after: String, $categoryIn: [ID]) {
    posts(first: $first, after: $after, where: { categoryIn: $categoryIn, status: PUBLISH }) {
      edges {
        node {
          id
          databaseId
          title
          slug
          excerpt
          content
          datePublished
          featured {
            node {
              sourceUrl
              altText
            }
          }
          readingTime: acfReadingTime
          featured: acfFeatured
          trending: acfTrending
          tags: acfTags
          location: acfLocation
          timeline: acfTimeline {
            date
            title
            description
          }
          categories(first: 1) {
            edges {
              node {
                id
                databaseId
                name
                slug
                description
                acfCategoryImage {
                  sourceUrl
                  altText
                }
              }
            }
          }
          author {
            node {
              id
              name
              avatar {
                url
              }
              acfAuthorBio
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        total: total
      }
    }
  }
`;

// ─── Get single post by slug ────────────────────────────────────────────────

export const GET_POST_BY_SLUG_QUERY = `
  query GetPostBySlug($slug: String!) {
    postBy(slug: $slug) {
      id
      databaseId
      title
      slug
      excerpt
      content
      datePublished
      featured {
        node {
          sourceUrl
          altText
        }
      }
      readingTime: acfReadingTime
      featured: acfFeatured
      trending: acfTrending
      tags: acfTags
      location: acfLocation
      timeline: acfTimeline {
        date
        title
        description
      }
      categories(first: 1) {
        edges {
          node {
            id
            databaseId
            name
            slug
            description
            acfCategoryImage {
              sourceUrl
              altText
            }
          }
        }
      }
      author {
        node {
          id
          name
          avatar {
            url
          }
          acfAuthorBio
        }
      }
    }
  }
`;

// ─── Get all post slugs for static generation ───────────────────────────────

export const GET_ALL_SLUGS_QUERY = `
  query GetAllPostSlugs($first: Int = 100, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      edges {
        node {
          slug
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// ─── Get categories ────────────────────────────────────────────────────────

export const GET_CATEGORIES_QUERY = `
  query GetCategories {
    categories(first: 100, where: { hideEmpty: true }) {
      edges {
        node {
          id
          databaseId
          name
          slug
          description
          acfCategoryImage {
            sourceUrl
            altText
          }
          posts {
            pageInfo {
              total
            }
          }
        }
      }
    }
  }
`;

// ─── Get category by slug ──────────────────────────────────────────────────

export const GET_CATEGORY_BY_SLUG_QUERY = `
  query GetCategoryBySlug($slug: String!) {
    categoryBy(slug: $slug) {
      id
      databaseId
      name
      slug
      description
      acfCategoryImage {
        sourceUrl
        altText
      }
      posts {
        pageInfo {
          total
        }
      }
    }
  }
`;

// ─── Get related posts ─────────────────────────────────────────────────────

export const GET_RELATED_POSTS_QUERY = `
  query GetRelatedPosts($categoryIn: [ID!], $notIn: [ID!], $first: Int = 3) {
    posts(
      first: $first
      where: {
        categoryIn: $categoryIn
        excludeIds: $notIn
        status: PUBLISH
      }
    ) {
      edges {
        node {
          id
          databaseId
          title
          slug
          excerpt
          featured {
            node {
              sourceUrl
              altText
            }
          }
          author {
            node {
              name
            }
          }
        }
      }
    }
  }
`;

// ─── Get featured post ─────────────────────────────────────────────────────

export const GET_FEATURED_POSTS_QUERY = `
  query GetFeaturedPosts($first: Int = 1) {
    posts(
      first: $first
      where: {
        metaKey: "featured"
        metaValue: "true"
        status: PUBLISH
      }
    ) {
      edges {
        node {
          id
          databaseId
          title
          slug
          excerpt
          content
          datePublished
          featured {
            node {
              sourceUrl
              altText
            }
          }
          readingTime: acfReadingTime
          featured: acfFeatured
          trending: acfTrending
          tags: acfTags
          author {
            node {
              id
              name
              avatar {
                url
              }
              acfAuthorBio
            }
          }
        }
      }
    }
  }
`;

// ─── Get trending posts ────────────────────────────────────────────────────

export const GET_TRENDING_POSTS_QUERY = `
  query GetTrendingPosts($first: Int = 6) {
    posts(
      first: $first
      where: {
        metaKey: "trending"
        metaValue: "true"
        status: PUBLISH
      }
    ) {
      edges {
        node {
          id
          databaseId
          title
          slug
          excerpt
          featured {
            node {
              sourceUrl
              altText
            }
          }
          author {
            node {
              name
            }
          }
          categories(first: 1) {
            edges {
              node {
                slug
                name
              }
            }
          }
        }
      }
    }
  }
`;
