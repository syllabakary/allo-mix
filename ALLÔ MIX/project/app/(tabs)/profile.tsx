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
      <Header title="Mon Profil" showBack={false} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête du profil */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' }} 
              style={styles.profileImage} 
            />
          </View>
          
          <Text style={styles.profileName}>Jean Dupont</Text>
          <Text style={styles.profilePhone}>+225 07 07 07 07 07</Text>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push('/(modals)/edit-profile')}
          >
            <Text style={styles.editButtonText}>Modifier mon profil</Text>
            <ChevronRight color={Colors.primary.main} size={16} />
          </TouchableOpacity>
        </View>
        
        {/* Carte de parrainage */}
        <View style={styles.referralCard}>
          <View style={styles.referralContent}>
            <View>
              <Text style={styles.referralTitle}>Parrainez vos amis</Text>
              <Text style={styles.referralDescription}>
                Gagnez 3 000 F CFA pour chaque ami qui rejoint Allô Mix !
              </Text>
            </View>
            
            <View style={styles.referralIconContainer}>
              <Gift color={Colors.primary.main} size={40} />
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.referralButton}
            onPress={() => router.push('/(modals)/referral')}
          >
            <Text style={styles.referralButtonText}>Partager mon lien</Text>
            <Share2 color={Colors.common.white} size={16} />
          </TouchableOpacity>
        </View>
        
        {/* Section : Mon compte */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Mon compte</Text>
          
          <View style={styles.menuCard}>
            <MenuOption 
              icon={<User color={Colors.primary.main} size={20} />}
              title="Informations personnelles"
              onPress={() => router.push('/(modals)/personal-info')}
            />
            <MenuOption 
              icon={<CreditCard color={Colors.primary.main} size={20} />}
              title="Moyens de paiement"
              onPress={() => router.push('/(modals)/payment-methods')}
            />
            <MenuOption 
              icon={<Gift color={Colors.primary.main} size={20} />}
              title="Mes récompenses"
              onPress={() => router.push('/(modals)/rewards')}
              showBadge
              badgeText="3"
            />
          </View>
        </View>
        
        {/* Section : Assistance */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Assistance</Text>
          
          <View style={styles.menuCard}>
            <MenuOption 
              icon={<MessageCircle color={Colors.primary.main} size={20} />}
              title="Centre d'aide"
              onPress={() => router.push('/(modals)/help-center')}
            />
            <MenuOption 
              icon={<Settings color={Colors.primary.main} size={20} />}
              title="Paramètres"
              onPress={() => router.push('/(modals)/settings')}
            />
          </View>
        </View>
        
        {/* Bouton de déconnexion */}
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={() => router.replace('/(auth)/login')}
        >
          <LogOut color={Colors.error.main} size={20} />
          <Text style={styles.signOutText}>Déconnexion</Text>
        </TouchableOpacity>
        
        {/* Version de l'application */}
        <Text style={styles.versionText}>Allô Mix v1.0.0</Text>
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
    marginVertical: Layout.spacing.xl,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.grey[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary.light,
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
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.md,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    backgroundColor: Colors.primary.light + '20',
    borderRadius: Layout.borderRadius.md,
  },
  editButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.primary.main,
    marginRight: Layout.spacing.xs,
  },
  referralCard: {
    backgroundColor: Colors.primary.light + '10',
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
    borderWidth: 1,
    borderColor: Colors.primary.light + '30',
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
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    maxWidth: '75%',
  },
  referralIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary.light + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  referralButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.main,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
  },
  referralButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.md,
    color: Colors.common.white,
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
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error.light + '20',
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.xl,
    borderWidth: 1,
    borderColor: Colors.error.light,
  },
  signOutText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.error.main,
    marginLeft: Layout.spacing.sm,
  },
  versionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});