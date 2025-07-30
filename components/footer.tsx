import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div>
          <div className="flex justify-between item-center">
            <div className="flex">
              {/* <h3 className="text-lg font-semibold mb-4">About</h3> */}
              <ul className="flex align items-center text-lg">
                <li className="px-2 bold text-lg font-semibold">
                  <Link href="/about" className="text-foreground">
                    About Us
                  </Link>
                </li>
                <li className="px-2 bold text-lg font-semibold">
                  <Link href="/contact" className="text-foreground">
                    Contact
                  </Link>
                </li>
                {/* <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </li> */}
              </ul>
            </div>

            <div className="flex item-center">
              <h3 className="text-lg font-semibold mr-4">Follow</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Instagram className="h-5 w-5" />
                </Link>
                {/* <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Youtube className="h-5 w-5" />
              </Link> */}
              </div>
            </div>
          </div>


          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/politics" className="text-muted-foreground hover:text-foreground">
                  Politics
                </Link>
              </li>
              <li>
                <Link href="/category/technology" className="text-muted-foreground hover:text-foreground">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/category/business" className="text-muted-foreground hover:text-foreground">
                  Business
                </Link>
              </li>
              <li>
                <Link href="/category/health" className="text-muted-foreground hover:text-foreground">
                  Health
                </Link>
              </li>
            </ul>
          </div> */}

          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/advertise" className="text-muted-foreground hover:text-foreground">
                  Advertise
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-muted-foreground hover:text-foreground">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/investors" className="text-muted-foreground hover:text-foreground">
                  Investors
                </Link>
              </li>
            </ul>
          </div> */}


        </div>

        <div className="border-t pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">© 2025    The USA Feeds. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
