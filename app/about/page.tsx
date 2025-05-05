import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-8">About Modern Blog</h1>

        <div className="relative aspect-video overflow-hidden rounded-lg mb-8">
          <Image
            src="/placeholder.svg?height=400&width=800&query=modern tech blog team"
            alt="Modern Blog Team"
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>
            Modern Blog is a platform dedicated to sharing knowledge and insights about the latest technologies, cloud
            computing, artificial intelligence, and software development best practices.
          </p>

          <p>
            Our team of experienced professionals and industry experts are passionate about technology and committed to
            providing high-quality, in-depth content that helps our readers stay ahead in the rapidly evolving tech
            landscape.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to democratize knowledge about cutting-edge technologies and make it accessible to everyone,
            from beginners to seasoned professionals. We believe that by sharing our expertise and experiences, we can
            help build a more informed and skilled tech community.
          </p>

          <h2>What We Cover</h2>
          <ul>
            <li>Cloud Computing (AWS, Azure, GCP)</li>
            <li>Artificial Intelligence and Machine Learning</li>
            <li>Software Development and Best Practices</li>
            <li>DevOps and Infrastructure as Code</li>
            <li>Web Development and Modern Frameworks</li>
            <li>Cybersecurity and Data Privacy</li>
          </ul>

          <h2>Join Our Community</h2>
          <p>
            We invite you to join our growing community of tech enthusiasts, professionals, and learners. Subscribe to
            our newsletter, follow us on social media, and engage with our content to stay updated with the latest in
            technology.
          </p>
        </div>
      </div>
    </div>
  )
}
