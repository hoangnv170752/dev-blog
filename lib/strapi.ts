// Types for Strapi content
export interface Author {
  id: number
  name: string
  email: string
  avatar?: string
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface Comment {
  id: number
  content: string
  author: Author
  createdAt: string
}

export interface Post {
  id: number
  title: string
  slug: string
  description: string
  content: string
  cover: {
    url: string
  }
  publishedAt: string
  author: Author
  category: Category
  tags: Tag[]
  comments: Comment[]
}

// Fallback data for when the API is unavailable
export const fallbackPosts = [
  {
    id: 1,
    attributes: {
      title: "Secure API Gateway with Cognito Authorizer",
      slug: "secure-api-gateway-cognito",
      description: "Learn how to secure your API Gateway endpoints using Amazon Cognito as an authorizer.",
      content: "<p>This is a sample post content. In a real application, this would be fetched from Strapi.</p>",
      publishedAt: "2025-04-18T10:00:00.000Z",
      cover: {
        data: {
          attributes: {
            url: "/placeholder.svg?key=q9ejl",
          },
        },
      },
      author: {
        data: {
          id: 1,
          attributes: {
            name: "John Smith",
            email: "john@example.com",
            avatar: "/diverse-avatars.png",
          },
        },
      },
      category: {
        data: {
          id: 1,
          attributes: {
            name: "AWS-DVA",
            slug: "aws-dva",
          },
        },
      },
      tags: {
        data: [
          {
            id: 1,
            attributes: {
              name: "AWS",
              slug: "aws",
            },
          },
        ],
      },
    },
  },
  {
    id: 2,
    attributes: {
      title: "Low-Code/No-Code End-to-End Machine Learning for Startups",
      slug: "low-code-machine-learning",
      description:
        "Discover how to build end-to-end machine learning solutions without writing much code using Amazon SageMaker Canvas.",
      content: "<p>This is a sample post content. In a real application, this would be fetched from Strapi.</p>",
      publishedAt: "2025-04-06T10:00:00.000Z",
      cover: {
        data: {
          attributes: {
            url: "/placeholder.svg?key=ul8k5",
          },
        },
      },
      author: {
        data: {
          id: 2,
          attributes: {
            name: "Jane Doe",
            email: "jane@example.com",
            avatar: "/diverse-avatars.png",
          },
        },
      },
      category: {
        data: {
          id: 2,
          attributes: {
            name: "MACHINE-LEARNING",
            slug: "machine-learning",
          },
        },
      },
      tags: {
        data: [
          {
            id: 2,
            attributes: {
              name: "ML",
              slug: "ml",
            },
          },
        ],
      },
    },
  },
  {
    id: 3,
    attributes: {
      title: "Using FMs Stable Diffusion in AWS Bedrock to Generate Images",
      slug: "stable-diffusion-aws-bedrock",
      description: "Learn how to generate high-quality images using Stable Diffusion models in AWS Bedrock.",
      content: "<p>This is a sample post content. In a real application, this would be fetched from Strapi.</p>",
      publishedAt: "2025-03-26T10:00:00.000Z",
      cover: {
        data: {
          attributes: {
            url: "/placeholder.svg?key=2kr4w",
          },
        },
      },
      author: {
        data: {
          id: 3,
          attributes: {
            name: "Alex Johnson",
            email: "alex@example.com",
            avatar: "/diverse-avatars.png",
          },
        },
      },
      category: {
        data: {
          id: 3,
          attributes: {
            name: "GENERATIVE-AI",
            slug: "generative-ai",
          },
        },
      },
      tags: {
        data: [
          {
            id: 3,
            attributes: {
              name: "AI",
              slug: "ai",
            },
          },
        ],
      },
    },
  },
]

export const fallbackCategories = [
  {
    id: 1,
    attributes: {
      name: "AWS-DVA",
      slug: "aws-dva",
      articles: { data: [{ id: 1 }] },
    },
  },
  {
    id: 2,
    attributes: {
      name: "MACHINE-LEARNING",
      slug: "machine-learning",
      articles: { data: [{ id: 2 }] },
    },
  },
  {
    id: 3,
    attributes: {
      name: "GENERATIVE-AI",
      slug: "generative-ai",
      articles: { data: [{ id: 3 }] },
    },
  },
]

export const fallbackTags = [
  {
    id: 1,
    attributes: {
      name: "AWS",
      slug: "aws",
      articles: { data: [{ id: 1 }] },
    },
  },
  {
    id: 2,
    attributes: {
      name: "ML",
      slug: "ml",
      articles: { data: [{ id: 2 }] },
    },
  },
  {
    id: 3,
    attributes: {
      name: "AI",
      slug: "ai",
      articles: { data: [{ id: 3 }] },
    },
  },
]

// Fetch data from Strapi with better error handling
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || ""

// Helper to handle API responses with better error handling
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    console.log(`Fetching from: ${API_URL}/api${endpoint}`)
    
    // Prepare headers with proper authorization
    const headers = {
      "Content-Type": "application/json",
      ...(API_TOKEN ? { "Authorization": `Bearer ${API_TOKEN}` } : {}),
      ...(options.headers || {})
    };
    
    const res = await fetch(`${API_URL}/api${endpoint}`, {
      ...options,
      headers,
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!res.ok) {
      console.error(`API error: ${res.status} - ${res.statusText}`)
      throw new Error(`API error: ${res.status}`)
    }

    const json = await res.json()
    return json
  } catch (error) {
    console.error("Error fetching from Strapi:", error)
    // Return null to indicate an error, which will trigger fallback data
    return null
  }
}

// Get all posts with pagination and fallback
export async function getAllPosts(page = 1, pageSize = 10) {
  try {
    const data = await fetchAPI(
      `/articles?populate=cover,author,category,tags&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=publishedAt:desc`,
    )

    if (!data) {
      console.log("Using fallback posts data")
      return {
        data: fallbackPosts,
        meta: {
          pagination: {
            page: 1,
            pageCount: 1,
            total: fallbackPosts.length,
          },
        },
      }
    }

    return data
  } catch (error) {
    console.error("Error in getAllPosts:", error)
    return {
      data: fallbackPosts,
      meta: {
        pagination: {
          page: 1,
          pageCount: 1,
          total: fallbackPosts.length,
        },
      },
    }
  }
}

// Get a single post by slug with fallback
export async function getPostBySlug(slug: string) {
  try {
    const data = await fetchAPI(
      `/articles?filters[slug][$eq]=${slug}&populate=cover,author,category,tags,comments.author`,
    )

    if (!data || !data.data || data.data.length === 0) {
      console.log(`Using fallback post data for slug: ${slug}`)
      const fallbackPost = fallbackPosts.find((post) => post.attributes.slug === slug)
      return fallbackPost || null
    }

    return data.data[0]
  } catch (error) {
    console.error("Error in getPostBySlug:", error)
    const fallbackPost = fallbackPosts.find((post) => post.attributes.slug === slug)
    return fallbackPost || null
  }
}

// Get all categories with fallback
export async function getAllCategories() {
  try {
    const data = await fetchAPI("/categories?populate=articles&pagination[pageSize]=100")

    if (!data) {
      console.log("Using fallback categories data")
      return {
        data: fallbackCategories,
      }
    }

    return data
  } catch (error) {
    console.error("Error in getAllCategories:", error)
    return {
      data: fallbackCategories,
    }
  }
}

// Get all tags with fallback
export async function getAllTags() {
  try {
    const data = await fetchAPI("/tags?populate=articles&pagination[pageSize]=100")

    if (!data) {
      console.log("Using fallback tags data")
      return {
        data: fallbackTags,
      }
    }

    return data
  } catch (error) {
    console.error("Error in getAllTags:", error)
    return {
      data: fallbackTags,
    }
  }
}

// Get posts by category with fallback
export async function getPostsByCategory(slug: string, page = 1, pageSize = 10) {
  try {
    const data = await fetchAPI(
      `/articles?filters[category][slug][$eq]=${slug}&populate=cover,author,category,tags&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=publishedAt:desc`,
    )

    if (!data || !data.data) {
      console.log(`Using fallback posts data for category: ${slug}`)
      const filteredPosts = fallbackPosts.filter((post) => post.attributes.category.data.attributes.slug === slug)

      return {
        data: filteredPosts,
        meta: {
          pagination: {
            page: 1,
            pageCount: 1,
            total: filteredPosts.length,
          },
        },
      }
    }

    return data
  } catch (error) {
    console.error("Error in getPostsByCategory:", error)
    const filteredPosts = fallbackPosts.filter((post) => post.attributes.category.data.attributes.slug === slug)

    return {
      data: filteredPosts,
      meta: {
        pagination: {
          page: 1,
          pageCount: 1,
          total: filteredPosts.length,
        },
      },
    }
  }
}

// Get posts by tag with fallback
export async function getPostsByTag(slug: string, page = 1, pageSize = 10) {
  try {
    const data = await fetchAPI(
      `/articles?filters[tags][slug][$eq]=${slug}&populate=cover,author,category,tags&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=publishedAt:desc`,
    )

    if (!data || !data.data) {
      console.log(`Using fallback posts data for tag: ${slug}`)
      const filteredPosts = fallbackPosts.filter((post) =>
        post.attributes.tags.data.some((t: any) => t.attributes.slug === slug),
      )

      return {
        data: filteredPosts,
        meta: {
          pagination: {
            page: 1,
            pageCount: 1,
            total: filteredPosts.length,
          },
        },
      }
    }

    return data
  } catch (error) {
    console.error("Error in getPostsByTag:", error)
    const filteredPosts = fallbackPosts.filter((post) =>
      post.attributes.tags.data.some((t: any) => t.attributes.slug === slug),
    )

    return {
      data: filteredPosts,
      meta: {
        pagination: {
          page: 1,
          pageCount: 1,
          total: filteredPosts.length,
        },
      },
    }
  }
}

// Add a comment to a post with better error handling
export async function addComment(postId: number, comment: { author: number; content: string }) {
  try {
    const res = await fetch(`${API_URL}/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          article: postId,
          ...comment,
        },
      }),
    })

    if (!res.ok) {
      throw new Error(`Failed to add comment: ${res.status}`)
    }

    return res.json()
  } catch (error) {
    console.error("Error adding comment:", error)
    // Return a mock response for the UI to continue working
    return {
      data: {
        id: Date.now(),
        attributes: {
          content: comment.content,
          createdAt: new Date().toISOString(),
          author: {
            data: {
              id: comment.author,
              attributes: {
                name: "You",
                avatar: "/diverse-avatars.png",
              },
            },
          },
        },
      },
    }
  }
}

// Search posts by query
export async function searchPosts(query: string, page = 1, pageSize = 10) {
  try {
    const data = await fetchAPI(
      `/articles?filters[$or][0][title][$containsi]=${query}&filters[$or][1][description][$containsi]=${query}&populate=cover,author,category,tags&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=publishedAt:desc`,
    )

    if (!data || !data.data) {
      console.log(`No search results found for query: ${query}`)
      return {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageCount: 0,
            total: 0,
          },
        },
      }
    }

    return data
  } catch (error) {
    console.error("Error in searchPosts:", error)
    return {
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageCount: 0,
          total: 0,
        },
      },
    }
  }
}
