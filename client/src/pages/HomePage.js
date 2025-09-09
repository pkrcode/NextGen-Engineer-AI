import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Award, BookOpen, Zap, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-6">
              <Star className="w-4 h-4 mr-2" />
              Next Generation Engineering Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Master Your
              <span className="text-gradient block leading-none">Engineering Career</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              AI-powered career guidance, collaborative learning, and skill development for the next generation of engineers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
              <Link to="/careers" className="btn-primary group flex items-center justify-center">
                Explore Careers
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/signup" className="btn-outline flex items-center justify-center">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20"></div>
        </div>
        <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-16 h-16 bg-secondary-200 dark:bg-secondary-800 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From career exploration to skill mastery, we've got you covered with cutting-edge tools and AI assistance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Career Guidance",
                description: "Discover high-demand roles, required skills, and salary insights with AI-powered recommendations.",
                color: "primary",
                link: "/career-guidance"
              },
              {
                icon: BookOpen,
                title: "Learning Paths",
                description: "Personalized roadmaps tailored to your goals, with milestones and progress tracking.",
                color: "secondary",
                link: "/learning-paths-feature"
              },
              {
                icon: Users,
                title: "Collaboration",
                description: "Work with peers on projects, share knowledge, and build your professional network.",
                color: "success",
                link: "/collaboration"
              },
              {
                icon: Award,
                title: "Skill Verification",
                description: "Earn badges and certifications through quizzes, projects, and portfolio building.",
                color: "warning",
                link: "/skill-verification"
              },
              {
                icon: Zap,
                title: "AI Mentorship",
                description: "Get instant help from AI assistants and connect with real industry mentors.",
                color: "error",
                link: "/ai-mentorship"
              },
              {
                icon: Star,
                title: "Gamification",
                description: "Stay motivated with XP, levels, leaderboards, and achievement systems.",
                color: "primary",
                link: "/gamification"
              }
            ].map((feature, index) => (
              <Link key={index} to={feature.link} className="card hover-card animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Engineering Career?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students and professionals who are already using our platform to accelerate their growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
            <Link to="/signup" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center">
              Start Your Journey
            </Link>
            <Link to="/careers" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-xl transition-all duration-300 flex items-center justify-center">
              Explore Careers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
