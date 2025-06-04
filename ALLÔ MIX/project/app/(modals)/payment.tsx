import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CreditCard, Smartphone, Wallet, Bitcoin, Check, ChevronRight, Shield } from 'lucide-react-native';
import Header from '@/components/common/Header';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

const PAYMENT_METHODS = [
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    logo: require('../../assets/images/moov.png'),
    providers: [
      {
        id: 'orange',
        name: 'Orange Money',
        logo: require('../../assets/images/mtn.png'),
        otpCode: '#144*1*1#',
        prefixes: ['07'] // Préfixes Orange en Côte d'Ivoire
      },
      {
        id: 'mtn',
        name: 'MTN Mobile Money',
        logo: require('../../assets/images/wave.jpeg'),
        otpCode: '*165*2*1#',
        prefixes: ['05'] // Préfixes MTN en Côte d'Ivoire
      },
      {
        id: 'moov',
        name: 'Moov Money',
        logo: require('../../assets/images/moov.png'),
        otpCode: '#111*1*1#',
        prefixes: ['01'] // Préfixes Moov en Côte d'Ivoire
      },
    ]
  },
  {
    id: 'wave',
    name: 'Wave',
    logo: require('../../assets/images/moov.png'),
    providers: []
  },
  {
    id: 'card',
    name: 'Carte Bancaire',
    logo: require('../../assets/images/moov.png'),
    providers: []
  },
  {
    id: 'crypto',
    name: 'Cryptomonnaie',
    logo: require('../../assets/images/crypto.jpeg'),
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
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  
  const selectedMethodData = PAYMENT_METHODS.find(method => method.id === selectedMethod);
  const selectedProviderData = selectedMethodData?.providers.find(provider => provider.id === selectedProvider);
  
  // Fonction pour valider le numéro de téléphone
  const validatePhoneNumber = (number, providerId) => {
    // Nettoyer le numéro (enlever espaces, tirets, etc.)
    const cleanedNumber = number.replace(/[\s-]/g, '');
    
    // Vérifier que c'est 10 chiffres
    if (!/^\d{10}$/.test(cleanedNumber)) {
      return 'Le numéro doit contenir exactement 10 chiffres';
    }
    
    // Extraire les 2 premiers chiffres
    const prefix = cleanedNumber.substring(0, 2);
    
    // Trouver les données du provider sélectionné
    const provider = selectedMethodData?.providers.find(p => p.id === providerId);
    
    if (!provider) return null;
    
    // Vérifier si le préfixe correspond à l'opérateur sélectionné
    if (!provider.prefixes.includes(prefix)) {
      let correctOperator = '';
      
      // Trouver le bon opérateur pour ce préfixe
      const allProviders = selectedMethodData?.providers || [];
      for (const prov of allProviders) {
        if (prov.prefixes.includes(prefix)) {
          correctOperator = prov.name;
          break;
        }
      }
      
      if (correctOperator) {
        return `Ce numéro (${prefix}...) appartient à ${correctOperator}. Veuillez sélectionner le bon opérateur ou changer de numéro.`;
      } else {
        return `Le préfixe ${prefix} ne correspond à aucun opérateur mobile en Côte d'Ivoire.`;
      }
    }
    
    return null; // Pas d'erreur
  };
  
  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);
    setPhoneError('');
    
    // Reset provider when changing method
    if (methodId === 'mobile_money') {
      setSelectedProvider('orange');
    } else {
      setSelectedProvider('');
    }
  };
  
  const handleSelectProvider = (providerId) => {
    setSelectedProvider(providerId);
    setPhoneError('');
    
    // Revalider le numéro si il y en a un
    if (phoneNumber) {
      const error = validatePhoneNumber(phoneNumber, providerId);
      setPhoneError(error || '');
    }
  };
  
  const handlePhoneChange = (text) => {
    setPhoneNumber(text);
    
    // Valider en temps réel
    if (text.length >= 10) {
      const error = validatePhoneNumber(text, selectedProvider);
      setPhoneError(error || '');
    } else {
      setPhoneError('');
    }
  };
  
  const handlePayment = () => {
    if (selectedMethod === 'mobile_money') {
      // Valider le numéro avant de continuer
      const error = validatePhoneNumber(phoneNumber, selectedProvider);
      if (error) {
        setPhoneError(error);
        return;
      }
      
      // Pour Mobile Money, afficher l'étape OTP
      setShowOtpInput(true);
    } else {
      // Pour les autres méthodes, traitement direct
      processPayment();
    }
  };

  const handleOtpVerification = () => {
    if (!otpCode.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer le code OTP');
      return;
    }

    setVerifyingOtp(true);
    
    // Simulation de la vérification OTP
    setTimeout(() => {
      setVerifyingOtp(false);
      processPayment();
    }, 2000);
  };

  const processPayment = () => {
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

  const handleResendOtp = () => {
    Alert.alert(
      'Code envoyé',
      `Un nouveau code a été envoyé via ${selectedProviderData?.otpCode || '#144*1*1#'}`
    );
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
                {method.logo}
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
                    source={provider.logo}
                    style={styles.providerLogo}
                    resizeMode="contain"
                  />
                  <View style={styles.providerNameContainer}>
                    <Text style={styles.providerName}>{provider.name}</Text>
                    <Text style={styles.providerPrefixes}>
                      {provider.prefixes.join(', ')}...
                    </Text>
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
        {selectedMethod === 'mobile_money' && selectedProvider && !showOtpInput && (
          <View style={styles.phoneInputCard}>
            <Text style={styles.phoneInputTitle}>Entrez votre numéro Mobile Money</Text>
            
            <View style={[
              styles.phoneInputContainer,
              phoneError && styles.phoneInputError
            ]}>
              <TextInput
                style={styles.phoneInput}
                placeholder="Ex: 0712345678"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            
            {phoneError ? (
              <Text style={styles.errorText}>{phoneError}</Text>
            ) : (
              <Text style={styles.phoneInputHelp}>
                Entrez le numéro associé à votre compte {selectedProviderData?.name} 
                (commence par {selectedProviderData?.prefixes.join(' ou ')})
              </Text>
            )}
          </View>
        )}

        {/* Saisie du code OTP */}
        {showOtpInput && selectedMethod === 'mobile_money' && (
          <View style={styles.otpCard}>
            <View style={styles.otpHeader}>
              <View style={styles.otpIconContainer}>
                <Shield color={Colors.primary.main} size={24} />
              </View>
              <Text style={styles.otpTitle}>Validation de paiement</Text>
            </View>
            
            <Text style={styles.otpInstructions}>
              Composez {selectedProviderData?.otpCode} sur votre téléphone pour recevoir le code de validation, puis entrez-le ci-dessous.
            </Text>
            
            <View style={styles.otpCodeContainer}>
              <Text style={styles.otpCodeLabel}>Code à composer :</Text>
              <View style={styles.otpCodeBox}>
                <Text style={styles.otpCodeText}>{selectedProviderData?.otpCode}</Text>
              </View>
            </View>
            
            <View style={styles.otpInputContainer}>
              <TextInput
                style={styles.otpInput}
                placeholder="Entrez le code OTP"
                value={otpCode}
                onChangeText={setOtpCode}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.resendOtpButton}
              onPress={handleResendOtp}
            >
              <Text style={styles.resendOtpText}>Renvoyer le code</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Instructions de paiement */}
        {!showOtpInput && (
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
                Composez le code fourni sur votre téléphone
              </Text>
            </View>
            
            <View style={styles.instructionStep}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>3</Text>
              </View>
              <Text style={styles.instructionText}>
                Entrez le code OTP reçu pour confirmer la transaction
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
      
      {/* Bouton de paiement */}
      <View style={styles.paymentButtonContainer}>
        {showOtpInput ? (
          <TouchableOpacity 
            style={[
              styles.paymentButton,
              !otpCode.trim() && styles.paymentButtonDisabled,
              verifyingOtp && styles.paymentButtonProcessing
            ]}
            onPress={handleOtpVerification}
            disabled={!otpCode.trim() || verifyingOtp}
          >
            <Text style={styles.paymentButtonText}>
              {verifyingOtp ? 'Vérification en cours...' : 'Valider le code OTP'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[
              styles.paymentButton,
              ((!phoneNumber || phoneError) && selectedMethod === 'mobile_money') && styles.paymentButtonDisabled,
              processingPayment && styles.paymentButtonProcessing
            ]}
            onPress={handlePayment}
            disabled={((!phoneNumber || phoneError) && selectedMethod === 'mobile_money') || processingPayment}
          >
            <Text style={styles.paymentButtonText}>
              {processingPayment ? 'Traitement en cours...' : 'Payer maintenant'}
            </Text>
          </TouchableOpacity>
        )}
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
  // Écran de succès
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.xl,
  },
  successTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xxl,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  successMessage: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Résumé de commande
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
  // Méthodes de paiement
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
    paddingHorizontal: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
    borderRadius: Layout.borderRadius.sm,
  },
  selectedMethodOption: {
    backgroundColor: Colors.primary.light,
    borderBottomColor: Colors.primary.main,
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
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Opérateurs
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
    backgroundColor: Colors.background.paper,
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
  providerPrefixes: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 2,
  },
  providerSelectedIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: Colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background.paper,
  },
  // Saisie numéro
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
    backgroundColor: Colors.background.paper,
  },
  phoneInputError: {
    borderColor: Colors.error.main,
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
    lineHeight: 18,
  },
  errorText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.error.main,
    marginTop: Layout.spacing.xs,
    lineHeight: 18,
  },
  // OTP
  otpCard: {
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
  otpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  otpIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.sm,
  },
  otpTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
  },
  otpInstructions: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.lg,
    lineHeight: 22,
  },
  otpCodeContainer: {
    marginBottom: Layout.spacing.lg,
  },
  otpCodeLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  otpCodeBox: {
    backgroundColor: Colors.grey[100],
    borderRadius: Layout.borderRadius.sm,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.grey[300],
  },
  otpCodeText: {
    fontFamily: 'Roboto-Bold',
    fontSize: FontSizes.lg,
    color: Colors.primary.main,
    textAlign: 'center',
    letterSpacing: 2,
  },
  otpInputContainer: {
    borderWidth: 1,
    borderColor: Colors.grey[300],
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    backgroundColor: Colors.background.paper,
  },
  otpInput: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    paddingVertical: Layout.spacing.md,
    textAlign: 'center',
    letterSpacing: 4,
  },
  resendOtpButton: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
  },
  resendOtpText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.primary.main,
    textDecorationLine: 'underline',
  },
  // Instructions
  
  instructionsCard: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.md,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.sm,
    marginTop: 2,
  },
  instructionNumberText: {
    fontFamily: 'Roboto-Bold',
    fontSize: FontSizes.sm,
    color: Colors.common.white,
  },
  instructionText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    flex: 1,
    lineHeight: 20,
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
    elevation: 4,
  },
  paymentButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  paymentButtonDisabled: {
    backgroundColor: Colors.grey[400],
    shadowOpacity: 0,
    elevation: 0,
  },
  paymentButtonProcessing: {
    backgroundColor: Colors.primary.dark,
    opacity: 0.8,
  },
  paymentButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.common.white,
    textAlign: 'center',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.lg,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.xl,
  },
  successTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xxl,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  successMessage: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.lg,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});