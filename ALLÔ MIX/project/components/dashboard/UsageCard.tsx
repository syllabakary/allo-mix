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
  // Calcul du pourcentage
  const percentage = Math.min(100, (used / total) * 100);
  
  // Formatage des valeurs numériques
  const formatValue = (value: number) => {
    return value.toLocaleString('fr-FR');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={[styles.iconContainer, { backgroundColor: Colors.primary.light + '20' }]}>
          {icon}
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.usageContainer}>
        <Text style={styles.usageText}>
          <Text style={styles.usedText}>{formatValue(used)}</Text>
          <Text style={styles.separator}> / </Text>
          <Text>{formatValue(total)}</Text>
          <Text> {unit}</Text>
        </Text>
        
        <Text style={styles.daysText}>
          {daysLeft} {daysLeft > 1 ? 'jours restants' : 'jour restant'}
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${percentage}%` },
              percentage > 80 && styles.progressWarning
            ]}
          />
        </View>
        <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.md,
    marginRight: Layout.spacing.md,
    width: 180,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.sm,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  usageContainer: {
    marginBottom: Layout.spacing.sm,
  },
  usageText: {
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  usedText: {
    fontFamily: 'Poppins-SemiBold',
    color: Colors.primary.main,
  },
  separator: {
    color: Colors.grey[400],
  },
  daysText: {
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginTop: Layout.spacing.xs,
  },
  progressBarContainer: {
    marginTop: Layout.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.grey[200],
    borderRadius: Layout.borderRadius.round,
    overflow: 'hidden',
    marginRight: Layout.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary.main,
    borderRadius: Layout.borderRadius.round,
  },
  progressWarning: {
    backgroundColor: Colors.error.main,
  },
  percentageText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    minWidth: 30,
    textAlign: 'right',
  },
});