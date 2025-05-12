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
  isLastItem?: boolean;
}

export default function MenuOption({ 
  icon, 
  title, 
  onPress, 
  showBadge = false, 
  badgeText,
  isLastItem = false 
}: MenuOptionProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isLastItem && styles.lastItem
      ]}
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
    backgroundColor: Colors.background.paper,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: Layout.spacing.md,
    width: 24,
    alignItems: 'center',
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
    borderRadius: 12,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 2,
    marginRight: Layout.spacing.sm,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: 'Roboto-Bold',
    fontSize: FontSizes.xs,
    color: Colors.common.white,
    includeFontPadding: false,
  },
});