import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Phone, Zap as ZapFast, MessageSquare, Gift, ChevronRight, CircleAlert as AlertCircle, ExternalLink, Tag, Sparkles, TrendingUp, Clock, ArrowUpDown, Wallet } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Header from '@/components/common/Header';
import QuickAction from '@/components/dashboard/QuickAction';
import RechargeCard from '@/components/dashboard/RechargeCard';
import PromoCard from '@/components/dashboard/PromoCard';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

const { width } = Dimensions.get('window');

// Composant Card Publicitaire avec animation simplifiée
const AdCard = ({ title, description, cta, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Animation simple de fade-in et slide
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.92}>
      <Animated.View 
        style={[
          styles.adCardContainer, 
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={['#352A03FF', '#F6D12BFF', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.adCard}
        >
          {/* Badge promo */}
          <View style={styles.adBadge}>
            <Sparkles color="#FF6B00" size={14} />
            <Text style={styles.adBadgeText}>OFFRE LIMITÉE</Text>
          </View>
          
          {/* Contenu */}
          <View style={styles.adContentContainer}>
            <Text style={styles.adTitle}>{title}</Text>
            <Text style={styles.adDescription}>{description}</Text>
            
            <View style={styles.adCtaButton}>
              <Text style={styles.adCtaText}>{cta}</Text>
              <ExternalLink color="#FF6B00" size={16} style={styles.adCtaIcon} />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Composant pour afficher le solde actuel
const BalanceCard = ({ balance, currency, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.balanceCardContainer} 
      activeOpacity={0.9}
      onPress={onPress}
    >
      <LinearGradient
        colors={['#0A2463', '#3E92CC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <View style={styles.balanceHeader}>
          <Wallet color="#FFFFFF" size={24} />
          <TouchableOpacity style={styles.rechargeButton} onPress={onPress}>
            <Text style={styles.rechargeButtonText}>Recharger</Text>
            <ChevronRight color="#FFFFFF" size={14} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.balanceLabel}>Solde Disponible</Text>
        <Text style={styles.balanceAmount}>{balance.toLocaleString()} <Text style={styles.balanceCurrency}>{currency}</Text></Text>
        
        <View style={styles.balanceFooter}>
          <Text style={styles.balanceFooterText}>Appuyez pour voir les détails</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Composant modernisé pour les cartes de consommation
const ModernUsageCard = ({ icon, title, used, total, unit, daysLeft, color, shadowColor }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  const percentUsed = (used / total) * 100;
  
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percentUsed / 100,
      duration: 1300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [used, total]);
  
  const widthInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const isPrimary = color === Colors.primary.main;
  
  return (
    <View style={[styles.modernCard, { backgroundColor: '#FFFFFF' }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.cardIconContainer, { backgroundColor: color + '20' }]}>
          {icon}
        </View>
        <View style={styles.cardRemainingContainer}>
          <Clock size={14} color="#6E7191" style={{ marginRight: 4 }} />
          <Text style={styles.cardRemainingText}>{daysLeft} jours restants</Text>
        </View>
      </View>
      
      <Text style={styles.cardTitle}>{title}</Text>
      
      <View style={styles.usageTextContainer}>
        <Text style={styles.usageValue}>{used} <Text style={styles.usageUnit}>{unit}</Text></Text>
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
        {isPrimary && (
          <Animated.View 
            style={[
              styles.progressIndicator,
              { transform: [{ rotate: rotateInterpolate }] }
            ]}
          >
            <TrendingUp size={14} color="#FFFFFF" />
          </Animated.View>
        )}
      </View>
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
      <Header title="TéléRecharge" showNotification />
      
      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Toggle (Personnel/Professionnel) */}
        <Animated.View 
          style={[
            styles.toggleContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <TouchableOpacity 
            style={[styles.toggleButton, activeTab === 'personal' && styles.activeToggle]}
            onPress={() => setActiveTab('personal')}
          >
            <Text style={[styles.toggleText, activeTab === 'personal' && styles.activeToggleText]}>
              Personnel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, activeTab === 'business' && styles.activeToggle]}
            onPress={() => setActiveTab('business')}
          >
            <Text style={[styles.toggleText, activeTab === 'business' && styles.activeToggleText]}>
              Professionnel
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Carte de solde */}
        <Animated.View 
          style={[
            { transform: [{ translateY: Animated.multiply(slideAnim, 0.9) }] }
          ]}
        >
          <BalanceCard 
            balance={25000}
            currency="F CFA"
            onPress={() => router.push('/(tabs)/wallet')}
          />
        </Animated.View>
        
        {/* Carte Publicitaire Dynamique - Orange et Noir */}
        <Animated.View 
          style={[
            styles.adContainer,
            { transform: [{ translateY: Animated.multiply(slideAnim, 0.8) }] }
          ]}
        >
          <AdCard 
            title="2X BONUS CRÉDIT"
            description="Rechargez dès maintenant et doublez votre crédit ! Cette offre exclusive expire dans 24h."
            cta="Profiter maintenant"
            imageUrl="https://votre-url-image.com/promo.jpg" // Ajoutez l'URL de votre image ici
            onPress={() => router.push('/(modals)/specialoffer')}
          />
        </Animated.View>
        
        {/* Usage Section Modernisée */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Votre Consommation</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            <ModernUsageCard 
              icon={<ZapFast color={Colors.primary.main} size={24} />}
              title="Internet"
              used={3.5}
              total={5}
              unit="Go"
              daysLeft={7}
              color={Colors.primary.main}
              shadowColor={Colors.primary.light}
            />
            <ModernUsageCard 
              icon={<Phone color="#FF9800" size={24} />}
              title="Appels"
              used={35}
              total={100}
              unit="min"
              daysLeft={7}
              color="#FF9800"
              shadowColor="#FFCC80"
            />
            <ModernUsageCard 
              icon={<MessageSquare color="#9C27B0" size={24} />}
              title="SMS"
              used={25}
              total={100}
              unit="SMS"
              daysLeft={7}
              color="#9C27B0"
              shadowColor="#CE93D8"
            />
          </ScrollView>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Actions Rapides</Text>
          <View style={styles.actionsContainer}>
            <QuickAction 
              icon={<ZapFast color={Colors.common.white} size={24} />}
              title="Acheter des données"
              color={Colors.secondary.main}
              onPress={() => router.push('/(tabs)/packages')}
            />
            <QuickAction 
              icon={<Phone color={Colors.common.white} size={24} />}
              title="Forfait appels"
              color="#FF9800"
              onPress={() => router.push('/(tabs)/packages')}
            />
            <QuickAction 
              icon={<MessageSquare color={Colors.common.white} size={24} />}
              title="Forfait SMS"
              color="#9C27B0"
              onPress={() => router.push('/(tabs)/packages')}
            />
            <QuickAction 
              icon={<Gift color={Colors.common.white} size={24} />}
              title="Cadeaux"
              color="#E91E63"
              onPress={() => router.push('/(modals)/gift')}
            />
            <QuickAction 
              icon={<ArrowUpDown color={Colors.common.white} size={24} />}
              title="Inter Transfert"
              color="#4CAF50"
              onPress={() => router.push('/(modals)/transfer')}
            />
          </View>
        </View>
        
        {/* Recent Recharges */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recharges Récentes</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
              <View style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>Tout voir</Text>
                <ChevronRight color={Colors.secondary.main} size={16} />
              </View>
            </TouchableOpacity>
          </View>
          
          <RechargeCard 
            operator="Orange"
            amount={6000}
            date="2023-06-10"
            type="Forfait Internet"
            success={true}
            currency="F CFA"
          />
          <RechargeCard 
            operator="MTN"
            amount={3000}
            date="2023-06-08"
            type="Crédit"
            success={true}
            currency="F CFA"
          />
          <RechargeCard 
            operator="Moov"
            amount={12000}
            date="2023-06-05"
            type="Voix + Internet"
            success={false}
            currency="F CFA"
          />
        </View>
        
        {/* Promotions Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Offres Spéciales</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            <PromoCard 
              title="Forfait Weekend"
              description="Obtenez 3Go pour seulement 1000 F CFA ce weekend !"
              discount="50% DE RÉDUCTION"
              backgroundColor={Colors.primary.main}
              textColor={Colors.primary.contrastText}
            />
            <PromoCard 
              title="Réseaux Sociaux Illimités"
              description="Réseaux sociaux illimités pendant 7 jours"
              discount="NOUVEAU"
              backgroundColor={Colors.secondary.main}
              textColor={Colors.secondary.contrastText}
            />
            <PromoCard 
              title="Forfait Famille"
              description="Partagez des données avec jusqu'à 5 membres de la famille"
              discount="POPULAIRE"
              backgroundColor="#9C27B0"
              textColor="#FFFFFF"
            />
          </ScrollView>
        </View>
        
        {/* Low Balance Alert */}
        <View style={styles.alertContainer}>
          <AlertCircle color={Colors.primary.main} size={24} />
          <Text style={styles.alertText}>Votre solde est faible. Rechargez maintenant pour rester connecté !</Text>
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
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.round,
    padding: Layout.spacing.xs,
    marginVertical: Layout.spacing.lg,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: Layout.spacing.sm,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.round,
  },
  activeToggle: {
    backgroundColor: Colors.primary.main,
  },
  toggleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  activeToggleText: {
    color: Colors.primary.contrastText,
  },
  sectionContainer: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  horizontalScrollContent: {
    paddingRight: Layout.spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.sm,
    color: Colors.secondary.main,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.main,
    marginBottom: Layout.spacing.xl,
  },
  alertText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginLeft: Layout.spacing.sm,
    flex: 1,
  },
  
  // Styles pour la carte publicitaire orange et noir (simplifiés)
  adContainer: {
    marginBottom: Layout.spacing.xl,
  },
  adCardContainer: {
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  adCard: {
    padding: Layout.spacing.lg,
    minHeight: 160,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  adBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    alignSelf: 'flex-start',
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs / 2,
    borderRadius: Layout.borderRadius.round,
    marginBottom: Layout.spacing.md,
  },
  adBadgeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xs,
    color: '#FFFFFF',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  adContentContainer: {
    maxWidth: '85%',
  },
  adTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xxl,
    color: '#FFFFFF',
    marginBottom: Layout.spacing.sm,
    textTransform: 'uppercase',
  },
  adDescription: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: '#FFFFFF',
    marginBottom: Layout.spacing.lg,
    opacity: 0.9,
    lineHeight: 20,
  },
  adCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.round,
  },
  adCtaText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.md,
    color: '#FF6B00',
    marginRight: Layout.spacing.xs,
  },
  
  // Styles pour la carte de solde
  balanceCardContainer: {
    marginBottom: Layout.spacing.xl,
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  balanceCard: {
    padding: Layout.spacing.lg,
    minHeight: 140,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  rechargeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.round,
  },
  rechargeButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.sm,
    color: '#FFFFFF',
    marginRight: 4,
  },
  balanceLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Layout.spacing.xs,
  },
  balanceAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xxl * 1.2,
    color: '#FFFFFF',
  },
  balanceCurrency: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.lg,
  },
  balanceFooter: {
    marginTop: Layout.spacing.md,
    alignSelf: 'center',
  },
  balanceFooterText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  // Styles pour cartes de consommation modernisées
  modernCard: {
    width: 180,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    marginRight: Layout.spacing.md,
    backgroundColor: Colors.background.paper,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: Layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRemainingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRemainingText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
  },
  cardTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  usageTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Layout.spacing.md,
  },
  usageValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xl,
    color: Colors.text.primary,
  },
  usageUnit: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  usageTotal: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginLeft: Layout.spacing.xs,
  },
  progressContainer: {
    position: 'relative',
  },
  progressBackground: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: Layout.borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    borderRadius: Layout.borderRadius.round,
  },
  progressIndicator: {
    position: 'absolute',
    top: -4,
    right: 15,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },

  adBackgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.7, // Ajustez l'opacité pour une meilleure lisibilité du texte
  },
  adCard: {
    padding: Layout.spacing.lg,
    minHeight: 180, // Augmenté pour mieux accommoder l'image
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
});
