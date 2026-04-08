'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, Rocket, Star, ShieldCheck, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function MembershipPage() {
  const userProfile = useQuery(api.users.getProfile)
  
  const updateMembership = useMutation(api.users.updateMembership)
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null)

  const handleUpgrade = async (plan: string) => {
    try {
      setLoadingPlan(plan)
      // Small delay for "premium" feel
      await new Promise(resolve => setTimeout(resolve, 800))
      await updateMembership({ plan: plan.toLowerCase() as any })
    } catch (err) {
      console.error("Upgrade failed:", err)
    } finally {
      setLoadingPlan(null)
    }
  }

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for exploring your potential.',
      features: [
        '3 Skill analysis credits per day',
        'Basic roadmap generation',
        'Standard industry comparison',
        'Community support'
      ],
      buttonText: 'Current Plan',
      isCurrent: userProfile?.membership === 'free' || !userProfile?.membership,
      icon: <Star className="w-6 h-6 text-muted-foreground" />,
      color: 'border-border'
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'The ultimate toolkit for career growth.',
      features: [
        'Unlimited AI analysis credits',
        'Priority high-definition roadmaps',
        'Detailed industry benchmarking',
        'AI Career Coach access',
        'Exportable career reports',
        'Priority email support'
      ],
      buttonText: 'Upgrade Now',
      isCurrent: userProfile?.membership === 'pro',
      icon: <Rocket className="w-6 h-6 text-primary" />,
      highlight: true,
      color: 'border-primary shadow-2xl shadow-primary/10'
    },
    {
      name: 'Elite',
      price: '$25',
      period: '/month',
      description: 'For those who want zero compromises.',
      features: [
        'Everything in Pro plan',
        '1-on-1 AI Mentorship sessions',
        'Custom career path visualization',
        'Early access to new AI features',
        'Unlimited HD roadmap exports',
        'Dedicated account manager'
      ],
      buttonText: 'Go Elite',
      isCurrent: userProfile?.membership === 'elite',
      icon: <Cpu className="w-6 h-6 text-primary" />,
      color: 'border-border hover:border-primary/50 transition-colors'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight"
        >
          Elevate Your Career with <span className="text-primary">Pro</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Unlock unlimited analysis, personalized coaching, and the most advanced AI features to accelerate your journey.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-8 rounded-2xl border-2 bg-card ${plan.color} flex flex-col h-full`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full uppercase tracking-widest shadow-lg">
                Recommended
              </div>
            )}
            
            <div className="mb-8">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6">
                {plan.icon}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-foreground">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
              <p className="text-muted-foreground">{plan.description}</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-foreground/80">
                  <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <Button 
              disabled={plan.isCurrent || (loadingPlan !== null)}
              onClick={() => handleUpgrade(plan.name)}
              className={`w-full h-12 text-base font-bold rounded-xl transition-all ${
                plan.highlight 
                  ? 'bg-primary text-primary-foreground hover:scale-[1.02] shadow-xl' 
                  : 'bg-transparent border-2 border-primary/20 text-foreground hover:bg-muted hover:border-primary/40'
              } ${plan.isCurrent ? 'opacity-50 grayscale cursor-not-allowed border-muted-foreground/30' : ''}`}
            >
              {loadingPlan === plan.name ? 'Activating...' : plan.isCurrent ? 'Current Plan' : plan.buttonText}
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 border-t border-border pt-12 flex flex-col md:flex-row items-center justify-between gap-8 text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Secure Payment Processing</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Enterprise AI Models</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Instant Plan Activation</span>
        </div>
      </div>
    </div>
  )
}
