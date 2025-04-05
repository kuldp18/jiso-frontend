import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import {
  BookOpenCheck,
  Brain,
  MessageSquareText,
  BarChart3,
  ArrowRight,
} from "lucide-react";

import HeroImg from "@/assets/hero.svg";
import TherapistImg from "@/assets/therapist.png";

const LandingPage = () => {
  return (
    <>
      {/* Hero Section */}
      <main className="min-h-[calc(100vh-64.8px)] flex items-center" id="home">
        <div className="container mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Hero Content */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-5xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary">
              <span className="block">Jiso</span>
              <span className="text-3xl md:text-4xl text-foreground/90">
                Your personal space for healing and growth.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-prose mx-auto md:mx-0">
              When there's no one to talk to, there's always Jiso — a companion
              who helps you find clarity in your own words.
            </p>
            <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
              <Button asChild size="lg">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 hidden md:flex justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-2xl border border-primary/10">
            <div className="w-full max-w-sm mx-auto md:max-w-none md:w-auto">
              <img
                src={HeroImg}
                alt="Jiso mental health companion"
                className="h-auto max-h-[450px] w-auto object-contain rounded-lg drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </main>

      {/* About Section */}
      <main
        className="min-h-[calc(100vh-64.8px)] bg-muted/50 py-16 md:py-24"
        id="about"
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              About Jiso
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Jiso was created for those moments when a therapist isn't
              available and friends feel distant. In a world where mental health
              support can be hard to access, Jiso offers a safe, judgment-free
              space where you can express your thoughts, track your emotional
              journey, and receive compassionate guidance.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Through thoughtful journaling, mood tracking, and AI-powered
              conversations with Ana, Jiso helps you develop self-awareness and
              coping strategies. We analyze patterns in your entries to offer
              personalized insights, helping you understand yourself better and
              navigate life's challenges with greater resilience.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Jiso isn't a replacement for professional help, but it's a
              companion for the in-between moments—when you need to process your
              thoughts, find clarity, or simply be heard. Because everyone
              deserves support on their journey toward healing and growth.
            </p>
            <Button variant="secondary" size="lg" className="mt-6" asChild>
              <Link to="/signup">Join Jiso Today</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <main className="py-16 md:py-24 cursor-pointer" id="features">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our thoughtfully designed tools work together to support your
              mental wellbeing journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {/* Journal Feature */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border flex flex-col items-center text-center group hover:border-primary/50 transition-all">
              <div className="w-16 h-16 mb-4 flex items-center justify-center bg-primary/10 rounded-full text-primary group-hover:bg-primary/20 transition-all">
                <BookOpenCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-primary">
                Daily Journaling
              </h3>
              <p className="text-muted-foreground">
                Express your thoughts freely in a private, secure space.
                Chronicle your experiences and reflect on your journey with
                structured or free-form entries.
              </p>
            </div>

            {/* Mood Tracking Feature */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border flex flex-col items-center text-center group hover:border-primary/50 transition-all">
              <div className="w-16 h-16 mb-4 flex items-center justify-center bg-primary/10 rounded-full text-primary group-hover:bg-primary/20 transition-all">
                <Brain size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-primary">
                Mood Logging
              </h3>
              <p className="text-muted-foreground">
                Track your emotional states over time to identify patterns and
                triggers. Visualize your mood journey with intuitive charts and
                gain insights into your emotional wellbeing.
              </p>
            </div>

            {/* AI Chat Feature */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border flex flex-col items-center text-center group hover:border-primary/50 transition-all">
              <div className="w-16 h-16 mb-4 flex items-center justify-center bg-primary/10 rounded-full text-primary group-hover:bg-primary/20 transition-all">
                <MessageSquareText size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-primary">
                Ana, Your AI Companion
              </h3>
              <p className="text-muted-foreground">
                Chat with Ana, our compassionate AI assistant, whenever you need
                someone to talk to. Available 24/7, Ana listens without judgment
                and offers supportive conversations when you need them most.
              </p>
            </div>

            {/* AI Insights Feature */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border flex flex-col items-center text-center group hover:border-primary/50 transition-all">
              <div className="w-16 h-16 mb-4 flex items-center justify-center bg-primary/10 rounded-full text-primary group-hover:bg-primary/20 transition-all">
                <BarChart3 size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-primary">
                AI Insights
              </h3>
              <p className="text-muted-foreground">
                Receive personalized insights based on your journal entries and
                mood patterns. Discover connections between your thoughts,
                feelings, and behaviors with AI-powered analysis that helps
                guide your growth.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild className="group">
              <Link to="/signup">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Meet Ana Section */}
      <section className="bg-muted/20 py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-5xl mx-auto">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-primary/20">
                <img
                  src={TherapistImg}
                  alt="Ana, your AI companion"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:w-2/3 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Meet Ana, Your AI Companion
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Ana is more than just an AI – she's your compassionate companion
                on the journey to better mental health. Trained to understand
                emotional nuances, Ana provides thoughtful responses to your
                concerns, offers gentle guidance during difficult moments, and
                celebrates your progress along the way.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you need a late-night conversation or help processing
                complex feelings, Ana is always available, always patient, and
                always focused on supporting your wellbeing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from people who have found solace and growth with Jiso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
              <p className="italic text-muted-foreground mb-4">
                "Jiso became my confidant during one of the most isolating
                periods of my life. Ana's insights helped me recognize patterns
                I never noticed before."
              </p>
              <p className="font-medium">Sarah T.</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
              <p className="italic text-muted-foreground mb-4">
                "I was skeptical about AI therapy, but Ana isn't trying to
                replace therapists. She's a companion that gives me space to
                process my thoughts daily."
              </p>
              <p className="font-medium">Marcus J.</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
              <p className="italic text-muted-foreground mb-4">
                "The mood tracking feature and conversations with Ana helped me
                identify what triggers my anxiety. Now I can prepare better for
                challenging situations."
              </p>
              <p className="font-medium">Aisha M.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Begin Your Healing Journey?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands who've found solace, insight, and growth with Jiso
            and Ana. Your path to better mental wellbeing starts with a single
            step.
          </p>
          <Button variant="secondary" size="lg" asChild className="group">
            <Link to="/signup">
              Create Your Account
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
