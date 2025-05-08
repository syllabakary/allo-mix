import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { router } from 'expo-router';
import { Gift, Share2, Copy, Users, Trophy, ChevronRight } from 'lucide-react-native';
import Header from '@/components/common/Header';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

// Données d'exemple des parrainages
const REFERRALS = [
  {
    id: '1',
    name: 'John Smith',
    date: '2023-05-15',
    status: 'completed',
    reward: 3000
  },
  {
    id: '2',
    name: 'Emma Wilson',
    date: '2023-05-20',
    status: 'completed',
    reward: 3000
  },
  {
    id: '3',
    name: 'Michael Brown',
    date: '2023-06-01',
    status: 'pending',
    reward: 0
  }
];

export default function ReferralScreen() {
  const [copiedCode, setCopiedCode] = useState(false);
  const referralCode = 'SARAH25';
  const earnedAmount = 6000; // 6000 F CFA gagnés par les parrainages
  const remainingToNextReward = 3000; // 3000 F CFA de plus pour atteindre le prochain niveau de récompense
  
  const handleCopyCode = () => {
    // Dans une vraie application, ceci copierait dans le presse-papiers
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };
  
  const handleShare = () => {
    // Dans une vraie application, ceci utiliserait l'API de partage
    console.log('Partage du code de parrainage');
  };

  return (
    <View style={styles.container}>
      <Header title="Programme de Parrainage" showBack />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bannière de Parrainage */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Partagez & Gagnez</Text>
            <Text style={styles.bannerDescription}>
              Invitez vos amis à rejoindre TeleRecharge et gagnez 3000 F CFA pour chaque ami qui s'inscrit et effectue sa première recharge !
            </Text>
          </View>
          
          <View style={styles.bannerImageContainer}>
            <Gift color={Colors.common.white} size={48} />
          </View>
        </View>
        
        {/* Carte du Code de Parrainage */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Votre Code de Parrainage</Text>
          
          <View style={styles.codeContainer}>
            <Text style={styles.code}>{referralCode}</Text>
            
            <TouchableOpacity 
              style={styles.copyButton}
              onPress={handleCopyCode}
            >
              <Copy color={Colors.primary.main} size={20} />
              <Text style={styles.copyButtonText}>
                {copiedCode ? 'Copié !' : 'Copier'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Share2 color={Colors.common.white} size={20} />
            <Text style={styles.shareButtonText}>Partager avec des Amis</Text>
          </TouchableOpacity>
        </View>
        
        {/* Progression des Gains */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Vos Gains</Text>
            <Text style={styles.progressAmount}>{earnedAmount} F CFA</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `F CFA{(earnedAmount / (earnedAmount + remainingToNextReward)) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              Encore {remainingToNextReward} F CFA pour atteindre votre prochaine récompense
            </Text>
          </View>
        </View>
        
        {/* Comment Ça Marche */}
        <View style={styles.howItWorksCard}>
          <Text style={styles.sectionTitle}>Comment Ça Marche</Text>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepIconContainer}>
              <Share2 color={Colors.secondary.main} size={24} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Partagez Votre Code</Text>
              <Text style={styles.stepDescription}>
                Partagez votre code unique de parrainage avec vos amis et votre famille
              </Text>
            </View>
          </View>
          
          <View style={styles.stepDivider} />
          
          <View style={styles.stepContainer}>
            <View style={styles.stepIconContainer}>
              <Users color={Colors.secondary.main} size={24} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Vos Amis S'inscrivent</Text>
              <Text style={styles.stepDescription}>
                Ils créent un compte en utilisant votre code de parrainage
              </Text>
            </View>
          </View>
          
          <View style={styles.stepDivider} />
          
          <View style={styles.stepContainer}>
            <View style={styles.stepIconContainer}>
              <Trophy color={Colors.secondary.main} size={24} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Gagnez des Récompenses</Text>
              <Text style={styles.stepDescription}>
                Vous recevez tous les deux 3000 F CFA lorsqu'ils effectuent leur première recharge
              </Text>
            </View>
          </View>
        </View>
        
        {/* Vos Parrainages */}
        <View style={styles.referralsCard}>
          <View style={styles.referralsHeader}>
            <Text style={styles.sectionTitle}>Vos Parrainages</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Voir Tout</Text>
              <ChevronRight color={Colors.secondary.main} size={16} />
            </TouchableOpacity>
          </View>
          
          {REFERRALS.length > 0 ? (
            REFERRALS.map(referral => (
              <View key={referral.id} style={styles.referralItem}>
                <View style={styles.referralUserContainer}>
                  <View style={styles.referralAvatar}>
                    <Text style={styles.referralAvatarText}>
                      {referral.name.charAt(0)}
                    </Text>
                  </View>
                  
                  <View style={styles.referralDetails}>
                    <Text style={styles.referralName}>{referral.name}</Text>
                    <Text style={styles.referralDate}>
                      Inscrit le {new Date(referral.date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.referralStatus}>
                  <View 
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: referral.status === 'completed' ? Colors.success.main : Colors.primary.main }
                    ]}
                  />
                  <Text style={styles.referralReward}>
                    {referral.status === 'completed' ? `+F CFA{referral.reward} F CFA` : 'En attente'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyReferrals}>
              <Text style={styles.emptyReferralsText}>
                Vous n'avez encore parrainé personne. Partagez votre code pour commencer à gagner !
              </Text>
            </View>
          )}
        </View>
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
  bannerCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.main,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginVertical: Layout.spacing.lg,
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
    paddingRight: Layout.spacing.md,
  },
  bannerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xl,
    color: Colors.common.white,
    marginBottom: Layout.spacing.xs,
  },
  bannerDescription: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.common.white,
    opacity: 0.9,
  },
  bannerImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeCard: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  codeLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.dark,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
  },
  code: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xl,
    color: Colors.text.primary,
    flex: 1,
    letterSpacing: 1,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.primary.main,
    marginLeft: Layout.spacing.xs,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.main,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
  },
  shareButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.common.white,
    marginLeft: Layout.spacing.sm,
  },
  progressCard: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  progressTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  progressAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xxl,
    color: Colors.primary.main,
  },
  progressBarContainer: {
    marginBottom: Layout.spacing.sm,
  },
  progressBar: {
    height: 10,
    backgroundColor: Colors.grey[200],
    borderRadius: Layout.borderRadius.round,
    marginBottom: Layout.spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success.main,
    borderRadius: Layout.borderRadius.round,
  },
  progressText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  howItWorksCard: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background.dark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  stepDescription: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  stepDivider: {
    height: 20,
    width: 1,
    backgroundColor: Colors.grey[300],
    marginLeft: 24,
    marginBottom: Layout.spacing.md,
  },
  referralsCard: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  referralsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.sm,
    color: Colors.secondary.main,
    marginRight: Layout.spacing.xs,
  },
  referralItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  referralUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  referralAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  referralAvatarText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.md,
    color: Colors.primary.main,
  },
  referralDetails: {
    flex: 1,
  },
  referralName: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  referralDate: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  referralStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Layout.spacing.xs,
  },
  referralReward: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  emptyReferrals: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.xl,
  },
  emptyReferralsText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});