/**
 * WordPress GraphQL Connection Test
 * Run this to verify WordPress is properly connected
 */

import { fetchGraphQL } from '../graphql-client';

const TEST_QUERY = `
  query {
    posts(first: 1) {
      edges {
        node {
          id
          title
          slug
        }
      }
      pageInfo {
        total
      }
    }
  }
`;

export async function testWordPressConnection() {
  console.log('\n🔍 Testing WordPress GraphQL Connection...\n');

  try {
    const result = await fetchGraphQL<any>(TEST_QUERY);
    
    if (result?.posts) {
      const total = result.posts.pageInfo.total;
      const posts = result.posts.edges.length;

      console.log('✅ Connection Successful!');
      console.log(`   Total posts in WordPress: ${total}`);
      console.log(`   Sample posts fetched: ${posts}`);
      
      if (posts > 0) {
        console.log(`   First post: "${result.posts.edges[0].node.title}"`);
      }
      
      return true;
    }
  } catch (error: any) {
    console.error('❌ Connection Failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('NEXT_PUBLIC_WP_GRAPHQL_URL')) {
      console.error('\n⚠️  Missing environment variable: NEXT_PUBLIC_WP_GRAPHQL_URL');
      console.error('   Add it to your .env.local file:');
      console.error('   NEXT_PUBLIC_WP_GRAPHQL_URL=https://www.cms.groupashop.com/graphql');
    }
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n⚠️  Cannot reach WordPress server');
      console.error('   Check your WordPress URL and ensure it\'s accessible');
    }
    
    return false;
  }
}

// Run test if called directly
if (require.main === module) {
  testWordPressConnection().then((success) => {
    process.exit(success ? 0 : 1);
  });
}
