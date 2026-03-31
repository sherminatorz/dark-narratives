# WordPress Headless CMS Integration Guide

## Overview
This guide explains how to set up your WordPress installation to work with the Dark Narratives Next.js application using GraphQL and Advanced Custom Fields (ACF).

## Prerequisites
✅ **Already installed on your WordPress:**
- Advanced Custom Fields PRO
- Custom Post Type UI
- Headless Mode
- Rank Math SEO
- WPGraphQL
- WPGraphQL for ACF
- WPGraphQL for Rank Math SEO
- WPGraphQL IDE

## Step 1: Configure Environment Variables

In your Next.js project, create a `.env.local` file:

```bash
# WordPress GraphQL endpoint
NEXT_PUBLIC_WP_GRAPHQL_URL=https://www.cms.groupashop.com/graphql

# Your site URL
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Enable WordPress integration
NEXT_PUBLIC_USE_WORDPRESS=true
```

## Step 2: Create ACF Field Groups

### 2.1 Story Fields Field Group

Log into WordPress Admin → ACF → Field Groups → Add New

**Location Rules:** Post Type → is equal to → Post

**Fields to Create:**

| Field Label | Field Name | Field Type | Required | Settings |
|---|---|---|---|---|
| Featured | featured | True/False | Yes | - |
| Trending | trending | True/False | Yes | - |
| Reading Time (minutes) | reading_time | Number | No | Min: 0, Max: 1000 |
| Location | location | Text | No | - |
| Tags | tags | Text | No | - |
| Timeline | timeline | Repeater | No | See below |

**Timeline Sub-Fields (Repeater):**
| Sub-Field Label | Sub-Field Name | Field Type |
|---|---|---|
| Date | date | Date Picker |
| Title | title | Text |
| Description | description | Text Area |

**Graphql Settings** (for each field):
- Show in GraphQL: ✓ Checked
- GraphQL Field Name: `acf{FieldName}` (e.g., `acfFeatured`, `acfReadingTime`)

### 2.2 Category Fields

**Location Rules:** Taxonomy → is equal to → Category

**Fields to Create:**

| Field Label | Field Name | Field Type | Settings |
|---|---|---|---|
| Category Image | category_image | Image | Return Format: Array |

**GraphQL Settings:**
- Show in GraphQL: ✓ Checked
- GraphQL Field Name: `acfCategoryImage`

### 2.3 Author (User) Fields

**Location Rules:** User Form → is equal to → All

**Fields to Create:**

| Field Label | Field Name | Field Type | Settings |
|---|---|---|---|
| Author Bio | author_bio | Text Area | - |

**GraphQL Settings:**
- Show in GraphQL: ✓ Checked
- GraphQL Field Name: `acfAuthorBio`

## Step 3: Verify GraphQL Schema

1. Go to your GraphQL IDE: `https://www.cms.groupashop.com/graphql`

2. Run this query to verify the fields are exposed:

```graphql
{
  posts(first: 1) {
    edges {
      node {
        id
        title
        slug
        acfFeatured
        acfTrending
        acfReadingTime
        acfLocation
        acfTags
        acfTimeline {
          date
          title
          description
        }
      }
    }
  }
}
```

3. Check categories:

```graphql
{
  categories(first: 1) {
    edges {
      node {
        id
        name
        slug
        acfCategoryImage {
          sourceUrl
          altText
        }
      }
    }
  }
}
```

## Step 4: Enable REST API (Optional)

If you want to use REST API as a fallback:

1. Go to WordPress Admin → Settings → Permalink Settings
2. Ensure a custom permalink structure is set (not "Plain")
3. REST API is enabled by default

## Step 5: Test the Integration

### 5.1 Test GraphQL Connection

In your Next.js project, create a test file `next-app/lib/__tests__/graphql-connection.test.ts`:

```typescript
import { validateWPGraphQLConnection } from '../graphql-client';

async function testConnection() {
  const isConnected = await validateWPGraphQLConnection();
  console.log('WordPress GraphQL Connection:', isConnected ? '✓ OK' : '✗ FAILED');
}

testConnection();
```

Run: `npx ts-node next-app/lib/__tests__/graphql-connection.test.ts`

### 5.2 Test Data Fetching

```bash
# With WordPress enabled
NEXT_PUBLIC_USE_WORDPRESS=true npm run dev
```

Check the browser console for any GraphQL errors and verify stories are loading.

## Step 6: Create Sample Content

1. Create at least one Post in WordPress with:
   - Title
   - Excerpt
   - Content
   - Featured Image
   - Category
   - Author
   - Fill in ACF fields (featured, trending, etc.)

2. Create Categories if not already present

## Troubleshooting

### Issue: "NEXT_PUBLIC_WP_GRAPHQL_URL environment variable is not set"
**Solution:** Make sure `.env.local` file has the correct variable name and your `.gitignore` includes `.env.local`

### Issue: GraphQL returns empty results
**Solutions:**
- Verify posts are published (not draft)
- Check ACF field group location rules match post types
- Go to ACF field → Settings → ensure "Show in GraphQL" is checked

### Issue: "Field not found in GraphQL"
**Solutions:**
- Verify field GraphQL name matches query (e.g., `acfFeatured` not `featured`)
- Add `_embed` parameter if using REST API
- Clear any caching plugins

### Issue: Authentication errors
**Solutions:**
- Check if your WordPress requires authentication
- If yes, add to `NEXT_PUBLIC_WP_GRAPHQL_URL`: `?token=YOUR_JWT_TOKEN`
- Or use WordPress Application Passwords

### Issue: CORS errors
**Solutions:**
1. Ensure "Headless Mode" plugin is active and configured
2. Add to WordPress `wp-config.php`:
```php
define('REST_REQUEST', true);
header('Access-Control-Allow-Origin: *');
```

Or use the plugin: "Enable CORS" for more fine-grained control

## Fallback Strategy

The application is configured to **fallback to mock data** if WordPress is unavailable or `NEXT_PUBLIC_USE_WORDPRESS=false`. This allows you to development locally without WordPress.

## API Caching Strategy

- **Posts**: 60 seconds (ISR)
- **Categories**: 3600 seconds (1 hour)
- Tags: `['posts', 'categories']` for targeted invalidation

## Performance Optimization

1. **Using ISR (Incremental Static Regeneration)**
   - Set `revalidate` values in Next.js fetch options
   - Stories revalidate every 60 seconds
   - Categories revalidate every hour

2. **Pagination**
   - Default: 9 stories per page
   - Adjust in `getStories()` options

3. **GraphQL Query Optimization**
   - Only fetch fields you need
   - Use pagination for large result sets
   - Consider field aliases for complex queries

## Next Steps

1. ✅ Set up environment variables
2. ✅ Create ACF field groups in WordPress
3. ✅ Verify GraphQL schema
4. ✅ Create sample content
5. ✅ Enable `NEXT_PUBLIC_USE_WORDPRESS=true`
6. ✅ Test the integration
7. ✅ Deploy to production

## Support Resources

- [WPGraphQL Documentation](https://www.wpgraphql.com/)
- [ACF Docs](https://www.advancedcustomfields.com/resources/)
- [Next.js ISR](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [GraphQL IDE](https://www.cms.groupashop.com/graphql)
