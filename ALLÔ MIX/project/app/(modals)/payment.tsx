import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CreditCard, Smartphone, Wallet, Bitcoin, Check, ChevronRight } from 'lucide-react-native';
import Header from '@/components/common/Header';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

const PAYMENT_METHODS = [
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    icon: <Smartphone color={Colors.secondary.main} size={24} />,
    providers: [
      {
        id: 'orange',
        name: 'Orange Money',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png'
      },
      {
        id: 'mtn',
        name: 'MTN Mobile Money',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/200px-MTN_Logo.svg.png'
      },
      {
        id: 'moov',
        name: 'Moov Money',
        logo: 'https://seeklogo.com/images/M/moov-africa-logo-459FC30F68-seeklogo.com.png'
      },
      {
        id: 'wave',
        name: 'Wave',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Wave_logo.svg/1200px-Wave_logo.svg.png'
      },
      {
        id: 'free',
        name: 'Free Money',
        logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/d/d2/Free_Logo.svg/1200px-Free_Logo.svg.png'
      }
    ]
  },
  {
    id: 'wave',
    name: 'Wave',
    icon: <Wallet color={Colors.secondary.main} size={24} />,
    providers: []
  },
  {
    id: 'card',
    name: 'Carte Bancaire',
    icon: <CreditCard color={Colors.secondary.main} size={24} />,
    providers: []
  },
  {
    id: 'crypto',
    name: 'Cryptomonnaie',
    icon: <Bitcoin color={Colors.secondary.main} size={24} />,
    providers: []
  }
];

export default function PaymentScreen() {
  const { id, amount, name, recipient } = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState('mobile_money');
  const [selectedProvider, setSelectedProvider] = useState('orange');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const selectedMethodData = PAYMENT_METHODS.find(method => method.id === selectedMethod);
  
  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId);
    
    // Reset provider when changing method
    if (methodId === 'mobile_money') {
      setSelectedProvider('orange');
    } else {
      setSelectedProvider('');
    }
  };
  
  const handleSelectProvider = (providerId: string) => {
    setSelectedProvider(providerId);
  };
  
  const handlePayment = () => {
    // In a real app, this would handle the payment processing
    setProcessingPayment(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);
      
      // Navigate to success screen after a short delay
      setTimeout(() => {
        router.replace({
          pathname: '/(modals)/payment-success',
          params: { amount: amount }
        });
      }, 1000);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <View style={styles.container}>
        <Header title="Paiement" showBack />
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Check color={Colors.common.white} size={48} />
          </View>
          <Text style={styles.successTitle}>Paiement réussi !</Text>
          <Text style={styles.successMessage}>Votre paiement a été traité avec succès.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Paiement" showBack />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Résumé de la commande */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Résumé de la commande</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Forfait</Text>
            <Text style={styles.summaryValue}>{name}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Bénéficiaire</Text>
            <Text style={styles.summaryValue}>
              {recipient === 'self' ? 'Moi-même' : 'Autre personne'}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Montant total</Text>
            <Text style={styles.totalValue}>{amount} F CFA</Text>
          </View>
        </View>
        
        {/* Méthodes de paiement */}
        <View style={styles.paymentMethodsCard}>
          <Text style={styles.paymentTitle}>Méthode de paiement</Text>
          
          {PAYMENT_METHODS.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodOption,
                selectedMethod === method.id && styles.selectedMethodOption
              ]}
              onPress={() => handleSelectMethod(method.id)}
            >
              <View style={styles.methodIconContainer}>
                {method.icon}
              </View>
              
              <Text style={styles.methodName}>{method.name}</Text>
              
              {selectedMethod === method.id ? (
                <View style={styles.selectedIndicator}>
                  <Check color={Colors.common.white} size={16} />
                </View>
              ) : (
                <ChevronRight color={Colors.grey[500]} size={20} />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Sélection de l'opérateur (pour Mobile Money) */}
        {selectedMethod === 'mobile_money' && (
          <View style={styles.providersCard}>
            <Text style={styles.providersTitle}>Sélectionnez un opérateur</Text>
            
            <View style={styles.providersContainer}>
              {selectedMethodData?.providers.map(provider => (
                <TouchableOpacity
                  key={provider.id}
                  style={[
                    styles.providerOption,
                    selectedProvider === provider.id && styles.selectedProviderOption
                  ]}
                  onPress={() => handleSelectProvider(provider.id)}
                >
                  <Image
                    source={{ uri: provider.logo }}
                    style={styles.providerLogo}
                    resizeMode="contain"
                  />
                  <View style={styles.providerNameContainer}>
                    <Text style={styles.providerName}>{provider.name}</Text>
                  </View>
                  
                  {selectedProvider === provider.id && (
                    <View style={styles.providerSelectedIndicator}>
                      <Check color={Colors.common.white} size={16} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        {/* Saisie du numéro Mobile Money */}
        {selectedMethod === 'mobile_money' && selectedProvider && (
          <View style={styles.phoneInputCard}>
            <Text style={styles.phoneInputTitle}>Entrez votre numéro Mobile Money</Text>
            
            <View style={styles.phoneInputContainer}>
              <TextInput
                style={styles.phoneInput}
                placeholder="Numéro de téléphone"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
            
            <Text style={styles.phoneInputHelp}>
              Entrez le numéro associé à votre compte Mobile Money
            </Text>
          </View>
        )}
        
        {/* Instructions de paiement */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Instructions de paiement</Text>
          
          <View style={styles.instructionStep}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Cliquez sur "Payer maintenant" pour initier le paiement
            </Text>
          </View>
          
          <View style={styles.instructionStep}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Vous recevrez une demande de confirmation sur votre téléphone
            </Text>
          </View>
          
          <View style={styles.instructionStep}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              Entrez votre code PIN pour autoriser la transaction
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Bouton de paiement */}
      <View style={styles.paymentButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.paymentButton,
            (!phoneNumber && selectedMethod === 'mobile_money') && styles.paymentButtonDisabled,
            processingPayment && styles.paymentButtonProcessing
          ]}
          onPress={handlePayment}
          disabled={(!phoneNumber && selectedMethod === 'mobile_money') || processingPayment}
        >
          <Text style={styles.paymentButtonText}>
            {processingPayment ? 'Traitement en cours...' : 'Payer maintenant'}
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 100, // Pour le bouton fixe en bas
  },
  summaryCard: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginVertical: Layout.spacing.lg,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  summaryLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grey[200],
    marginVertical: Layout.spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  totalValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xl,
    color: Colors.primary.main,
  },
  paymentMethodsCard: {
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
  paymentTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  selectedMethodOption: {
    backgroundColor: Colors.primary.light,
  },
  methodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.dark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  methodName: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    flex: 1,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providersCard: {
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
  providersTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  providersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Layout.spacing.xs,
  },
  providerOption: {
    width: '30%',
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.grey[300],
    padding: Layout.spacing.sm,
    margin: Layout.spacing.xs,
    alignItems: 'center',
    position: 'relative',
  },
  selectedProviderOption: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.light,
  },
  providerLogo: {
    width: 40,
    height: 40,
    marginBottom: Layout.spacing.sm,
  },
  providerNameContainer: {
    alignItems: 'center',
  },
  providerName: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  providerSelectedIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background.paper,
  },
  phoneInputCard: {
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
  phoneInputTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  phoneInputContainer: {
    borderWidth: 1,
    borderColor: Colors.grey[300],
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  phoneInput: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    paddingVertical: Layout.spacing.md,
  },
  phoneInputHelp: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  instructionsCard: {
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
  instructionsTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  instructionNumberText: {
    fontFamily: 'Roboto-Bold',
    fontSize: FontSizes.sm,
    color: Colors.common.white,
  },
  instructionText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    flex: 1,
  },
  paymentButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.paper,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentButton: {
    backgroundColor: Colors.primary.main,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
  },
  paymentButtonDisabled: {
    backgroundColor: Colors.grey[300],
  },
  paymentButtonProcessing: {
    backgroundColor: Colors.secondary.main,
  },
  paymentButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.common.white,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.xl,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.lg,
  },
  successTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.h3,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  successMessage: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.lg,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
});