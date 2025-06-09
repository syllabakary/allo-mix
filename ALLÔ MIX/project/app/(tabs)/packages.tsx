import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Search, Filter, Zap, Phone, Wifi, Clock } from 'lucide-react-native';
import Header from '@/components/common/Header';
import PackageCard from '@/components/packages/PackageCard';
import FilterChip from '@/components/packages/FilterChip';
import Colors from '@/constants/Colors';
import FontSizes from '@/constants/FontSizes';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const isTablet = width > 768;
const CARD_WIDTH = isTablet ? (width - 60) / 2 : width - 40;

interface Package {
  id: string;
  name: string;
  operator: string;
  data: string;
  validity: string;
  price: number;
  description: string;
  popular: boolean;
  type: string;
  category: 'internet' | 'appels' | 'mixte';
  bonus?: string;
  color: string;
}

const PACKAGES: Package[] = [
  // ORANGE CI - Forfaits réels
  {
    id: '1',
    name: 'Orange Internet 24h',
    operator: 'Orange',
    data: '1.5Go',
    validity: '24h',
    price: 500,
    description: '1,5Go + 100Mo offerts entre 00h-06h',
    popular: true,
    type: 'Internet',
    category: 'internet',
    bonus: '100Mo nuit gratuit',
    color: '#FF6600'
  },
  {
    id: '2',
    name: 'Orange Internet 7J',
    operator: 'Orange',
    data: '3Go',
    validity: '7 jours',
    price: 1500,
    description: '3Go Internet valable 7 jours',
    popular: false,
    type: 'Internet',
    category: 'internet',
    color: '#FF6600'
  },
  {
    id: '3',
    name: 'Orange Internet 30J',
    operator: 'Orange',
    data: '10Go',
    validity: '30 jours',
    price: 5000,
    description: '10Go Internet + Facebook gratuit',
    popular: true,
    type: 'Internet',
    category: 'internet',
    bonus: 'Facebook gratuit',
    color: '#FF6600'
  },
  {
    id: '4',
    name: 'Orange Appels 7J',
    operator: 'Orange',
    data: '200min',
    validity: '7 jours',
    price: 1000,
    description: 'Appels illimités Orange + 50min autres réseaux',
    popular: false,
    type: 'Appels',
    category: 'appels',
    color: '#FF6600'
  },
  {
    id: '5',
    name: 'Orange Mixte',
    operator: 'Orange',
    data: '2Go + 100min',
    validity: '7 jours',
    price: 2000,
    description: '2Go Internet + 100min tous réseaux + SMS illimités',
    popular: true,
    type: 'Mixte',
    category: 'mixte',
    bonus: 'SMS illimités',
    color: '#FF6600'
  },

  // MTN CI - Forfaits réels
  {
    id: '6',
    name: 'MTN Internet 24h',
    operator: 'MTN',
    data: '1Go',
    validity: '24h',
    price: 500,
    description: '1Go Internet + WhatsApp gratuit 24h',
    popular: false,
    type: 'Internet',
    category: 'internet',
    bonus: 'WhatsApp gratuit',
    color: '#FFCC00'
  },
  {
    id: '7',
    name: 'MTN Internet 7J',
    operator: 'MTN',
    data: '3Go',
    validity: '7 jours',
    price: 1500,
    description: '3Go Internet + réseaux sociaux gratuits',
    popular: true,
    type: 'Internet',
    category: 'internet',
    bonus: 'Réseaux sociaux gratuits',
    color: '#FFCC00'
  },
  {
    id: '8',
    name: 'MTN Internet 30J',
    operator: 'MTN',
    data: '12Go',
    validity: '30 jours',
    price: 6000,
    description: '12Go Internet + YouTube gratuit le weekend',
    popular: false,
    type: 'Internet',
    category: 'internet',
    bonus: 'YouTube weekend gratuit',
    color: '#FFCC00'
  },
  {
    id: '9',
    name: 'MTN Appels Illimités',
    operator: 'MTN',
    data: 'Illimité',
    validity: '7 jours',
    price: 1200,
    description: 'Appels illimités MTN + 30min autres réseaux',
    popular: true,
    type: 'Appels',
    category: 'appels',
    color: '#FFCC00'
  },
  {
    id: '10',
    name: 'MTN Combo',
    operator: 'MTN',
    data: '5Go + 150min',
    validity: '30 jours',
    price: 4500,
    description: '5Go Internet + 150min tous réseaux + 100 SMS',
    popular: true,
    type: 'Mixte',
    category: 'mixte',
    bonus: '100 SMS inclus',
    color: '#FFCC00'
  },

  // MOOV CI - Forfaits réels
  {
    id: '11',
    name: 'Moov Internet Nuit',
    operator: 'Moov',
    data: '3Go',
    validity: 'Nuit (00h-06h)',
    price: 300,
    description: '3Go Internet valable de 00h à 06h uniquement',
    popular: false,
    type: 'Internet',
    category: 'internet',
    color: '#0066CC'
  },
  {
    id: '12',
    name: 'Moov Internet 7J',
    operator: 'Moov',
    data: '2.5Go',
    validity: '7 jours',
    price: 1200,
    description: '2,5Go Internet + Facebook et WhatsApp gratuits',
    popular: true,
    type: 'Internet',
    category: 'internet',
    bonus: 'Facebook + WhatsApp gratuits',
    color: '#0066CC'
  },
  {
    id: '13',
    name: 'Moov Internet 30J',
    operator: 'Moov',
    data: '8Go',
    validity: '30 jours',
    price: 4000,
    description: '8Go Internet + applications sociales gratuites',
    popular: false,
    type: 'Internet',
    category: 'internet',
    bonus: 'Apps sociales gratuites',
    color: '#0066CC'
  },
  {
    id: '14',
    name: 'Moov Appels Famille',
    operator: 'Moov',
    data: 'Illimité',
    validity: '7 jours',
    price: 1500,
    description: 'Appels illimités Moov + 3 numéros favoris autres réseaux',
    popular: true,
    type: 'Appels',
    category: 'appels',
    bonus: '3 numéros favoris',
    color: '#0066CC'
  },
  {
    id: '15',
    name: 'Moov Tout-en-Un',
    operator: 'Moov',
    data: '4Go + 120min',
    validity: '30 jours',
    price: 3500,
    description: '4Go Internet + 120min tous réseaux + SMS illimités',
    popular: false,
    type: 'Mixte',
    category: 'mixte',
    bonus: 'SMS illimités',
    color: '#0066CC'
  },

  // Forfaits spéciaux weekend et promotions
  {
    id: '16',
    name: 'Weekend Orange',
    operator: 'Orange',
    data: '5Go',
    validity: 'Weekend (48h)',
    price: 1000,
    description: 'Forfait spécial weekend - 5Go pour 48h',
    popular: true,
    type: 'Internet',
    category: 'internet',
    bonus: 'Spécial weekend',
    color: '#FF6600'
  },
  {
    id: '17',
    name: 'MTN Étudiant',
    operator: 'MTN',
    data: '15Go',
    validity: '30 jours',
    price: 5000,
    description: 'Forfait étudiant - 15Go + plateformes éducatives gratuites',
    popular: true,
    type: 'Internet',
    category: 'internet',
    bonus: 'Plateformes éducatives gratuites',
    color: '#FFCC00'
  },
  {
    id: '18',
    name: 'Moov Business',
    operator: 'Moov',
    data: '20Go + 300min',
    validity: '30 jours',
    price: 8000,
    description: 'Forfait professionnel - 20Go + 300min + email professionnel',
    popular: false,
    type: 'Mixte',
    category: 'mixte',
    bonus: 'Email professionnel',
    color: '#0066CC'
  }
];

const formatPrice = (price: number): string => {
  return `${price.toLocaleString('fr-FR')} FCFA`;
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'internet':
      return <Wifi size={16} color={Colors.primary.main} />;
    case 'appels':
      return <Phone size={16} color={Colors.primary.main} />;
    case 'mixte':
      return <Zap size={16} color={Colors.primary.main} />;
    default:
      return null;
  }
};

export default function PackagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOperator, setActiveOperator] = useState('Tous');
  const [activeCategory, setActiveCategory] = useState('Tous');
  
  const operators = ['Tous', 'Orange', 'MTN', 'Moov'];
  const categories = ['Tous', 'internet', 'appels', 'mixte'];

  const filteredPackages = useMemo(() => PACKAGES.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.operator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOperator = activeOperator === 'Tous' || pkg.operator === activeOperator;
    const matchesCategory = activeCategory === 'Tous' || pkg.category === activeCategory;
    
    return matchesSearch && matchesOperator && matchesCategory;
  }), [searchQuery, activeOperator, activeCategory]);

  const packagesByCategory = useMemo(() => {
    const result: Record<string, Package[]> = {};
    categories.forEach(cat => {
      if (cat !== 'Tous') {
        result[cat] = filteredPackages.filter(pkg => pkg.category === cat);
      }
    });
    return result;
  }, [filteredPackages]);

  const selectPackage = (packageId: string) => {
    router.push({
      pathname: '/(modals)/package-detail',
      params: { id: packageId }
    });
  };

  const renderPackageCard = (pkg: Package) => (
    <TouchableOpacity
      key={pkg.id}
      style={[
        styles.compactCard,
        { width: isTablet ? (width - 80) / 2 : width - 40 },
        pkg.popular && styles.popularCard
      ]}
      onPress={() => selectPackage(pkg.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.operatorBadge, { backgroundColor: pkg.color }]}>
          <Text style={styles.operatorText}>{pkg.operator}</Text>
        </View>
        {pkg.popular && (
          <View style={styles.popularTag}>
            <Text style={styles.popularText}>🔥</Text>
          </View>
        )}
      </View>

      <Text style={styles.packageName} numberOfLines={1}>{pkg.name}</Text>
      
      <View style={styles.mainInfo}>
        <Text style={[styles.dataText, { color: pkg.color }]}>{pkg.data}</Text>
        <Text style={[styles.priceText, { color: pkg.color }]}>
          {formatPrice(pkg.price)}
        </Text>
      </View>

      <View style={styles.metaInfo}>
        <Text style={styles.validityText}>⏱️ {pkg.validity}</Text>
        <Text style={styles.categoryText}>
          {pkg.category === 'internet' ? '🌐' : 
           pkg.category === 'appels' ? '📞' : '⚡'} {pkg.type}
        </Text>
      </View>

      <Text style={styles.descriptionText} numberOfLines={2}>
        {pkg.description}
      </Text>
      
      {pkg.bonus && (
        <View style={[styles.bonusTag, { backgroundColor: `${pkg.color}20` }]}>
          <Text style={[styles.bonusText, { color: pkg.color }]} numberOfLines={1}>
            🎁 {pkg.bonus}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderCategorySection = (category: string) => {
    const packages = packagesByCategory[category];
    if (!packages?.length) return null;

    const categoryConfig = {
      internet: { title: 'Forfaits Internet', icon: '🌐', color: '#4CAF50' },
      appels: { title: 'Forfaits Appels', icon: '📞', color: '#2196F3' },
      mixte: { title: 'Forfaits Combinés', icon: '⚡', color: '#FF9800' }
    };

    const config = categoryConfig[category as keyof typeof categoryConfig];

    return (
      <View key={category} style={styles.categoryBlock}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryIcon}>{config.icon}</Text>
          <Text style={[styles.categoryTitle, { color: config.color }]}>
            {config.title}
          </Text>
          <View style={[styles.categoryLine, { backgroundColor: config.color }]} />
        </View>
        
        <View style={[styles.packagesList, isTablet && styles.packagesGrid]}>
          {packages.map(renderPackageCard)}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Forfaits Mobiles CI" showBack={false} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Barre de recherche améliorée */}
        <View style={styles.searchContainer}>
          <Search color={Colors.primary.main} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un forfait, opérateur..."
            placeholderTextColor={Colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Statistiques rapides */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{PACKAGES.length}</Text>
            <Text style={styles.statLabel}>Forfaits</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Opérateurs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredPackages.length}</Text>
            <Text style={styles.statLabel}>Résultats</Text>
          </View>
        </View>
        
        {/* Filtres améliorés */}
        <View style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>📡 Opérateur</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {operators.map((operator) => (
                <FilterChip
                  key={operator}
                  label={operator}
                  active={activeOperator === operator}
                  onPress={() => setActiveOperator(operator)}
                />
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>📋 Type de forfait</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {categories.map((category) => (
                <FilterChip
                  key={category}
                  label={{
                    'internet': '🌐 Internet',
                    'appels': '📞 Appels',
                    'mixte': '⚡ Combinés',
                    'Tous': 'Tous'
                  }[category] || category}
                  active={activeCategory === category}
                  onPress={() => setActiveCategory(category)}
                />
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Affichage des catégories */}
        <View style={styles.categoriesContainer}>
          {['internet', 'appels', 'mixte'].map(renderCategorySection)}
        </View>

        {!filteredPackages.length && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>😔</Text>
            <Text style={styles.emptyStateTitle}>Aucun forfait trouvé</Text>
            <Text style={styles.emptyStateText}>
              Essayez de modifier vos critères de recherche
            </Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setActiveOperator('Tous');
                setActiveCategory('Tous');
                setSearchQuery('');
              }}
            >
              <Text style={styles.resetButtonText}>🔄 Réinitialiser</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginVertical: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginLeft: 12,
    color: Colors.text.primary,
  },
  clearSearch: {
    color: Colors.text.secondary,
    fontSize: 18,
    fontWeight: 'bold',
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: Colors.primary.main,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  filtersContainer: {
    marginBottom: 24,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  filterScroll: {
    marginHorizontal: -4,
  },
  categoriesContainer: {
    gap: 32,
  },
  categoryBlock: {
    marginBottom: 25,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  categoryTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    flex: 1,
  },
  categoryLine: {
    height: 3,
    width: 30,
    borderRadius: 2,
  },
  packagesList: {
    backgroundColor: Colors.background.paper,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  packagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    padding: 0,
  },
  compactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  popularCard: {
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  operatorBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  operatorText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  popularTag: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularText: {
    fontSize: 12,
  },
  packageName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dataText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
  priceText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  validityText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.text.secondary,
  },
  categoryText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.text.secondary,
  },
  descriptionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  bonusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  bonusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    textAlign: 'center',
  },
  packageItem: {
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 32,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  resetButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});