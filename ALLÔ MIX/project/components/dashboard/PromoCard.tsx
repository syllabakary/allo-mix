import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

interface PromoCardProps {
  title: string;
  description: string;
  discount: string;
  backgroundColor: string;
  textColor: string;
}

export default function PromoCard({ title, description, discount, backgroundColor, textColor }: PromoCardProps) {
  return (
    <View 
      style={[
        styles.container,
        { backgroundColor }
      ]}
    >
      <View style={styles.discountTagContainer}>
        <Text style={[styles.discountText, { color: backgroundColor }]}>
          {discount}
        </Text>
      </View>
      
      <Text style={[styles.title, { color: textColor }]}>
        {title}
      </Text>
      
      <Text style={[styles.description, { color: textColor, opacity: 0.9 }]}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginRight: Layout.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  discountTagContainer: {
    position: 'absolute',
    top: Layout.spacing.md,
    right: Layout.spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: Layout.borderRadius.sm,
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.sm,
  },
  discountText: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.sm,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.lg,
    marginTop: Layout.spacing.xl,
    marginBottom: Layout.spacing.sm,
  },
  description: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
  },
});