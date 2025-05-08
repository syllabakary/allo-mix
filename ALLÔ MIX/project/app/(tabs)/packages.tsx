import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Search, Filter, Tag } from 'lucide-react-native';
import Header from '@/components/common/Header';
import PackageCard from '@/components/packages/PackageCard';
import FilterChip from '@/components/packages/FilterChip';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';
import { router } from 'expo-router';

// Données d'exemple pour les forfaits
const PACKAGES = [
  {
    id: '1',
    name: 'Forfait Journalier',
    operator: 'Orange',
    data: '1Go',
    validity: '1 jour',
    price: 1300,
    description: 'Internet rapide pour vos besoins quotidiens',
    popular: true,
  },
  {
    id: '2',
    name: 'Social Hebdo',
    operator: 'MTN',
    data: '3Go',
    validity: '7 jours',
    price: 3250,
    description: 'Accès illimité aux réseaux sociaux',
    popular: false,
  },
  {
    id: '3',
    name: 'Mensuel Max',
    operator: 'Orange',
    data: '20Go',
    validity: '30 jours',
    price: 10000,
    description: 'Notre meilleur forfait mensuel',
    popular: true,
  },
  {
    id: '4',
    name: 'Appels Illimités',
    operator: 'Moov',
    data: '500Mo',
    validity: '30 jours',
    price: 6500,
    description: 'Appels illimités vers tous les réseaux',
    popular: false,
  },
  {
    id: '5',
    name: 'Forfait Famille',
    operator: 'MTN',
    data: '50Go',
    validity: '30 jours',
    price: 19500,
    description: 'Partagez vos données avec jusqu\'à 5 membres de votre famille',
    popular: true,
  },
  {
    id: '6',
    name: 'Spécial Weekend',
    operator: 'Moov',
    data: '5Go',
    validity: '2 jours',
    price: 1950,
    description: 'Données supplémentaires pour votre weekend',
    popular: false,
  },
];

export default function PackagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOperator, setActiveOperator] = useState('Tous');
  const [activeType, setActiveType] = useState('Tous');
  
  const operators = ['Tous', 'Orange', 'MTN', 'Moov'];
  const packageTypes = ['Tous', 'Internet', 'Appels', 'SMS', 'Mixte'];
  
  // Filtrer les forfaits selon la recherche, l'opérateur et le type
  const filteredPackages = PACKAGES.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOperator = activeOperator === 'Tous' || pkg.operator === activeOperator;
    
    // Note: Dans une application réelle, vous auriez un champ type à filtrer
    return matchesSearch && matchesOperator;
  });
  
  const selectPackage = (packageId: string) => {
    router.push({
      pathname: '/(modals)/package-detail',
      params: { id: packageId }
    });
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
            placeholder="Rechercher des forfaits..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter color={Colors.grey[700]} size={20} />
          </TouchableOpacity>
        </View>
        
        {/* Filtres par opérateur */}
        <View style={styles.filtersSection}>
          <Text style={styles.filterLabel}>Opérateur</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScrollContent}
          >
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
        
        {/* Filtres par type de forfait */}
        <View style={styles.filtersSection}>
          <Text style={styles.filterLabel}>Type de forfait</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScrollContent}
          >
            {packageTypes.map((type) => (
              <FilterChip
                key={type}
                label={type}
                active={activeType === type}
                onPress={() => setActiveType(type)}
              />
            ))}
          </ScrollView>
        </View>
        
        {/* Forfaits en vedette */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Forfaits en vedette</Text>
            <Tag color={Colors.primary.main} size={18} />
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalPackagesContent}
          >
            {filteredPackages
              .filter(pkg => pkg.popular)
              .map(pkg => (
                <PackageCard
                  key={pkg.id}
                  packageData={pkg}
                  featured={true}
                  onPress={() => selectPackage(pkg.id)}
                />
              ))}
          </ScrollView>
        </View>
        
        {/* Tous les forfaits */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Tous les forfaits</Text>
          {filteredPackages.length > 0 ? (
            filteredPackages.map(pkg => (
              <PackageCard
                key={pkg.id}
                packageData={pkg}
                featured={false}
                onPress={() => selectPackage(pkg.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Aucun forfait ne correspond à vos critères.</Text>
            </View>
          )}
        </View>
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
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    marginVertical: Layout.spacing.lg,
    height: 50,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    marginLeft: Layout.spacing.sm,
    height: '100%',
  },
  filterButton: {
    padding: Layout.spacing.sm,
  },
  filtersSection: {
    marginBottom: Layout.spacing.md,
  },
  filterLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  filtersScrollContent: {
    paddingRight: Layout.spacing.lg,
  },
  sectionContainer: {
    marginVertical: Layout.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginRight: Layout.spacing.sm,
  },
  horizontalPackagesContent: {
    paddingRight: Layout.spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.grey[200],
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
});