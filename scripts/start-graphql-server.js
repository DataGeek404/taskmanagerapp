
// This is a standalone script to start the GraphQL server
// Run with:node scripts/start-graphql-server.js

require('esbuild').buildSync({
  entryPoints: ['src/graphql/server.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/graphql-server.js',
  external: ['pg-native'], // Some dependencies might require native modules
});

console.log('GraphQL server bundle created, starting server...');
require('../dist/graphql-server.js');
