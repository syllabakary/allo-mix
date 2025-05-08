import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withRepeat, 
  withSequence, 
  withDelay,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Définition des constantes pour la mise en page
const Layout = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
  }
};

// Définition des tailles de police
const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
};

// Thème de couleurs
const Colors = {
  primary: {
    main: '#FFC107', // Primary Yellow
    light: '#FFECB3',
    dark: '#FFA000',
    contrastText: '#000000'
  },
  secondary: {
    main: '#007BFF', // Secondary Blue
    light: '#80BDFF',
    dark: '#0056B3',
    contrastText: '#FFFFFF'
  },
  background: {
    default: '#F8F9FA', // Tertiary White
    paper: '#FFFFFF',
    dark: '#F0F0F0'
  },
  grey: {
    50: '#F8F9FA',
    100: '#E9ECEF',
    200: '#DEE2E6',
    300: '#CED4DA',
    400: '#ADB5BD',
    500: '#6C757D',
    600: '#495057',
    700: '#343A40',
    800: '#212529',
    900: '#121416'
  },
  common: {
    black: '#000000',
    white: '#FFFFFF'
  },
};

// Composant d'icône animée pour Smartphone
const AnimatedSmartphone = ({ isActive }) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      scale.value = withSpring(1.2, { damping: 10 });
      rotation.value = withSequence(
        withTiming(-15, { duration: 200 }),
        withRepeat(
          withSequence(
            withTiming(15, { duration: 400 }),
            withTiming(-15, { duration: 400 })
          ),
          2
        ),
        withTiming(0, { duration: 200 })
      );
    } else {
      scale.value = withSpring(1);
      rotation.value = withTiming(0);
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotateZ: `${rotation.value}deg` }
      ]
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <MaterialIcons name="smartphone" size={64} color={Colors.primary.main} />
    </Animated.View>
  );
};

// Composant d'icône animée pour Zap
const AnimatedZap = ({ isActive }) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 300 }),
          withTiming(1, { duration: 300 })
        ), 
        3
      );
      
      opacity.value = 1;
      translateY.value = withDelay(600, 
        withTiming(-30, { 
          duration: 700,
          easing: Easing.out(Easing.cubic)
        })
      );
    } else {
      scale.value = withSpring(1);
      translateY.value = 0;
      opacity.value = 1;
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });

  const sparkStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }]
    };
  });

  return (
    <View style={{ alignItems: 'center' }}>
      <Animated.View style={animatedStyle}>
        <Ionicons name="flash" size={64} color={Colors.common.white} />
      </Animated.View>
      {isActive && (
        <>
          <Animated.View style={[sparkStyle, { right: -10, top: 10 }]}>
            <Ionicons name="flash" size={16} color={Colors.primary.light} />
          </Animated.View>
          <Animated.View style={[sparkStyle, { left: -5, top: 5 }]}>
            <Ionicons name="flash" size={24} color={Colors.primary.light} />
          </Animated.View>
        </>
      )}
    </View>
  );
};

// Composant d'icône animée pour CreditCard
const AnimatedCreditCard = ({ isActive }) => {
  const rotate = useSharedValue('0deg');
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      rotate.value = withSequence(
        withTiming('180deg', { duration: 800 }),
        withTiming('360deg', { duration: 800 })
      );
      
      opacity.value = withTiming(1, { duration: 400 });
      translateY.value = withSequence(
        withDelay(400, withTiming(-15, { duration: 300 })),
        withTiming(0, { duration: 300 })
      );
    } else {
      rotate.value = '0deg';
      opacity.value = withTiming(0);
      translateY.value = 0;
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: rotate.value }]
    };
  });

  const paymentSymbolStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
      top: -30,
      alignSelf: 'center'
    };
  });

  return (
    <View style={{ alignItems: 'center' }}>
      <Animated.View style={animatedStyle}>
        <FontAwesome5 name="credit-card" size={64} color={Colors.common.white} />
      </Animated.View>
      <Animated.View style={paymentSymbolStyle}>
        <Text style={{ fontSize: 24 }}>💸</Text>
      </Animated.View>
    </View>
  );
};

// Composant Carousel simple
const Carousel = ({ slides, onSlideChange, currentIndex }) => {
  // Utilise directement l'index passé par le parent au lieu de gérer son propre état
  return (
    <View style={styles.carouselContainer}>
      <View style={styles.slideContainer}>
        {slides[currentIndex].icon}
        <Text style={styles.slideTitle}>{slides[currentIndex].title}</Text>
        <Text style={styles.slideDescription}>{slides[currentIndex].description}</Text>
      </View>
    </View>
  );
};

// Translation
const translations = {
  en: {
    skip: "Skip",
    getStarted: "Get Started",
    next: "Next"
  },
  fr: {
    skip: "Passer",
    getStarted: "Commencer",
    next: "Suivant"
  }
};

// Définition des slides
const getSlides = (language, activeSlide) => {
  if (language === 'en') {
    return [
      {
        id: '1',
        title: 'Welcome to Hallô Mix',
        description: 'The easiest way to recharge data and airtime for any telecom operator.',
        icon: (
          <View style={[styles.iconContainer, { backgroundColor: Colors.primary.light }]}>
            <AnimatedSmartphone isActive={activeSlide === 0} />
          </View>
        )
      },
      {
        id: '2',
        title: 'Quick & Easy Recharges',
        description: 'Subscribe to mobile data, call, and SMS plans in just a few taps.',
        icon: (
          <View style={[styles.iconContainer, { backgroundColor: Colors.secondary.main }]}>
            <AnimatedZap isActive={activeSlide === 1} />
          </View>
        )
      },
      {
        id: '3',
        title: 'Multiple Payment Options',
        description: 'Pay with Mobile Money, Wave, bank cards, or even crypto.',
        icon: (
          <View style={[styles.iconContainer, { backgroundColor: Colors.primary.dark }]}>
            <AnimatedCreditCard isActive={activeSlide === 2} />
          </View>
        )
      }
    ];
  } else {
    return [
      {
        id: '1',
        title: 'Bienvenue sur Hallô Mix',
        description: 'Le moyen le plus simple de recharger des données et du crédit pour tout opérateur télécom.',
        icon: (
          <View style={[styles.iconContainer, { backgroundColor: Colors.primary.light }]}>
            <AnimatedSmartphone isActive={activeSlide === 0} />
          </View>
        )
      },
      {
        id: '2',
        title: 'Recharges Rapides et Faciles',
        description: 'Souscrivez à des forfaits de données mobiles, d\'appels et de SMS en quelques clics.',
        icon: (
          <View style={[styles.iconContainer, { backgroundColor: Colors.secondary.main }]}>
            <AnimatedZap isActive={activeSlide === 1} />
          </View>
        )
      },
      {
        id: '3',
        title: 'Options de Paiement Multiples',
        description: 'Payez avec Mobile Money, Wave, cartes bancaires, ou même en crypto.',
        icon: (
          <View style={[styles.iconContainer, { backgroundColor: Colors.primary.dark }]}>
            <AnimatedCreditCard isActive={activeSlide === 2} />
          </View>
        )
      }
    ];
  }
};

// Bouton animé
const AnimatedButton = ({ onPress, backgroundColor, label, textColor }) => {
  const scale = useSharedValue(1);
  
  const onPressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };
  
  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor }]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Écran d'onboarding
export default function OnboardingScreen() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [language, setLanguage] = useState('fr'); // Français par défaut
  
  const t = translations[language];
  const slides = getSlides(language, activeSlide);

  // Animation pour l'indicateur de pagination
  const dotWidth = useSharedValue(8);
  
  useEffect(() => {
    dotWidth.value = withTiming(20, { duration: 300 });
    return () => {
      dotWidth.value = 8;
    };
  }, [activeSlide]);

  const handleGetStarted = () => {
    // Navigation vers la page de login
    router.replace('/(onboarding)/login');
  };

  const handleSkip = () => {
    // Navigation vers la page de login
    router.replace('/(onboarding)/login');
  };
  
  const handleNext = () => {
    // Avancer manuellement au prochain slide
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  // Animation pour le bouton de langue
  const langScale = useSharedValue(1);
  
  const langButtonPress = () => {
    langScale.value = withSequence(
      withTiming(0.8, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
    toggleLanguage();
  };
  
  const langButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: langScale.value }],
      backgroundColor: Colors.primary.light,
      paddingHorizontal: Layout.spacing.md,
      paddingVertical: Layout.spacing.sm,
      borderRadius: Layout.borderRadius.sm,
      borderWidth: 1,
      borderColor: Colors.primary.main
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>{t.skip}</Text>
        </TouchableOpacity>
        
        <Animated.View style={langButtonStyle}>
          <TouchableOpacity onPress={langButtonPress}>
            <Text style={styles.languageText}>
              {language === 'en' ? 'FR' : 'EN'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      
      <View style={styles.carouselContainer}>
        <Carousel 
          slides={slides} 
          onSlideChange={setActiveSlide}
          currentIndex={activeSlide}
        />
      </View>
      
      <View style={styles.footer}>
        <View style={styles.paginationContainer}>
          {slides.map((_, index) => {
            const isActive = activeSlide === index;
            
            return (
              <Animated.View
                key={index}
                style={[
                  styles.paginationDot,
                  { 
                    backgroundColor: isActive ? Colors.primary.main : Colors.grey[300],
                    width: isActive ? dotWidth : 8
                  }
                ]}
              />
            );
          })}
        </View>
        
        <AnimatedButton
          backgroundColor={Colors.primary.main}
          textColor={Colors.primary.contrastText}
          label={activeSlide === slides.length - 1 ? t.getStarted : t.next}
          onPress={activeSlide === slides.length - 1 ? handleGetStarted : handleNext}
        />
      </View>
    </SafeAreaView>
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
    fontSize: FontSizes.md,
    color: Colors.secondary.main,
    fontWeight: '500',
  },
  languageText: {
    fontSize: FontSizes.sm,
    color: Colors.primary.main,
    fontWeight: '600',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'visible',
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.lg,
  },
  slideTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
    color: Colors.grey[800],
  },
  slideDescription: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    color: Colors.grey[600],
    marginBottom: Layout.spacing.lg,
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
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
});