import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export default function FilterChip({ label, active, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        active && styles.activeContainer
      ]}
      onPress={onPress}
    >
      <Text 
        style={[
          styles.label,
          active && styles.activeLabel
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.background.paper,
    marginRight: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.grey[200],
  },
  activeContainer: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  label: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  activeLabel: {
    color: Colors.primary.contrastText,
  },
});