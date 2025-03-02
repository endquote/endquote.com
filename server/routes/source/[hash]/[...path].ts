import { defineEventHandler, createError, sendRedirect } from 'h3';

/**
 * Route handler for GitHub code references
 * Format: /hash/file#L{line}
 * Example: /abc123/src/components/Header.vue#L42 -> https://github.com/endquote/endquote.com/blob/abc123/src/components/Header.vue#L42
 */
export default defineEventHandler((event) => {
  // Get parameters from the URL
  const hash = event.context.params?.hash;
  // Ensure path is treated as string array
  const pathSegments = (Array.isArray(event.context.params?.path) 
    ? event.context.params?.path 
    : event.context.params?.path?.split('/') || []) as string[];
  
  // Ensure we have a hash and at least 1 path segment
  if (!hash || pathSegments.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid GitHub reference URL'
    });
  }

  const filePath = pathSegments.join('/');

  // Construct the GitHub URL
  const repoOwner = 'endquote';  // Replace with your GitHub username
  const repoName = 'endquote.com'; // Replace with your repository name
  
  const githubUrl = `https://github.com/${repoOwner}/${repoName}/blob/${hash}/${filePath}`;
  
  // Any fragment (like #L42) will be automatically passed along in the redirect
  
  // Redirect to the GitHub URL
  return sendRedirect(event, githubUrl, 302);
});