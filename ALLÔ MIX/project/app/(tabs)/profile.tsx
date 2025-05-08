import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { User, CreditCard, Gift, Settings, MessageCircle, LogOut, ChevronRight, Share2 } from 'lucide-react-native';
import Header from '@/components/common/Header';
import MenuOption from '@/components/profile/MenuOption';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';
import { router } from 'expo-router';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Header title="Profil" showBack={false} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' }} 
              style={styles.profileImage} 
            />
          </View>
          
          <Text style={styles.profileName}>Sarah Johnson</Text>
          <Text style={styles.profilePhone}>+1 234 567 8901</Text>
          
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Modifier le profil</Text>
          </TouchableOpacity>
        </View>
        
        {/* Referral Card */}
        <View style={styles.referralCard}>
          <View style={styles.referralContent}>
            <View>
              <Text style={styles.referralTitle}>Inviter des amis</Text>
              <Text style={styles.referralDescription}>
                Partagez et gagnez 3 000 F CFA pour chaque ami qui s'inscrit !
              </Text>
            </View>
            
            <View style={styles.referralImageContainer}>
              <Gift color={Colors.primary.main} size={40} />
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.referralButton}
            onPress={() => router.push('/(modals)/referral')}
          >
            <Text style={styles.referralButtonText}>Partager le lien de parrainage</Text>
            <Share2 color={Colors.background.paper} size={16} />
          </TouchableOpacity>
        </View>
        
        {/* Menu Section: Account */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Compte</Text>
          
          <View style={styles.menuCard}>
            <MenuOption 
              icon={<User color={Colors.secondary.main} size={20} />}
              title="Informations personnelles"
              onPress={() => {}}
            />
            <MenuOption 
              icon={<CreditCard color={Colors.secondary.main} size={20} />}
              title="Méthodes de paiement"
              onPress={() => router.push('/(modals)/payment-methods')}
            />
            <MenuOption 
              icon={<Gift color={Colors.secondary.main} size={20} />}
              title="Récompenses et parrainages"
              onPress={() => router.push('/(modals)/referral')}
              showBadge
              badgeText="3"
            />
          </View>
        </View>
        
        {/* Menu Section: Support */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Assistance</Text>
          
          <View style={styles.menuCard}>
            <MenuOption 
              icon={<MessageCircle color={Colors.secondary.main} size={20} />}
              title="Centre d'aide"
              onPress={() => router.push('/(modals)/help')}
            />
            <MenuOption 
              icon={<Settings color={Colors.secondary.main} size={20} />}
              title="Paramètres"
              onPress={() => {}}
            />
          </View>
        </View>
        
        {/* Sign Out Button */}
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={() => router.replace('/(onboarding)')}
        >
          <LogOut color={Colors.error.main} size={20} />
          <Text style={styles.signOutText}>Se déconnecter</Text>
        </TouchableOpacity>
        
        {/* App Version */}
        <Text style={styles.versionText}>TeleRecharge v1.0.0</Text>
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
  profileSection: {
    alignItems: 'center',
    marginVertical: Layout.spacing.lg,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: Colors.grey[200],
    marginBottom: Layout.spacing.md,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.xl,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  profilePhone: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.md,
  },
  editButton: {
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  editButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.primary.main,
  },
  referralCard: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.xl,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  referralContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  referralTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  referralDescription: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    maxWidth: '80%',
  },
  referralImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  referralButton: {
    backgroundColor: Colors.primary.main,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  referralButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.md,
    color: Colors.primary.contrastText,
    marginRight: Layout.spacing.sm,
  },
  menuSection: {
    marginBottom: Layout.spacing.xl,
  },
  menuSectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  menuCard: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    overflow: 'hidden',
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.error.main,
  },
  signOutText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.error.main,
    marginLeft: Layout.spacing.sm,
  },
  versionText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
});