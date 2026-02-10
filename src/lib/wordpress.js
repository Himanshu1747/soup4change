// export async function queryWordPress(query, variables = {}) {
//   const endpoint = import.meta.env.WP_API_URL;

//   if (!endpoint) {
//     return null;
//   }

//   const response = await fetch(endpoint, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ query, variables }),
//   });

//   const json = await response.json();
//   return json.data;
// }


// export async function queryWordPress(query, variables = {}) {
//   // FALLBACK: If the environment variable is missing, it uses the direct string below
//   const endpoint = import.meta.env.WP_API_URL || "https://web.ogrelogicsolutions.com/soup4change.com/graphql";

//   try {
//     const response = await fetch(endpoint, {
//       method: "POST",
//       headers: { 
//         "Content-Type": "application/json",
//         // Adding a User-Agent helps bypass some WordPress firewalls
//         "User-Agent": "Mozilla/5.0 (Astro-SSR-Bot)"
//       },
//       body: JSON.stringify({ query, variables }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       // console.error(`WP API Error (${response.status}):`, errorText);
//       return null;
//     }

//     const json = await response.json();
//     if (json.errors) {
//       // console.error("GraphQL Errors:", json.errors);
//       return null;
//     }

//     return json.data;
//   } catch (error) {
//     // console.error("Fetch failed entirely:", error);
//     return null;
//   }
// }

// This cache stays alive during the build process to prevent duplicate requests
const wpCache = new Map();

export async function queryWordPress(query, variables = {}) {
  // const endpoint = import.meta.env.WP_API_URL || "https://web.ogrelogicsolutions.com/soup4change.com/graphql";
  const endpoint = import.meta.env.WP_API_URL || "https://admin.soup4change.com/graphql";
  
  // Create a unique key for this specific query and its variables
  const cacheKey = JSON.stringify({ query, variables });

  // 1. Check if we already fetched this data
  if (wpCache.has(cacheKey)) {
    return wpCache.get(cacheKey);
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Astro-SSR-Bot)",
        // Keep-Alive header helps reuse the connection for speed
        "Connection": "keep-alive"
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    
    if (json.errors) {
      return null;
    }

    // 2. Store the successful result in cache for the next call
    wpCache.set(cacheKey, json.data);

    return json.data;
  } catch (error) {
    return null;
  }
}