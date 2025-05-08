import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

interface UsageCardProps {
  icon: ReactNode;
  title: string;
  used: number;
  total: number;
  unit: string;
  daysLeft: number;
}

export default function UsageCard({ icon, title, used, total, unit, daysLeft }: UsageCardProps) {
  // Calculate percentage
  const percentage = (used / total) * 100;
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.usageContainer}>
        <Text style={styles.usageText}>
          <Text style={styles.usedText}>{used}</Text>
          <Text style={styles.separator}> / </Text>
          <Text>{total}</Text>
          <Text> {unit}</Text>
        </Text>
        
        <Text style={styles.daysText}>
          {daysLeft} days left
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `F CFA{percentage}%` },
              percentage > 80 && styles.progressWarning
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginRight: Layout.spacing.md,
    width: 160,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  iconContainer: {
    marginRight: Layout.spacing.sm,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  usageContainer: {
    marginBottom: Layout.spacing.sm,
  },
  usageText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  usedText: {
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text.primary,
  },
  separator: {
    color: Colors.grey[400],
  },
  daysText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginTop: Layout.spacing.xs,
  },
  progressBarContainer: {
    marginTop: Layout.spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.grey[200],
    borderRadius: Layout.borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary.main,
    borderRadius: Layout.borderRadius.round,
  },
  progressWarning: {
    backgroundColor: Colors.error.main,
  },
});