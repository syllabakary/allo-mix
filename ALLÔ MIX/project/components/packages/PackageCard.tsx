import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Tag } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

interface PackageData {
  id: string;
  name: string;
  operator: string;
  data: string;
  validity: string;
  price: number;
  description: string;
  popular: boolean;
}

interface PackageCardProps {
  packageData: PackageData;
  featured: boolean;
  onPress: () => void;
}

export default function PackageCard({ packageData, featured, onPress }: PackageCardProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        featured && styles.featuredContainer
      ]}
      onPress={onPress}
    >
      {packageData.popular && (
        <View style={styles.popularTag}>
          <Tag color={Colors.primary.main} size={14} />
          <Text style={styles.popularText}>Populaire</Text>
        </View>
      )}
      
      <View style={styles.operatorContainer}>
        <Text style={styles.operator}>{packageData.operator}</Text>
      </View>
      
      <Text style={styles.name}>{packageData.name}</Text>
      
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailValue}>{packageData.data}</Text>
          <Text style={styles.detailLabel}>Internet</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailValue}>{packageData.validity}</Text>
          <Text style={styles.detailLabel}>Validité</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.price}>{packageData.price.toFixed(2)} F CFA</Text>
        <View style={styles.viewButton}>
          <Text style={styles.viewButtonText}>Voir</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    position: 'relative',
  },
  featuredContainer: {
    width: 220,
    marginRight: Layout.spacing.md,
  },
  popularTag: {
    position: 'absolute',
    top: Layout.spacing.md,
    right: Layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.sm,
    color: Colors.primary.main,
    marginLeft: Layout.spacing.xs,
  },
  operatorContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.background.dark,
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
    marginBottom: Layout.spacing.sm,
  },
  operator: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  detailItem: {
    marginRight: Layout.spacing.lg,
  },
  detailValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  detailLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.lg,
    color: Colors.primary.main,
  },
  viewButton: {
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.md,
    backgroundColor: Colors.primary.light,
    borderRadius: Layout.borderRadius.sm,
  },
  viewButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.sm,
    color: Colors.primary.main,
  },
});