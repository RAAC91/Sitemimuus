import HeroSection from '@/components/home/HeroSection'
import CategoryCircles from '@/components/home/CategoryCircles'
import Lookbook from '@/components/home/Lookbook'
import DetailsSection from '@/components/home/DetailsSection'
import FindYourBottle from '@/components/home/FindYourBottle'
import Testimonials from '@/components/home/Testimonials'
import SocialFeed from '@/components/home/SocialFeed'
import { TrustBar } from '@/components/TrustBar'
import { PurposeSection } from '@/components/home/PurposeSection'
import { Toaster } from '@/components/ui/toast'
import { MarqueeBrand } from '@/components/home/MarqueeBrand'
export default async function Home() {
  return (
    <>
      <HeroSection />
      <MarqueeBrand />
      <TrustBar />
      <CategoryCircles />
      <Lookbook />
      <DetailsSection />
      <PurposeSection />
      <FindYourBottle />
      <Testimonials />
      <SocialFeed />
      <Toaster />
    </>
  )
}

