# WordPress Integration - Quick Start

## 🎯 What's Been Done

### ✅ Next.js Code Changes
1. **GraphQL Client** (`next-app/lib/graphql-client.ts`)
   - Handles all GraphQL requests to WordPress
   - Auto-pagination support
   - ISR caching configuration
   - Connection validation

2. **GraphQL Queries** (`next-app/lib/graphql-queries.ts`)
   - Pre-built queries for all data fetching needs
   - Posts, categories, related stories, featured/trending

3. **Data Transformation** (`next-app/lib/wp-transform.ts`)
   - Converts WordPress data → App types
   - Reading time estimation
   - HTML stripping

4. **Updated API Layer** (`next-app/lib/api.ts`)
   - Now uses GraphQL instead of REST API
   - Automatic fallback to mock data if WordPress unavailable
   - Controlled by `NEXT_PUBLIC_USE_WORDPRESS` flag

### 📄 Documentation
- `WORDPRESS_SETUP.md` - Full setup guide with ACF field creation
- `next-app/lib/__tests__/graphql-connection.test.ts` - Connection tester

## 🔧 Your Next Steps

### 1️⃣ Create `.env.local` file
```bash
NEXT_PUBLIC_WP_GRAPHQL_URL=https://www.cms.groupashop.com/graphql
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_USE_WORDPRESS=true
```

### 2️⃣ Create ACF Field Groups in WordPress

Go to: **WordPress Admin → ACF → Field Groups → Add New**

**For Posts:**
- [ ] featured (True/False)
- [ ] trending (True/False)
- [ ] reading_time (Number)
- [ ] location (Text)
- [ ] tags (Text)
- [ ] timeline (Repeater with date, title, description)

**For Categories:**
- [ ] category_image (Image)

**For Users:**
- [ ] author_bio (Text Area)

**Important:** Set GraphQL names for each field (e.g., `acfFeatured`, `acfReadingTime`)

### 3️⃣ Verify GraphQL Setup

Visit: **https://www.cms.groupashop.com/graphql**

Test this query:
```graphql
{
  posts(first: 3) {
    edges {
      node {
        id
        title
        slug
        acfFeatured
        acfTrending
      }
    }
  }
}
```

Should return posts with your ACF fields.

### 4️⃣ Create Sample Content

Create at least 3-5 WordPress posts with:
- Publish status ✓
- Title, excerpt, content
- Featured image
- Category assigned
- Author
- All ACF fields filled

### 5️⃣ Test Integration

```bash
cd next-app
npm run dev
```

Check:
- [ ] Stories load on homepage
- [ ] Categories display
- [ ] Story detail pages work
- [ ] No console errors
- [ ] Check browser DevTools for GraphQL requests

## 📋 Files Created/Modified

```
next-app/lib/
├── graphql-client.ts         ✨ NEW - GraphQL request handler
├── graphql-queries.ts        ✨ NEW - All GraphQL queries
├── wp-transform.ts           ✨ NEW - Data transformation
├── api.ts                    🔄 MODIFIED - Uses GraphQL
├── __tests__/
│   └── graphql-connection.test.ts  ✨ NEW - Connection tester

WORDPRESS_SETUP.md            ✨ NEW - Full setup guide
.env.local.example            ✨ NEW - Environment example
```

## 🚀 Activation Checklist

- [ ] Environment variables set in `.env.local`
- [ ] ACF field groups created in WordPress
- [ ] ACF fields set to Show in GraphQL
- [ ] Sample posts created (3-5 posts)
- [ ] GraphQL IDE query returns data
- [ ] `NEXT_PUBLIC_USE_WORDPRESS=true` in .env.local
- [ ] `npm run dev` - No errors
- [ ] Homepage displays WordPress posts
- [ ] Category filtering works
- [ ] Story details page works

## 💡 Development Mode

**While developing, keep WordPress disabled:**
```bash
NEXT_PUBLIC_USE_WORDPRESS=false
```
The app will use mock data, so you don't need WordPress running.

**To test with WordPress:**
```bash
NEXT_PUBLIC_USE_WORDPRESS=true
```
Must have WordPress running and network accessible.

## 🔐 Security Notes

1. `GraphQL` endpoint is public by default - consider restricting if needed
2. Sensitive fields (passwords, drafts) aren't exposed to GraphQL
3. Authentication not required for public content
4. If you need authentication:
   - Use WordPress Authentication Tokens (WPGraphQL JWT)
   - Add to `.env.local`: `WP_AUTH_TOKEN=your_token`

## 📞 Troubleshooting

**"Cannot find module errors"?**
- Run: `npm install`
- Ensure all file paths are correct

**GraphQL returns empty results?**
1. Go to `https://www.cms.groupashop.com/graphql`
2. Query directly to verify data exists
3. Check ACF field "Show in GraphQL" is enabled

**Stories still showing mock data?**
- Check `.env.local` has `NEXT_PUBLIC_USE_WORDPRESS=true`
- Rebuild with: `npm run build` then `npm run dev`
- Check browser console for GraphQL errors

**Performance slow?**
- GraphQL queries are cached (60s for posts, 1h for categories)
- First request fetches new data, subsequent are cached
- Clear cache with ISR on-demand revalidation

## 📚 Learn More

- [WPGraphQL Setup](https://www.wpgraphql.com/docs/getting-started/what-is-graphql)
- [ACF Fields](https://www.advancedcustomfields.com/resources/)
- [Next.js ISR](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [GraphQL Basics](https://graphql.org/learn/)

---

## 🎉 Ready to Start?

1. Open `WORDPRESS_SETUP.md` for detailed step-by-step instructions
2. Set up `.env.local`
3. Create ACF fields
4. Start the dev server
5. Test with sample data

**Questions?** Check the GraphQL IDE or review the comments in each file.
