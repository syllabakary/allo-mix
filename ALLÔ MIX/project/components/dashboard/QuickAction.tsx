import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

interface QuickActionProps {
  icon: ReactNode;
  title: string;
  color: string;
  onPress: () => void;
}

export default function QuickAction({ icon, title, color, onPress }: QuickActionProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, { width: '48%' }]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Layout.spacing.md,
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.md,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.sm,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    textAlign: 'center',
  },
});