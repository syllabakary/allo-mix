import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

interface MenuOptionProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  showBadge?: boolean;
  badgeText?: string;
}

export default function MenuOption({ icon, title, onPress, showBadge = false, badgeText }: MenuOptionProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.rightContent}>
        {showBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}
        <ChevronRight color={Colors.grey[400]} size={20} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: Layout.spacing.md,
  },
  title: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: Colors.primary.main,
    borderRadius: Layout.borderRadius.round,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    marginRight: Layout.spacing.sm,
  },
  badgeText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.xs,
    color: Colors.common.white,
  },
});