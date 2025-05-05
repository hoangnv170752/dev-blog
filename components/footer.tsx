import Link from "next/link"
import { Mail, Facebook } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Modern Blog • All rights reserved
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="mailto:contact@modernblog.com" aria-label="Email">
            <Mail className="h-5 w-5" />
          </Link>
          <Link href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            <Facebook className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
