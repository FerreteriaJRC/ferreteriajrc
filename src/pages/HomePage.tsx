import Header from "../components/Header"
import Hero from "../components/Hero"
import CatalogCarousel from "../components/CatalogCarousel"
import Categories from "../components/Categories"
import Brands from "../components/Brands"
import BlogSection from "../components/BlogSection"
import DigitalServices from "../components/DigitalServices"
import ContactCta from "../components/ContactCta"
import Footer from "../components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen text-foreground">
      <Header />
      <main>
        <Hero />
        <CatalogCarousel />
        <Categories />
        <DigitalServices />
        <Brands />
        <BlogSection />
        <ContactCta />
      </main>
      <Footer />
    </div>
  )
}
