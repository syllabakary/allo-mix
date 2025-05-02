import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Carousel from '@/components/onboarding/Carousel';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

// Language translations
const translations = {
  en: {
    skip: "Skip",
    getStarted: "Get Started",
    next: "Next",
    slides: [
      {
        id: '1',
        title: 'Welcome to TeleRecharge',
        description: 'The easiest way to recharge data and airtime for any telecom operator.',
        image: 'https://images.pexels.com/photos/4386433/pexels-photo-4386433.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
      },
      {
        id: '2',
        title: 'Quick & Easy Recharges',
        description: 'Subscribe to mobile data, call, and SMS plans in just a few taps.',
        image: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
      },
      {
        id: '3',
        title: 'Multiple Payment Options',
        description: 'Pay with Mobile Money, Wave, bank cards, or even crypto.',
        image: 'https://images.pexels.com/photos/6347720/pexels-photo-6347720.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
      }
    ]
  },
  fr: {
    skip: "Passer",
    getStarted: "Commencer",
    next: "Suivant",
    slides: [
      {
        id: '1',
        title: 'Bienvenue sur TeleRecharge',
        description: 'Le moyen le plus simple de recharger des données et du crédit pour tout opérateur télécom.',
        image: 'https://images.pexels.com/photos/4386433/pexels-photo-4386433.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
      },
      {
        id: '2',
        title: 'Recharges Rapides et Faciles',
        description: 'Souscrivez à des forfaits de données mobiles, d\'appels et de SMS en quelques clics.',
        image: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
      },
      {
        id: '3',
        title: 'Options de Paiement Multiples',
        description: 'Payez avec Mobile Money, Wave, cartes bancaires, ou même en crypto.',
        image: 'https://images.pexels.com/photos/6347720/pexels-photo-6347720.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
      }
    ]
  }
};

type Language = 'en' | 'fr';

export default function OnboardingScreen() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [language, setLanguage] = useState<Language>('en');
  
  const t = translations[language];

  const handleSlideChange = (index: number) => {
    setActiveSlide(index);
  };

  const handleGetStarted = () => {
    router.replace('/(onboarding)/login');
  };

  const handleSkip = () => {
    router.replace('/(onboarding)/login');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>{t.skip}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
          <Text style={styles.languageText}>{language === 'en' ? 'FR' : 'EN'}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.carouselContainer}>
        <Carousel slides={t.slides} onSlideChange={handleSlideChange} />
      </View>
      
      <View style={styles.footer}>
        <View style={styles.paginationContainer}>
          {t.slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                activeSlide === index && styles.paginationDotActive
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>
            {activeSlide === t.slides.length - 1 ? t.getStarted : t.next}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: 50,
    zIndex: 10,
  },
  skipText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.secondary.main,
  },
  languageToggle: {
    backgroundColor: Colors.grey[200],
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
  },
  languageText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.sm,
    color: Colors.grey[800],
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Layout.spacing.lg,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.grey[300],
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary.main,
    width: 20,
  },
  button: {
    backgroundColor: Colors.primary.main,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.primary.contrastText,
  },
});