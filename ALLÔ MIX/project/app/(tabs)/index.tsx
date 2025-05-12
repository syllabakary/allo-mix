import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing, Dimensions, Image } from 'react-native';
import { router } from 'expo-router';
import { Phone, Zap, MessageSquare, Gift, ChevronRight, AlertCircle, ExternalLink, Sparkles, TrendingUp, Clock, ArrowUpDown, User, Briefcase } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Header from '@/components/common/Header';
import QuickAction from '@/components/dashboard/QuickAction';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

const { width } = Dimensions.get('window');

// Composant pour la carte avec numéro d'utilisateur dynamique
const UserNumberCard = ({ phoneNumber, onPress }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation de pulsation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ])
    ).start();

    // Animation de rotation subtile
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity 
      style={styles.userCardContainer} 
      activeOpacity={0.9}
      onPress={onPress}
    >
      <LinearGradient
        colors={[Colors.primary.dark, Colors.primary.main]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.userCard}
      >
        {/* Éléments décoratifs animés */}
        <Animated.View 
          style={[
            styles.userDecorCircle,
            { 
              transform: [{ rotate: rotateInterpolate }],
              backgroundColor: Colors.primary.light + '40'
            }
          ]} 
        />
        
        <View style={styles.userHeader}>
          <Animated.View 
            style={[
              styles.userIconContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <User color={Colors.common.white} size={24} />
          </Animated.View>
          
          <QuickAction 
            icon={<ArrowUpDown color={Colors.common.white} size={24} />}
            title="Transfert"
            color={Colors.secondary.main}
            onPress={() => router.push('/(modals)/transfer')}
            style={styles.transferButton}
          />
        </View>
        
        <Text style={styles.userLabel}>Votre numéro</Text>
        <Text style={styles.userPhoneNumber}>{phoneNumber}</Text>
        
        <View style={styles.userFooter}>
          <View style={styles.userFooterIcon}>
            <ChevronRight color={Colors.common.white} size={14} />
          </View>
          <Text style={styles.userFooterText}>Détails du compte</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Composant unique pour la promotion
const ModernPromoCard = ({ title, description, cta, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.92}>
      <Animated.View 
        style={[
          styles.promoCardContainer, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={[Colors.secondary.dark, Colors.secondary.main]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.promoCard}
        >
          {/* Badge promo */}
          <View style={styles.promoBadge}>
            <Sparkles color={Colors.common.white} size={14} />
            <Text style={styles.promoBadgeText}>NOUVEAUTÉ</Text>
          </View>
          
          {/* Contenu */}
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>{title}</Text>
            <Text style={styles.promoDescription}>{description}</Text>
            
            <View style={styles.promoCtaButton}>
              <Text style={styles.promoCtaText}>{cta}</Text>
              <ExternalLink color={Colors.common.white} size={16} style={styles.promoCtaIcon} />
            </View>
          </View>
          
          {/* Image illustrative */}
          <View style={styles.promoImageContainer}>
            <Image 
              // source={require('@/assets/images/promo.png')} 
              style={styles.promoImage}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Composant pour les cartes de consommation
const UsageCard = ({ icon, title, used, total, unit, daysLeft, color }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  const percentUsed = (used / total) * 100;
  
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percentUsed / 100,
      duration: 1300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  }, [used, total]);
  
  const widthInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  
  return (
    <View style={[styles.usageCard, { borderLeftColor: color }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.cardIconContainer, { backgroundColor: color + '20' }]}>
          {icon}
        </View>
        <View style={styles.cardRemainingContainer}>
          <Clock size={14} color={Colors.grey[500]} style={{ marginRight: 4 }} />
          <Text style={styles.cardRemainingText}>{daysLeft} jours restants</Text>
        </View>
      </View>
      
      <Text style={styles.cardTitle}>{title}</Text>
      
      <View style={styles.usageTextContainer}>
        <Text style={[styles.usageValue, { color }]}>{used} <Text style={styles.usageUnit}>{unit}</Text></Text>
        <Text style={styles.usageTotal}>/ {total} {unit}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { width: widthInterpolate, backgroundColor: color }
            ]}
          />
        </View>
      </View>
    </View>
  );
};

// Composant Tab amélioré
const EnhancedTabs = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.enhancedTabsContainer}>
      <TouchableOpacity 
        style={[styles.tabButton, activeTab === 'personal' && styles.activeTab]}
        onPress={() => setActiveTab('personal')}
      >
        <User 
          size={18} 
          color={activeTab === 'personal' ? Colors.primary.main : Colors.grey[600]} 
          style={styles.tabIcon}
        />
        <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>
          Personnel
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tabButton, activeTab === 'business' && styles.activeTab]}
        onPress={() => setActiveTab('business')}
      >
        <Briefcase 
          size={18} 
          color={activeTab === 'business' ? Colors.primary.main : Colors.grey[600]} 
          style={styles.tabIcon}
        />
        <Text style={[styles.tabText, activeTab === 'business' && styles.activeTabText]}>
          Professionnel
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('personal');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Allô mix" showNotification />
      
      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Toggle (Personnel/Professionnel) */}
        <Animated.View 
          style={[
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <EnhancedTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </Animated.View>
        
        {/* Carte numéro d'utilisateur dynamique */}
        <Animated.View 
          style={[
            { transform: [{ translateY: Animated.multiply(slideAnim, 0.9) }] }
          ]}
        >
          <UserNumberCard 
            phoneNumber="+225 07 07 07 07 07"
            onPress={() => router.push('/(modals)/userdetails')}
          />
        </Animated.View>
        
        {/* Section Consommation */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderWithIcon}>
            <TrendingUp size={20} color={Colors.primary.main} />
            <Text style={styles.sectionTitle}>Votre Consommation</Text>
          </View>
          
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            <UsageCard 
              icon={<Zap color={Colors.primary.main} size={24} />}
              title="Internet"
              used={3.5}
              total={5}
              unit="Go"
              daysLeft={7}
              color={Colors.primary.main}
            />
            <UsageCard 
              icon={<Phone color={Colors.secondary.main} size={24} />}
              title="Appels"
              used={35}
              total={100}
              unit="min"
              daysLeft={7}
              color={Colors.secondary.main}
            />
            <UsageCard 
              icon={<MessageSquare color="#9C27B0" size={24} />}
              title="SMS"
              used={25}
              total={100}
              unit="SMS"
              daysLeft={7}
              color="#9C27B0"
            />
          </ScrollView>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderWithIcon}>
            <Zap size={20} color={Colors.primary.main} />
            <Text style={styles.sectionTitle}>Actions Rapides</Text>
          </View>
          
          <View style={styles.actionsGrid}>
            <QuickAction 
              icon={<Zap color={Colors.common.white} size={24} />}
              title="Données"
              color={Colors.primary.main}
              onPress={() => router.push('/(tabs)/packages')}
            />
            <QuickAction 
              icon={<Phone color={Colors.common.white} size={24} />}
              title="Appels"
              color={Colors.secondary.main}
              onPress={() => router.push('/(tabs)/packages')}
            />
            <QuickAction 
              icon={<MessageSquare color={Colors.common.white} size={24} />}
              title="SMS"
              color="#9C27B0"
              onPress={() => router.push('/(tabs)/packages')}
            />
            <QuickAction 
              icon={<Gift color={Colors.common.white} size={24} />}
              title="Cadeaux"
              color="#E91E63"
              onPress={() => router.push('/(modals)/gift')}
            />
          </View>
        </View>
        
        {/* Carte Promotion Unique */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderWithIcon}>
            <Sparkles size={20} color={Colors.primary.main} />
            <Text style={styles.sectionTitle}>Offre Spéciale</Text>
          </View>
          
          <ModernPromoCard 
            title="Forfait Illimité"
            description="Profitez d'appels, SMS et internet illimités pendant 7 jours"
            cta="Découvrir"
            onPress={() => router.push('/(modals)/specialoffer')}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  
  // Styles Tabs
  enhancedTabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.xs,
    marginVertical: Layout.spacing.lg,
    shadowColor: Colors.grey[300],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.sm,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: Colors.primary.light + '30',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.grey[600],
  },
  activeTabText: {
    color: Colors.primary.main,
    fontFamily: 'Poppins-SemiBold',
  },
  
  // Styles pour les sections
  sectionContainer: {
    marginBottom: Layout.spacing.xl,
  },
  sectionHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.grey[800],
    marginLeft: 8,
  },
  horizontalScrollContent: {
    paddingRight: Layout.spacing.lg,
    paddingBottom: Layout.spacing.sm,
  },
  
  // Styles pour la carte utilisateur
  userCardContainer: {
    marginBottom: Layout.spacing.xl,
    borderRadius: Layout.borderRadius.xl,
    overflow: 'hidden',
    shadowColor: Colors.primary.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  userCard: {
    padding: Layout.spacing.lg,
    minHeight: 180,
    position: 'relative',
  },
  userDecorCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -100,
    right: -100,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  userIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary.light + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transferButton: {
    backgroundColor: Colors.secondary.main,
    padding: 8,
    borderRadius: 12,
    elevation: 3,
  },
  userLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.md,
    color: Colors.common.white + 'CC',
    marginBottom: Layout.spacing.xs,
  },
  userPhoneNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xl,
    color: Colors.common.white,
    marginBottom: Layout.spacing.md,
  },
  userFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  userFooterIcon: {
    backgroundColor: Colors.common.white + '30',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.sm,
  },
  userFooterText: {
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.sm,
    color: Colors.common.white + 'CC',
  },
  
  // Styles pour les actions rapides
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  // Styles pour les cartes de consommation
  usageCard: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    marginRight: Layout.spacing.lg,
    width: width * 0.65,
    borderLeftWidth: 4,
    shadowColor: Colors.grey[300],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRemainingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRemainingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.sm,
    color: Colors.grey[500],
  },
  cardTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.grey[800],
    marginBottom: Layout.spacing.sm,
  },
  usageTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Layout.spacing.sm,
  },
  usageValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xl,
    marginRight: Layout.spacing.xs,
  },
  usageUnit: {
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.sm,
  },
  usageTotal: {
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.sm,
    color: Colors.grey[500],
  },
  progressContainer: {
    marginTop: Layout.spacing.sm,
  },
  progressBackground: {
    height: 6,
    backgroundColor: Colors.grey[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  // Styles pour la carte promo
  promoCardContainer: {
    borderRadius: Layout.borderRadius.xl,
    overflow: 'hidden',
    shadowColor: Colors.secondary.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  promoCard: {
    padding: Layout.spacing.lg,
    minHeight: 180,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  promoBadge: {
    position: 'absolute',
    top: Layout.spacing.md,
    right: Layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.common.white + '30',
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.lg,
  },
  promoBadgeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.xs,
    color: Colors.common.white,
    marginLeft: Layout.spacing.xs,
  },
  promoContent: {
    flex: 1,
    zIndex: 10,
  },
  promoTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.lg,
    color: Colors.common.white,
    marginBottom: Layout.spacing.sm,
  },
  promoDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.md,
    color: Colors.common.white + 'CC',
    marginBottom: Layout.spacing.md,
  },
  promoCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.common.white,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    alignSelf: 'flex-start',
  },
  promoCtaText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.md,
    color: Colors.secondary.main,
    marginRight: Layout.spacing.sm,
  },
  promoCtaIcon: {
    marginLeft: Layout.spacing.xs,
  },
  promoImageContainer: {
    width: 120,
    height: 120,
    marginLeft: Layout.spacing.md,
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
});