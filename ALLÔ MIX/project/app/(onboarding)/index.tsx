import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import Carousel from '@/components/onboarding/Carousel';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

export default function OnboardingScreen() {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    {
      id: '1',
      title: 'Bienvenue sur TeleRecharge',
      description: 'La façon la plus simple de recharger vos données et votre crédit pour tous les opérateurs.',
      image: 'https://images.pexels.com/photos/4386433/pexels-photo-4386433.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    },
    {
      id: '2',
      title: 'Recharges Rapides & Faciles',
      description: 'Souscrivez à des forfaits data, appels et SMS en quelques clics.',
      image: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    },
    {
      id: '3',
      title: 'Options de Paiement Multiples',
      description: 'Payez avec Mobile Money, Wave, cartes bancaires, ou même en crypto.',
      image: 'https://images.pexels.com/photos/6347720/pexels-photo-6347720.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    }
  ];

  const handleSlideChange = (index: number) => {
    setActiveSlide(index);
  };

  const handleGetStarted = () => {
    router.replace('/(onboarding)/login');
  };

  const handleSkip = () => {
    router.replace('/(onboarding)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.carouselContainer}>
        <Carousel slides={slides} onSlideChange={handleSlideChange} />
      </View>
      
      <View style={styles.footer}>
        <View style={styles.paginationContainer}>
          {slides.map((_, index) => (
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
            {activeSlide === slides.length - 1 ? 'Commencer' : 'Suivant'}
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
  skipContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.secondary.main,
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