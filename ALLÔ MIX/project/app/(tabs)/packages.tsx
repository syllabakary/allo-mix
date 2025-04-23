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

// Sample data for packages
const PACKAGES = [
  {
    id: '1',
    name: 'Daily Data',
    operator: 'Orange',
    data: '1GB',
    validity: '1 day',
    price: 1.99,
    description: 'Fast internet for your daily needs',
    popular: true,
  },
  {
    id: '2',
    name: 'Weekly Social',
    operator: 'MTN',
    data: '3GB',
    validity: '7 days',
    price: 4.99,
    description: 'Unlimited social media access',
    popular: false,
  },
  {
    id: '3',
    name: 'Monthly Max',
    operator: 'Orange',
    data: '20GB',
    validity: '30 days',
    price: 15.99,
    description: 'Our best value monthly plan',
    popular: true,
  },
  {
    id: '4',
    name: 'Unlimited Calls',
    operator: 'Moov',
    data: '500MB',
    validity: '30 days',
    price: 9.99,
    description: 'Unlimited calls to all networks',
    popular: false,
  },
  {
    id: '5',
    name: 'Family Share',
    operator: 'MTN',
    data: '50GB',
    validity: '30 days',
    price: 29.99,
    description: 'Share data with up to 5 family members',
    popular: true,
  },
  {
    id: '6',
    name: 'Weekend Special',
    operator: 'Moov',
    data: '5GB',
    validity: '2 days',
    price: 2.99,
    description: 'Extra data for your weekend',
    popular: false,
  },
];

export default function PackagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOperator, setActiveOperator] = useState('All');
  const [activeType, setActiveType] = useState('All');
  
  const operators = ['All', 'Orange', 'MTN', 'Moov'];
  const packageTypes = ['All', 'Data', 'Voice', 'SMS', 'Combo'];
  
  // Filter packages based on search, operator and type
  const filteredPackages = PACKAGES.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOperator = activeOperator === 'All' || pkg.operator === activeOperator;
    
    // Note: In a real app, you'd have a proper type field to filter on
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
      <Header title="Packages" showBack={false} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search color={Colors.grey[500]} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search packages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter color={Colors.grey[700]} size={20} />
          </TouchableOpacity>
        </View>
        
        {/* Operator Filters */}
        <View style={styles.filtersSection}>
          <Text style={styles.filterLabel}>Operator</Text>
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
        
        {/* Package Type Filters */}
        <View style={styles.filtersSection}>
          <Text style={styles.filterLabel}>Package Type</Text>
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
        
        {/* Featured Packages */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Packages</Text>
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
        
        {/* All Packages */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>All Packages</Text>
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
              <Text style={styles.emptyStateText}>No packages found matching your criteria.</Text>
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