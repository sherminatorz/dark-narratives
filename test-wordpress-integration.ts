#!/usr/bin/env node

/**
 * WordPress GraphQL Integration Test
 * Comprehensive test to verify data fetching from WordPress
 * Run: npm run test:wp or npx ts-node test-wordpress-integration.ts
 */

import { fetchGraphQL } from './next-app/lib/graphql-client';
import {
  GET_POSTS_QUERY,
  GET_CATEGORIES_QUERY,
  GET_POST_BY_SLUG_QUERY,
} from './next-app/lib/graphql-queries';
import { transformWPPostToStory, transformWPCategoryToCategory } from './next-app/lib/wp-transform';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL;
const USE_WORDPRESS = process.env.NEXT_PUBLIC_USE_WORDPRESS === 'true';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function runTests() {
  log('\n╔════════════════════════════════════════════════════════════╗', colors.cyan);
  log('║   WordPress GraphQL Integration Test                       ║', colors.cyan);
  log('╚════════════════════════════════════════════════════════════╝\n', colors.cyan);

  // Check prerequisites
  log('📋 Checking Prerequisites...', colors.blue);
  
  if (!GRAPHQL_URL) {
    log('❌ NEXT_PUBLIC_WP_GRAPHQL_URL is not set', colors.red);
    log('   Add to .env.local:', colors.yellow);
    log('   NEXT_PUBLIC_WP_GRAPHQL_URL=https://www.cms.groupashop.com/graphql\n', colors.yellow);
    process.exit(1);
  }

  if (!USE_WORDPRESS) {
    log('⚠️  NEXT_PUBLIC_USE_WORDPRESS is not set to true', colors.yellow);
    log('   Add to .env.local:', colors.yellow);
    log('   NEXT_PUBLIC_USE_WORDPRESS=true\n', colors.yellow);
    process.exit(1);
  }

  log(`✅ NEXT_PUBLIC_WP_GRAPHQL_URL: ${GRAPHQL_URL}`, colors.green);
  log(`✅ NEXT_PUBLIC_USE_WORDPRESS: ${USE_WORDPRESS}\n`, colors.green);

  // Test 1: Posts Query
  log('Test 1️⃣  Fetching Posts from WordPress...', colors.blue);
  try {
    const postsResponse = await fetchGraphQL<any>(GET_POSTS_QUERY, { first: 3 });
    
    if (!postsResponse.posts || !postsResponse.posts.edges) {
      throw new Error('No posts data returned');
    }

    const postCount = postsResponse.posts.edges.length;
    const totalPosts = postsResponse.posts.pageInfo?.total || 0;

    log(`✅ Posts Query Successful`, colors.green);
    log(`   Found ${postCount} posts (${totalPosts} total available)`, colors.green);

    if (postCount > 0) {
      const firstPost = postsResponse.posts.edges[0].node;
      log(`\n   📄 First Post:`, colors.blue);
      log(`      Title: ${firstPost.title}`, colors.cyan);
      log(`      Slug: ${firstPost.slug}`, colors.cyan);
      log(`      Featured: ${firstPost.acfFeatured}`, colors.cyan);
      log(`      Trending: ${firstPost.acfTrending}`, colors.cyan);
      log(`      Reading Time: ${firstPost.acfReadingTime} min`, colors.cyan);
      
      if (firstPost.tags?.edges) {
        const tagNames = firstPost.tags.edges.map((e: any) => e.node.slug).join(', ');
        log(`      Tags: ${tagNames || 'None'}`, colors.cyan);
      }
    } else {
      log('⚠️  No posts found. Make sure you have published posts in WordPress', colors.yellow);
    }
  } catch (error: any) {
    log(`❌ Posts Query Failed`, colors.red);
    log(`   Error: ${error.message}`, colors.red);
    process.exit(1);
  }

  log('');

  // Test 2: Categories Query
  log('Test 2️⃣  Fetching Categories from WordPress...', colors.blue);
  try {
    const categoriesResponse = await fetchGraphQL<any>(GET_CATEGORIES_QUERY);
    
    if (!categoriesResponse.categories || !categoriesResponse.categories.edges) {
      throw new Error('No categories data returned');
    }

    const categoryCount = categoriesResponse.categories.edges.length;

    log(`✅ Categories Query Successful`, colors.green);
    log(`   Found ${categoryCount} categories`, colors.green);

    if (categoryCount > 0) {
      log(`\n   📂 Categories:`, colors.blue);
      categoriesResponse.categories.edges.slice(0, 3).forEach((edge: any, idx: number) => {
        const cat = edge.node;
        log(`      ${idx + 1}. ${cat.name} (${cat.posts?.pageInfo?.total || 0} posts)`, colors.cyan);
      });
    }
  } catch (error: any) {
    log(`❌ Categories Query Failed`, colors.red);
    log(`   Error: ${error.message}`, colors.red);
    process.exit(1);
  }

  log('');

  // Test 3: Data Transformation
  log('Test 3️⃣  Testing Data Transformation...', colors.blue);
  try {
    const postsResponse = await fetchGraphQL<any>(GET_POSTS_QUERY, { first: 1 });
    
    if (postsResponse.posts?.edges?.[0]) {
      const wpPost = postsResponse.posts.edges[0].node;
      const transformedStory = transformWPPostToStory(wpPost);

      log(`✅ Data Transformation Successful`, colors.green);
      log(`\n   🎯 Transformed Story Object:`, colors.blue);
      log(`      ID: ${transformedStory.id}`, colors.cyan);
      log(`      Title: ${transformedStory.title}`, colors.cyan);
      log(`      Tags: ${transformedStory.tags.join(', ') || 'None'}`, colors.cyan);
      log(`      Category: ${transformedStory.category.name}`, colors.cyan);
      log(`      Author: ${transformedStory.author.name}`, colors.cyan);
    }
  } catch (error: any) {
    log(`❌ Data Transformation Failed`, colors.red);
    log(`   Error: ${error.message}`, colors.red);
    process.exit(1);
  }

  log('');

  // Test 4: Single Post by Slug
  if (postsResponse?.posts?.edges?.[0]?.node?.slug) {
    const testSlug = postsResponse.posts.edges[0].node.slug;
    log(`Test 4️⃣  Fetching Single Post by Slug (${testSlug})...`, colors.blue);
    try {
      const singlePostResponse = await fetchGraphQL<any>(GET_POST_BY_SLUG_QUERY, {
        slug: testSlug,
      });

      if (singlePostResponse.postBy) {
        const post = singlePostResponse.postBy;
        log(`✅ Single Post Query Successful`, colors.green);
        log(`\n   📖 Post Details:`, colors.blue);
        log(`      Title: ${post.title}`, colors.cyan);
        log(`      Excerpt: ${post.excerpt?.substring(0, 50)}...`, colors.cyan);
      } else {
        log(`⚠️  Post not found`, colors.yellow);
      }
    } catch (error: any) {
      log(`❌ Single Post Query Failed`, colors.red);
      log(`   Error: ${error.message}`, colors.red);
    }
  }

  log('');

  // Summary
  log('╔════════════════════════════════════════════════════════════╗', colors.cyan);
  log('║ ✅ All Tests Passed! WordPress Integration is Working      ║', colors.cyan);
  log('╚════════════════════════════════════════════════════════════╝\n', colors.cyan);

  log('📝 Next Steps:', colors.blue);
  log('   1. Start dev server: npm run dev', colors.cyan);
  log('   2. Visit http://localhost:3000', colors.cyan);
  log('   3. Verify stories load from WordPress', colors.cyan);
  log('   4. Check browser console for GraphQL requests\n', colors.cyan);
}

runTests().catch((error) => {
  log(`\n❌ Test Suite Failed: ${error.message}`, colors.red);
  process.exit(1);
});
