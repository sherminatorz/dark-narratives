# WordPress Integration Testing & Go Live

This guide walks you through testing the WordPress integration and removing all mock data.

## ⚠️ Important: No Fallback to Mock Data

**All functions now require real data from WordPress.** If WordPress is unavailable or data is missing, the app will throw errors instead of showing mock data.

## 📋 Pre-Test Checklist

Before testing, make sure you've completed:

- [ ] Created `.env.local` file with:
  ```
  NEXT_PUBLIC_WP_GRAPHQL_URL=https://www.cms.groupashop.com/graphql
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  NEXT_PUBLIC_USE_WORDPRESS=true
  ```

- [ ] Created all ACF field groups in WordPress:
  - [ ] Story Fields (featured, trending, reading_time, location, timeline)
  - [ ] Category Fields (category_image)
  - [ ] Author Fields (author_bio)

- [ ] Created at least 3-5 sample posts in WordPress with:
  - [ ] Title, excerpt, content
  - [ ] Featured image
  - [ ] Published status
  - [ ] Category assigned
  - [ ] Author assigned
  - [ ] WordPress tags assigned
  - [ ] All ACF fields filled

- [ ] Created at least 2-3 categories

## 🧪 Step 1: Run WordPress Connection Test

```bash
cd next-app
npm run test:wp
```

**What it tests:**
✅ WordPress GraphQL endpoint is accessible  
✅ Posts can be fetched  
✅ Categories can be fetched  
✅ Data transformation works correctly  
✅ Single post queries work  

**Expected Output:**
```
╔════════════════════════════════════════════════════════════╗
║   WordPress GraphQL Integration Test                       ║
╚════════════════════════════════════════════════════════════╝

✅ Posts Query Successful
   Found 3 posts (5 total available)

   📄 First Post:
      Title: My First Post
      Slug: my-first-post
      Featured: true
      Trending: false
      Reading Time: 5 min
      Tags: crime,investigation

✅ Categories Query Successful
   Found 2 categories

✅ Data Transformation Successful

✅ Single Post Query Successful

╔════════════════════════════════════════════════════════════╗
║ ✅ All Tests Passed! WordPress Integration is Working      ║
╚════════════════════════════════════════════════════════════╝
```

**If tests fail:**
- Check your `.env.local` file
- Verify WordPress URL is correct
- Ensure all posts are published (not draft)
- Check GraphQL IDE: `https://www.cms.groupashop.com/graphql`

---

## 🚀 Step 2: Start Development Server

```bash
cd next-app
npm run dev
```

Visit: `http://localhost:3000`

**What to verify:**
- [ ] Homepage loads without errors
- [ ] Stories display from WordPress (not mock data)
- [ ] Categories display correctly
- [ ] Story detail pages work
- [ ] Related stories appear
- [ ] No console errors

**Browser DevTools Tips:**
1. Open DevTools → Network tab
2. Filter by "graphql"
3. You should see requests to `https://www.cms.groupashop.com/graphql`
4. Each request returns actual post data

---

## 🔍 Step 3: Verify Data Flow

### Check Homepage
- [ ] At least 3 stories display
- [ ] Each story shows title, excerpt, image
- [ ] Categories work correctly

### Check Story Detail Page
1. Click on any story
2. Verify:
   - [ ] Full content displays
   - [ ] Featured image shows
   - [ ] Author info displays
   - [ ] Reading time shows
   - [ ] Tags display
   - [ ] Related stories appear

### Check Category Pages
1. Click any category
2. Verify:
   - [ ] Stories in that category display
   - [ ] Pagination works

---

## 🛠️ Step 4: Troubleshooting

### Issue: "NEXT_PUBLIC_WP_GRAPHQL_URL environment variable is not set"
**Solution:**
1. Create `.env.local` file in `next-app/` folder
2. Add: `NEXT_PUBLIC_WP_GRAPHQL_URL=https://www.cms.groupashop.com/graphql`
3. Restart dev server

### Issue: "No posts found" or 404 errors
**Solution:**
1. Verify posts are **published** (not draft) in WordPress
2. Go to GraphQL IDE and run test query:
   ```graphql
   {
     posts(first: 1) {
       edges {
         node {
           title
           slug
         }
       }
     }
   }
   ```
3. If no results, create sample posts first

### Issue: "ACF field not found" errors
**Solution:**
1. Go to WordPress Admin → ACF → Field Groups
2. Verify all fields have "Show in GraphQL" checked
3. Verify GraphQL Field Names match (e.g., `acfFeatured`)
4. Clear browser cache and rebuild

### Issue: CORS errors
**Solution:**
1. Ensure "Headless Mode" plugin is enabled
2. Go to WordPress Admin → Headless
3. Configure allowed origins or disable CORS restrictions for development

### Issue: "Search functionality not implemented" error
**Solution:**
- This is expected. Search will be implemented later.
- For now, use category filtering

---

## 📊 Mock Data Removal Summary

The following have been **removed**:

- ❌ `USE_WORDPRESS` flag (was optional, now required)
- ❌ All fallback to `mock-data.ts`
- ❌ Mock data imports from API functions
- ❌ Conditional checks for mock vs WordPress

The following **now throw errors** if WordPress is unavailable:

- `getStories()`
- `getStoryBySlug()`
- `getAllStorySlugs()`
- `getCategories()`
- `getCategoryBySlug()`
- `getRelatedStories()`
- `getFeaturedStories()`
- `getTrendingStories()`
- `getSearchStories()` (not implemented yet)

---

## ✅ Ready for Production

Once all tests pass:

1. **Add environment variables to Vercel:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add same variables as `.env.local`
   - Set `NEXT_PUBLIC_SITE_URL` to your production domain

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Remove mock data, WordPress integration complete"
   git push
   ```

3. **Verify on production:**
   - Visit your production domain
   - Verify stories load correctly
   - Check no console errors

---

## 📞 Need Help?

**Common Issues:**

| Issue | Solution |
|---|---|
| GraphQL endpoint not accessible | Check WordPress URL is correct and publicly accessible |
| Posts not showing | Verify posts are published in WordPress |
| Fields missing | Ensure ACF fields have "Show in GraphQL" enabled |
| Slow loading | This is normal - ISR caches data for 60s |

**Resources:**
- [WordPress Setup Guide](./WORDPRESS_SETUP.md)
- [WPGraphQL Docs](https://www.wpgraphql.com/)
- [ACF Docs](https://www.advancedcustomfields.com/)
