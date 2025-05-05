import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

// This would normally come from a database or CMS
const posts = [
  {
    id: "1",
    title: "Secure API Gateway with Cognito Authorizer",
    content: `
      <p>In this comprehensive guide, we'll explore how to secure your API Gateway endpoints using Amazon Cognito as an authorizer. This approach provides a robust authentication and authorization mechanism for your APIs.</p>
      
      <h2>What is Amazon Cognito?</h2>
      <p>Amazon Cognito is a user identity and data synchronization service that helps you add user sign-up, sign-in, and access control to your web and mobile apps quickly and easily. Amazon Cognito scales to millions of users and supports sign-in with social identity providers, such as Apple, Facebook, Google, and Amazon, and enterprise identity providers via SAML 2.0 and OpenID Connect.</p>
      
      <h2>Setting Up Cognito User Pool</h2>
      <p>First, let's create a Cognito User Pool:</p>
      <ol>
        <li>Navigate to the Amazon Cognito console</li>
        <li>Click "Create user pool"</li>
        <li>Choose authentication providers (Cognito user pool only for this example)</li>
        <li>Configure security requirements (password policy, MFA, etc.)</li>
        <li>Configure sign-up experience</li>
        <li>Configure message delivery</li>
        <li>Integrate your app (create app client)</li>
        <li>Review and create</li>
      </ol>
      
      <h2>Creating API Gateway with Cognito Authorizer</h2>
      <p>Now, let's create an API Gateway and secure it with Cognito:</p>
      <ol>
        <li>Navigate to the API Gateway console</li>
        <li>Create a new REST API</li>
        <li>Create resources and methods</li>
        <li>Create a new authorizer (Cognito type)</li>
        <li>Select the Cognito User Pool created earlier</li>
        <li>Configure token source (usually Authorization header)</li>
        <li>Attach the authorizer to your API methods</li>
        <li>Deploy your API</li>
      </ol>
      
      <h2>Testing the Secured API</h2>
      <p>To test your secured API, you'll need to:</p>
      <ol>
        <li>Register a user in your Cognito User Pool</li>
        <li>Authenticate the user to get an ID token</li>
        <li>Include the ID token in the Authorization header of your API request</li>
      </ol>
      
      <h2>Conclusion</h2>
      <p>By using Amazon Cognito as an authorizer for your API Gateway, you've implemented a secure, scalable, and manageable authentication system for your APIs. This approach allows you to focus on building your application's features while AWS handles the security infrastructure.</p>
    `,
    coverImage: "/placeholder.svg?key=p1dzn",
    date: "2025-04-18",
    author: {
      name: "John Smith",
      avatar: "/diverse-avatars.png",
    },
    category: "AWS-DVA",
  },
]

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = posts.find((post) => post.id === params.id)

  if (!post) {
    notFound()
  }

  return (
    <article className="container py-8 max-w-4xl mx-auto">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to blog
        </Link>
      </Button>

      <div className="relative aspect-video overflow-hidden rounded-lg mb-8">
        <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{post.title}</h1>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image
                src={post.author.avatar || "/placeholder.svg"}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm font-medium">{post.author.name}</span>
          </div>
          <time dateTime={post.date} className="text-sm text-muted-foreground">
            {formatDate(post.date)}
          </time>
          <Link
            href={`/tags/${post.category.toLowerCase()}`}
            className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
          >
            {post.category}
          </Link>
        </div>
      </div>

      <div
        className="prose prose-gray dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}
