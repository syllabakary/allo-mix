import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, Chrome as Home, ArrowRight, Share2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

export default function PaymentSuccessScreen() {
  const { amount } = useLocalSearchParams();
  // Conversion approximative USD -> F CFA (1 USD = 600 F CFA)
  const amountCFA = parseInt(amount) * 600;
  
  const handleGoHome = () => {
    router.replace('/(tabs)');
  };
  
  const handleViewDetails = () => {
    router.replace('/(tabs)/transactions');
  };
  
  const handleShare = () => {
    // Dans une application réelle, utiliserait l'API Share
    console.log('Partage du reçu de paiement');
  };

  return (
    <View style={styles.container}>
      {/* Animation de succès */}
      <View style={styles.animationContainer}>
        <View style={styles.successIconContainer}>
          <Check color={Colors.common.white} size={48} />
        </View>
      </View>
      
      {/* Message de succès */}
      <View style={styles.messageContainer}>
        <Text style={styles.successTitle}>Paiement Réussi !</Text>
        <Text style={styles.successMessage}>
          Votre paiement de {amountCFA.toLocaleString('fr-FR')} F CFA a été traité avec succès.
        </Text>
      </View>
      
      {/* Détails du reçu */}
      <View style={styles.receiptCard}>
        <View style={styles.receiptHeader}>
          <Text style={styles.receiptTitle}>Reçu de Paiement</Text>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Share2 color={Colors.text.primary} size={20} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.receiptDivider} />
        
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Montant</Text>
          <Text style={styles.receiptValue}>{amountCFA.toLocaleString('fr-FR')} F CFA</Text>
        </View>
        
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Date</Text>
          <Text style={styles.receiptValue}>{new Date().toLocaleDateString('fr-FR')}</Text>
        </View>
        
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Heure</Text>
          <Text style={styles.receiptValue}>{new Date().toLocaleTimeString('fr-FR')}</Text>
        </View>
        
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Identifiant de transaction</Text>
          <Text style={styles.receiptValue}>TXN123456789</Text>
        </View>
        
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Statut</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Terminé</Text>
          </View>
        </View>
      </View>
      
      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleGoHome}
        >
          <Home color={Colors.primary.main} size={20} />
          <Text style={styles.actionButtonText}>Retour à l'accueil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButtonPrimary}
          onPress={handleViewDetails}
        >
          <Text style={styles.actionButtonPrimaryText}>Voir les détails</Text>
          <ArrowRight color={Colors.common.white} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
    padding: Layout.spacing.lg,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Layout.spacing.xl,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.success.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  successTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.h2,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  successMessage: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.lg,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  receiptCard: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  receiptTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptDivider: {
    height: 1,
    backgroundColor: Colors.grey[200],
    marginBottom: Layout.spacing.md,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  receiptLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  receiptValue: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success.main,
    marginRight: Layout.spacing.xs,
  },
  statusText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.success.main,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    marginRight: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  actionButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.primary.main,
    marginLeft: Layout.spacing.sm,
  },
  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.main,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
  },
  actionButtonPrimaryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.common.white,
    marginRight: Layout.spacing.sm,
  },
});