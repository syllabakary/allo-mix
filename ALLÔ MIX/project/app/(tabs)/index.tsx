import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing, Dimensions, Image } from 'react-native';
import { router } from 'expo-router';
import { Phone, Zap, MessageSquare, Gift, ChevronRight, AlertCircle, ExternalLink, Sparkles, TrendingUp, Clock, ArrowUpDown, Wallet, User, Briefcase } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Header from '@/components/common/Header';
import QuickAction from '@/components/dashboard/QuickAction';
import RechargeCard from '@/components/dashboard/RechargeCard';
import PromoCard from '@/components/dashboard/PromoCard';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

const { width } = Dimensions.get('window');

// Composant Card Publicitaire avec animation améliorée
const AdCard = ({ title, description, cta, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Animation sophistiquée
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
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
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
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <LinearGradient
          colors={['#FF6B00', '#FFC107', '#FF9800']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.adCard}
        >
          {/* Éléments décoratifs */}
          <View style={styles.adDecorCircle1} />
          <View style={styles.adDecorCircle2} />
          <View style={styles.adDecorCircle3} />
          
          {/* Badge promo */}
          <View style={styles.adBadge}>
            <Sparkles color="#FFFFFF" size={14} />
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

// Composant amélioré pour afficher le solde actuel
const BalanceCard = ({ balance, currency, onPress }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
  }, []);

  return (
    <TouchableOpacity 
      style={styles.balanceCardContainer} 
      activeOpacity={0.9}
      onPress={onPress}
    >
      <LinearGradient
        colors={['#0C0C0CFF', '#00000084E2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        {/* Éléments décoratifs */}
        <View style={styles.balanceDecorPattern1} />
        <View style={styles.balanceDecorPattern2} />
        <View style={styles.balanceDecorPattern3} />
        
        <View style={styles.balanceHeader}>
          <Animated.View 
            style={[
              styles.balanceIconContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <Wallet color="#FFFFFF" size={24} />
          </Animated.View>
          <TouchableOpacity 
            style={styles.rechargeButton} 
            onPress={onPress}
          >
            <Text style={styles.rechargeButtonText}>Recharger</Text>
            <ChevronRight color="#FFFFFF" size={14} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.balanceLabel}>Solde Disponible</Text>
        <Text style={styles.balanceAmount}>{balance.toLocaleString()} <Text style={styles.balanceCurrency}>{currency}</Text></Text>
        
        <View style={styles.balanceFooter}>
          <View style={styles.balanceFooterIcon}>
            <ChevronRight color="#FFFFFF" size={14} />
          </View>
          <Text style={styles.balanceFooterText}>Appuyez pour les détails</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Composant ultra-moderne pour les cartes de consommation
const EnhancedUsageCard = ({ icon, title, used, total, unit, daysLeft, color, shadowColor }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  
  const percentUsed = (used / total) * 100;
  const percentLeft = 100 - percentUsed;
  
  useEffect(() => {
    // Animation de progression
    Animated.timing(progressAnim, {
      toValue: percentUsed / 100,
      duration: 1300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
    
    // Animation de rotation pour l'icône
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
    
    // Animation de rebond pour attirer l'attention
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.02,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1500,
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
  
  return (
    <Animated.View 
      style={[
        styles.enhancedCard, 
        { 
          transform: [{ scale: bounceAnim }],
          shadowColor: shadowColor
        }
      ]}
    >
      <View style={styles.cardHeader}>
        <Animated.View 
          style={[
            styles.cardIconContainer, 
            { 
              backgroundColor: color + '20',
              transform: [{ rotate: rotateInterpolate }]
            }
          ]}
        >
          {icon}
        </Animated.View>
        <View style={styles.cardRemainingContainer}>
          <Clock size={14} color="#6E7191" style={{ marginRight: 4 }} />
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
        
        <View style={styles.progressPercentContainer}>
          <Text style={[styles.progressPercent, { color }]}>{Math.round(percentUsed)}%</Text>
          <Text style={styles.progressPercentLeft}>Reste: {Math.round(percentLeft)}%</Text>
        </View>
      </View>
    </Animated.View>
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
          color={activeTab === 'personal' ? Colors.primary.main : Colors.text.secondary} 
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
          color={activeTab === 'business' ? Colors.primary.main : Colors.text.secondary} 
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
      <Header title="TéléRecharge" showNotification />
      
      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Toggle (Personnel/Professionnel) - Version améliorée */}
        <Animated.View 
          style={[
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <EnhancedTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </Animated.View>
        
        {/* Carte de solde - Version améliorée */}
        <Animated.View 
          style={[
            { transform: [{ translateY: Animated.multiply(slideAnim, 0.9) }] }
          ]}
        >
          <BalanceCard 
            balance={25000}
            currency="F CFA"
            onPress={() => router.push('/(modals)/recharge')}
          />
        </Animated.View>
        
        {/* Carte Publicitaire Dynamique - Version améliorée */}
        <Animated.View 
          style={[
            styles.adContainer,
            { transform: [{ translateY: Animated.multiply(slideAnim, 0.8) }] }
          ]}
        >
          <AdCard 
            title="2X BONUS CRÉDIT"
            description="Rechargez maintenant et doublez votre crédit! Cette offre exclusive expire bientôt."
            cta="Profiter maintenant"
            onPress={() => router.push('/(modals)/specialoffer')}
          />
        </Animated.View>
        
        {/* Usage Section Ultra-moderne */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderWithIcon}>
            <TrendingUp size={20} color={Colors.primary.main} />
            <Text style={styles.sectionTitle}>Votre Consommation</Text>
          </View>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            decelerationRate="fast"
            snapToInterval={width * 0.65}
          >
            <EnhancedUsageCard 
              icon={<Zap color={Colors.primary.main} size={24} />}
              title="Internet"
              used={3.5}
              total={5}
              unit="Go"
              daysLeft={7}
              color={Colors.primary.main}
              shadowColor={Colors.primary.light}
            />
            <EnhancedUsageCard 
              icon={<Phone color="#FF6B00" size={24} />}
              title="Appels"
              used={35}
              total={100}
              unit="min"
              daysLeft={7}
              color="#FF6B00"
              shadowColor="#FFCC80"
            />
            <EnhancedUsageCard 
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
        
        {/* Quick Actions - Design amélioré */}
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
              style={styles.enhancedAction}
            />
            <QuickAction 
              icon={<Phone color={Colors.common.white} size={24} />}
              title="Appels"
              color="#FF6B00"
              onPress={() => router.push('/(tabs)/packages')}
              style={styles.enhancedAction}
            />
            <QuickAction 
              icon={<MessageSquare color={Colors.common.white} size={24} />}
              title="SMS"
              color="#9C27B0"
              onPress={() => router.push('/(tabs)/packages')}
              style={styles.enhancedAction}
            />
            <QuickAction 
              icon={<Gift color={Colors.common.white} size={24} />}
              title="Cadeaux"
              color="#E91E63"
              onPress={() => router.push('/(modals)/gift')}
              style={styles.enhancedAction}
            />
            <QuickAction 
              icon={<ArrowUpDown color={Colors.common.white} size={24} />}
              title="Transfert"
              color="#4CAF50"
              onPress={() => router.push('/(modals)/transfer')}
              style={styles.enhancedAction}
            />
          </View>
        </View>
        
        {/* Recent Recharges */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderWithIcon}>
              <Clock size={20} color={Colors.primary.main} />
              <Text style={styles.sectionTitle}>Recharges Récentes</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/(tabs)/transactions')}
            >
              <Text style={styles.viewAllText}>Tout voir</Text>
              <ChevronRight color={Colors.primary.main} size={16} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.rechargeCardsContainer}>
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
        </View>
        
        {/* Promotions Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderWithIcon}>
            <Sparkles size={20} color={Colors.primary.main} />
            <Text style={styles.sectionTitle}>Offres Spéciales</Text>
          </View>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            decelerationRate="fast"
            snapToInterval={width * 0.75}
          >
            <PromoCard 
              title="Forfait Weekend"
              description="Obtenez 3Go pour seulement 1000 F CFA ce weekend !"
              discount="50% RÉDUCTION"
              backgroundColor="#FF6B00"
              textColor="#FFFFFF"
            />
            <PromoCard 
              title="Réseaux Sociaux Illimités"
              description="Réseaux sociaux illimités pendant 7 jours"
              discount="NOUVEAU"
              backgroundColor="#8E2DE2"
              textColor="#FFFFFF"
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
        
        {/* Low Balance Alert - Design amélioré */}
        <View style={styles.enhancedAlertContainer}>
          <View style={styles.alertIconContainer}>
            <AlertCircle color="#FFFFFF" size={22} />
          </View>
          <View style={styles.alertTextContainer}>
            <Text style={styles.alertTitle}>Solde Faible</Text>
            <Text style={styles.alertText}>Rechargez maintenant pour rester connecté!</Text>
          </View>
          <TouchableOpacity 
            style={styles.alertButton}
            onPress={() => router.push('/(modals)/recharge')}
          >
            <Text style={styles.alertButtonText}>Recharger</Text>
          </TouchableOpacity>
        </View>
        
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE', // Plus léger pour un look moderne
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl + 10,
  },
  
  // Styles Tabs améliorés
  enhancedTabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.xs,
    marginVertical: Layout.spacing.lg,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
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
    backgroundColor: Colors.primary.main + '15',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
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
    color: Colors.text.primary,
    marginLeft: 8,
  },
  horizontalScrollContent: {
    paddingRight: Layout.spacing.lg,
    paddingBottom: Layout.spacing.sm,
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
    backgroundColor: Colors.primary.main + '10',
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs / 2,
    borderRadius: Layout.borderRadius.lg,
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.sm,
    color: Colors.primary.main,
  },
  
  // Styles pour les actions rapides
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  enhancedAction: {
    width: '18%',
    marginBottom: Layout.spacing.md,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  
  // Styles améliorés pour la carte publicitaire
  adContainer: {
    marginBottom: Layout.spacing.xl,
  },
  adCardContainer: {
    borderRadius: Layout.borderRadius.xl,
    overflow: 'hidden',
    shadowColor: "#FF6B00",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
  },
  adCard: {
    padding: Layout.spacing.lg,
    minHeight: 170,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  adDecorCircle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    top: -50,
    right: -30,
  },
  adDecorCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: -30,
    left: 20,
  },
  adDecorCircle3: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    top: 40,
    right: 60,
  },
  adBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    zIndex: 10,
  },
  adTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xxl,
    color: '#FFFFFF',
    marginBottom: Layout.spacing.sm,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  adDescription: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: '#FFFFFF',
    marginBottom: Layout.spacing.lg,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  adCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.round,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  adCtaText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.md,
    color: '#FF6B00',
    marginRight: Layout.spacing.xs,
  },
  
  // Styles améliorés pour la carte de solde
  balanceCardContainer: {
    marginBottom: Layout.spacing.xl,
    borderRadius: Layout.borderRadius.xl,
    overflow: 'hidden',
    shadowColor: "#4A00E0",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 16,
  },
  balanceCard: {
    padding: Layout.spacing.lg,
    minHeight: 150,
  },
  balanceDecorPattern1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -40,
    right: -20,
  },
  balanceDecorPattern2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: -20,
    left: 40,
  },
  balanceDecorPattern3: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: 50,
    right: 50,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  balanceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: Colors.common.white,
    marginRight: 4,
  },
  balanceLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.md,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: Layout.spacing.xs,
  },
  balanceAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xxl + 4,
    color: Colors.common.white,
    marginBottom: Layout.spacing.md,
  },
  balanceCurrency: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
  },
  balanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceFooterIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.xs,
  },
  balanceFooterText: {
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.sm,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  // Styles ultra-modernes pour les cartes de consommation
  enhancedCard: {
    width: width * 0.65,
    backgroundColor: Colors.common.white,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    marginRight: Layout.spacing.md,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  cardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRemainingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey[100],
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs / 2,
    borderRadius: Layout.borderRadius.round,
  },
  cardRemainingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
  },
  cardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  usageTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Layout.spacing.md,
  },
  usageValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xl,
  },
  usageUnit: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
  },
  usageTotal: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginLeft: Layout.spacing.xs,
  },
  progressContainer: {
    marginBottom: Layout.spacing.xs,
  },
  progressBackground: {
    height: 8,
    backgroundColor: Colors.grey[200],
    borderRadius: Layout.borderRadius.round,
    marginBottom: Layout.spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Layout.borderRadius.round,
  },
  progressPercentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressPercent: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.sm,
  },
  progressPercentLeft: {
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  
  // Styles pour les recharges récentes
  rechargeCardsContainer: {
    marginTop: Layout.spacing.xs,
  },
  
  // Styles améliorés pour l'alerte de solde faible
  enhancedAlertContainer: {
    backgroundColor: Colors.common.white,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.error.main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: Layout.spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error.main,
  },
  alertIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.error.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  alertText: {
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  alertButton: {
    backgroundColor: Colors.error.light,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.round,
  },
  alertButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.sm,
    color: Colors.error.main,
  },
});