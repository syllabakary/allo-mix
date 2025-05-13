import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Search, Filter } from 'lucide-react-native';
import Header from '@/components/common/Header';
import PackageCard from '@/components/packages/PackageCard';
import FilterChip from '@/components/packages/FilterChip';
import Colors from '@/constants/Colors';
import FontSizes from '@/constants/FontSizes';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40; // Une carte par ligne

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
}

const PACKAGES: Package[] = [
  // ORANGE CI
  {
    id: '1',
    name: 'Internet 24h',
    operator: 'Orange',
    data: '1.5Go',
    validity: '24h',
    price: 500,
    description: '1,5Go + 100Mo la nuit',
    popular: true,
    type: 'Internet',
    category: 'internet'
  },
  {
    id: '2',
    name: 'Appels Illimités',
    operator: 'Orange',
    data: '200min',
    validity: '7 jours',
    price: 1000,
    description: 'Vers Orange + 50min autres réseaux',
    popular: false,
    type: 'Appels',
    category: 'appels'
  },

  // MTN CI
  {
    id: '3',
    name: 'Internet 7J',
    operator: 'MTN',
    data: '3Go',
    validity: '7 jours',
    price: 1500,
    description: '3Go internet',
    popular: true,
    type: 'Internet',
    category: 'internet'
  },
  {
    id: '4',
    name: 'Forfait Appels',
    operator: 'MTN',
    data: '100min',
    validity: '3 jours',
    price: 500,
    description: '100 min tous réseaux',
    popular: false,
    type: 'Appels',
    category: 'appels'
  },

  // MOOV CI
  {
    id: '5',
    name: 'Internet Nuit',
    operator: 'Moov',
    data: '2Go',
    validity: 'Nuit',
    price: 200,
    description: 'Valable 00h-6h',
    popular: false,
    type: 'Internet',
    category: 'internet'
  },
  {
    id: '6',
    name: 'Appels Moov',
    operator: 'Moov',
    data: 'Illimité',
    validity: '7 jours',
    price: 1500,
    description: 'Appels illimités Moov',
    popular: true,
    type: 'Appels',
    category: 'appels'
  },

  // Forfaits combinés
  {
    id: '7',
    name: 'Tout-en-un',
    operator: 'Orange',
    data: '5Go + 300min',
    validity: '30 jours',
    price: 10000,
    description: 'Internet + Appels + SMS',
    popular: true,
    type: 'Mixte',
    category: 'mixte'
  },
  {
    id: '8',
    name: 'Famille',
    operator: 'MTN',
    data: '50Go',
    validity: '30 jours',
    price: 20000,
    description: 'Partageable 5 lignes',
    popular: true,
    type: 'Mixte',
    category: 'mixte'
  }
];

const formatPrice = (price: number): string => {
  return `${price.toLocaleString('fr-FR')} F CFA`;
};

export default function PackagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOperator, setActiveOperator] = useState('Tous');
  const [activeCategory, setActiveCategory] = useState('Tous');
  
  const operators = ['Tous', 'Orange', 'MTN', 'Moov'];
  const categories = ['Tous', 'internet', 'appels', 'mixte'];

  const filteredPackages = useMemo(() => PACKAGES.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
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
      pathname: '/package-detail',
      params: { id: packageId }
    });
  };

  const renderCategorySection = (category: string) => {
    const packages = packagesByCategory[category];
    if (!packages?.length) return null;

    return (
      <View key={category} style={styles.categoryBlock}>
        <Text style={styles.categoryHeader}>
          {category === 'internet' ? 'Forfaits Internet' :
           category === 'appels' ? 'Forfaits Appels' : 
           'Forfaits Combinés'}
        </Text>
        
        <View style={styles.packagesList}>
          {packages.map(pkg => (
            <PackageCard
              key={pkg.id}
              packageData={{
                ...pkg,
                formattedPrice: formatPrice(pkg.price)
              }}
              featured={pkg.popular}
              onPress={() => selectPackage(pkg.id)}
              style={styles.packageItem}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Forfaits" showBack={false} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <Search color={Colors.grey[500]} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un forfait..."
            placeholderTextColor={Colors.grey[500]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter color={Colors.grey[700]} size={20} />
          </TouchableOpacity>
        </View>
        
        {/* Filtres */}
        <View style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Opérateur</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
            <Text style={styles.filterLabel}>Catégorie</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((category) => (
                <FilterChip
                  key={category}
                  label={{
                    'internet': 'Internet',
                    'appels': 'Appels',
                    'mixte': 'Combinés',
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
            <Text style={styles.emptyStateText}>Aucun forfait trouvé</Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setActiveOperator('Tous');
                setActiveCategory('Tous');
                setSearchQuery('');
              }}
            >
              <Text style={styles.resetButtonText}>Réinitialiser les filtres</Text>
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
    backgroundColor: Colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.paper,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginVertical: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.md,
    marginLeft: 10,
    color: Colors.text.primary,
  },
  filterButton: {
    padding: 8,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  categoriesContainer: {
    marginTop: 10,
  },
  categoryBlock: {
    marginBottom: 25,
  },
  categoryHeader: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.primary.main,
    marginBottom: 12,
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.main,
  },
  packagesList: {
    backgroundColor: Colors.background.paper,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
  },
  packageItem: {
    marginBottom: 15,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colors.background.paper,
    borderRadius: 16,
    marginTop: 20,
  },
  emptyStateText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 12,
  },
  resetButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  resetButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
});