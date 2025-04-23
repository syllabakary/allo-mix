import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Bell } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showNotification?: boolean;
}

export default function Header({ title, showBack = true, showNotification = false }: HeaderProps) {
  const handleGoBack = () => {
    router.back();
  };
  
  const handleNotification = () => {
    router.push('/(modals)/notifications');
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <ChevronLeft color={Colors.text.primary} size={24} />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.rightContainer}>
        {showNotification && (
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotification}
          >
            <Bell color={Colors.text.primary} size={20} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: Layout.spacing.md,
    backgroundColor: Colors.background.paper,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: Layout.spacing.xs,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.xl,
    color: Colors.text.primary,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  notificationButton: {
    padding: Layout.spacing.xs,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.error.main,
    borderWidth: 1,
    borderColor: Colors.background.paper,
  },
});