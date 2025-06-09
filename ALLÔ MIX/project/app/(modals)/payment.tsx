import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CreditCard, Smartphone, Wallet, Bitcoin, Check, ChevronRight, Shield, Phone } from 'lucide-react-native';
import Header from '@/components/common/Header';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

const PAYMENT_METHODS = [
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    icon: <Smartphone color={Colors.primary.main} size={24} />,
    description: 'Orange, MTN, Moov Money',
    providers: [
      {
        id: 'orange',
        name: 'Orange Money',
        logo: require('../../assets/images/orange.png'),
        otpCode: '#144*1*1#',
        prefixes: ['07'],
        color: '#FF6600'
      },
      {
        id: 'mtn',
        name: 'MTN Mobile Money',
        logo: require('../../assets/images/mtn.png'),
        otpCode: '*165*2*1#',
        prefixes: ['05'],
        color: '#FFCC00'
      },
      {
        id: 'moov',
        name: 'Moov Money',
        logo: require('../../assets/images/moov.png'),
        otpCode: '#111*1*1#',
        prefixes: ['01'],
        color: '#0066CC'
      },
    ]
  },
  {
    id: 'wave',
    name: 'Wave',
    icon: <Wallet color={Colors.primary.main} size={24} />,
    description: 'Paiement instantané',
    providers: []
  },
  {
    id: 'card',
    name: 'Carte Bancaire',
    icon: <CreditCard color={Colors.primary.main} size={24} />,
    description: 'Visa, Mastercard',
    providers: []
  }
];

const STEPS = [
  { id: 'method', title: 'Méthode de paiement' },
  { id: 'details', title: 'Détails du paiement' },
  { id: 'confirmation', title: 'Confirmation' }
];

export default function PaymentScreen() {
  const { id, amount, name, recipient } = useLocalSearchParams();
  const [currentStep, setCurrentStep] = useState('method');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
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
    const cleanedNumber = number.replace(/[\s-]/g, '');
    
    if (!/^\d{10}$/.test(cleanedNumber)) {
      return 'Le numéro doit contenir exactement 10 chiffres';
    }
    
    const prefix = cleanedNumber.substring(0, 2);
    const provider = selectedMethodData?.providers.find(p => p.id === providerId);
    
    if (!provider) return null;
    
    if (!provider.prefixes.includes(prefix)) {
      let correctOperator = '';
      const allProviders = selectedMethodData?.providers || [];
      for (const prov of allProviders) {
        if (prov.prefixes.includes(prefix)) {
          correctOperator = prov.name;
          break;
        }
      }
      
      if (correctOperator) {
        return `Ce numéro appartient à ${correctOperator}. Veuillez sélectionner le bon opérateur.`;
      } else {
        return `Le préfixe ${prefix} ne correspond à aucun opérateur mobile.`;
      }
    }
    
    return null;
  };
  
  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);
    setPhoneError('');
    
    if (methodId === 'mobile_money') {
      setCurrentStep('details');
    } else {
      // Pour les autres méthodes, aller directement à la confirmation
      setCurrentStep('confirmation');
    }
  };
  
  const handleSelectProvider = (providerId) => {
    setSelectedProvider(providerId);
    setPhoneError('');
    
    if (phoneNumber) {
      const error = validatePhoneNumber(phoneNumber, providerId);
      setPhoneError(error || '');
    }
  };
  
  const handlePhoneChange = (text) => {
    setPhoneNumber(text);
    
    if (text.length >= 10) {
      const error = validatePhoneNumber(text, selectedProvider);
      setPhoneError(error || '');
    } else {
      setPhoneError('');
    }
  };
  
  const handleContinue = () => {
    if (currentStep === 'details' && selectedMethod === 'mobile_money') {
      const error = validatePhoneNumber(phoneNumber, selectedProvider);
      if (error) {
        setPhoneError(error);
        return;
      }
      setCurrentStep('confirmation');
    }
  };
  
  const handlePayment = () => {
    if (selectedMethod === 'mobile_money') {
      setShowOtpInput(true);
    } else {
      processPayment();
    }
  };

  const handleOtpVerification = () => {
    if (!otpCode.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer le code OTP');
      return;
    }

    setVerifyingOtp(true);
    
    setTimeout(() => {
      setVerifyingOtp(false);
      processPayment();
    }, 2000);
  };

  const processPayment = () => {
    setProcessingPayment(true);
    
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);
      
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

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEPS.map((step, index) => (
        <View key={step.id} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            currentStep === step.id && styles.stepCircleActive,
            (STEPS.findIndex(s => s.id === currentStep) > index) && styles.stepCircleCompleted
          ]}>
            {STEPS.findIndex(s => s.id === currentStep) > index ? (
              <Check color={Colors.common.white} size={16} />
            ) : (
              <Text style={[
                styles.stepNumber,
                currentStep === step.id && styles.stepNumberActive
              ]}>
                {index + 1}
              </Text>
            )}
          </View>
          <Text style={[
            styles.stepTitle,
            currentStep === step.id && styles.stepTitleActive
          ]}>
            {step.title}
          </Text>
          {index < STEPS.length - 1 && (
            <View style={[
              styles.stepLine,
              (STEPS.findIndex(s => s.id === currentStep) > index) && styles.stepLineCompleted
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderPaymentMethods = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Choisissez votre méthode de paiement</Text>
      
      {PAYMENT_METHODS.map(method => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodCard,
            selectedMethod === method.id && styles.methodCardSelected
          ]}
          onPress={() => handleSelectMethod(method.id)}
        >
          <View style={styles.methodIcon}>
            {method.icon}
          </View>
          
          <View style={styles.methodInfo}>
            <Text style={styles.methodName}>{method.name}</Text>
            <Text style={styles.methodDescription}>{method.description}</Text>
          </View>
          
          {selectedMethod === method.id ? (
            <View style={styles.selectedBadge}>
              <Check color={Colors.common.white} size={16} />
            </View>
          ) : (
            <ChevronRight color={Colors.grey[400]} size={20} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPaymentDetails = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Détails du paiement</Text>
      
      {selectedMethod === 'mobile_money' && (
        <>
          <Text style={styles.subsectionTitle}>Sélectionnez votre opérateur</Text>
          
          <View style={styles.providersGrid}>
            {selectedMethodData?.providers.map(provider => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.providerCard,
                  selectedProvider === provider.id && styles.providerCardSelected
                ]}
                onPress={() => handleSelectProvider(provider.id)}
              >
                <Image
                  source={provider.logo}
                  style={styles.providerLogo}
                  resizeMode="contain"
                />
                <Text style={styles.providerName}>{provider.name}</Text>
                <Text style={styles.providerPrefix}>
                  {provider.prefixes.join(', ')}...
                </Text>
                
                {selectedProvider === provider.id && (
                  <View style={styles.providerBadge}>
                    <Check color={Colors.common.white} size={12} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          {selectedProvider && (
            <View style={styles.phoneSection}>
              <Text style={styles.subsectionTitle}>Numéro de téléphone</Text>
              
              <View style={[
                styles.phoneInputWrapper,
                phoneError && styles.phoneInputError
              ]}>
                <Phone color={Colors.grey[400]} size={20} style={styles.phoneIcon} />
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
                <Text style={styles.helpText}>
                  Numéro {selectedProviderData?.name} 
                  (commence par {selectedProviderData?.prefixes.join(' ou ')})
                </Text>
              )}
            </View>
          )}
        </>
      )}
    </View>
  );

  const renderConfirmation = () => (
    <View style={styles.content}>
      {!showOtpInput ? (
        <>
          <Text style={styles.sectionTitle}>Confirmation du paiement</Text>
          
          {/* Résumé de la commande */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Résumé</Text>
            </View>
            
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
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Méthode</Text>
              <Text style={styles.summaryValue}>{selectedMethodData?.name}</Text>
            </View>
            
            {selectedMethod === 'mobile_money' && selectedProviderData && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Opérateur</Text>
                <Text style={styles.summaryValue}>{selectedProviderData.name}</Text>
              </View>
            )}
            
            {phoneNumber && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Numéro</Text>
                <Text style={styles.summaryValue}>{phoneNumber}</Text>
              </View>
            )}
            
            <View style={styles.divider} />
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total à payer</Text>
              <Text style={styles.totalValue}>{amount} F CFA</Text>
            </View>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Validation du paiement</Text>
          
          <View style={styles.otpCard}>
            <View style={styles.otpHeader}>
              <Shield color={Colors.primary.main} size={32} />
              <Text style={styles.otpTitle}>Code de validation</Text>
            </View>
            
            <Text style={styles.otpInstructions}>
              1. Composez le code ci-dessous sur votre téléphone
            </Text>
            
            <View style={styles.otpCodeDisplay}>
              <Text style={styles.otpCodeText}>{selectedProviderData?.otpCode}</Text>
            </View>
            
            <Text style={styles.otpInstructions}>
              2. Entrez le code reçu par SMS
            </Text>
            
            <TextInput
              style={styles.otpInput}
              placeholder="Code à 6 chiffres"
              value={otpCode}
              onChangeText={setOtpCode}
              keyboardType="numeric"
              maxLength={6}
            />
            
            <TouchableOpacity 
              style={styles.resendButton}
              onPress={handleResendOtp}
            >
              <Text style={styles.resendText}>Renvoyer le code</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

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
      
      {renderStepIndicator()}
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {currentStep === 'method' && renderPaymentMethods()}
        {currentStep === 'details' && renderPaymentDetails()}
        {currentStep === 'confirmation' && renderConfirmation()}
      </ScrollView>
      
      {/* Bouton d'action */}
      <View style={styles.actionContainer}>
        {currentStep === 'method' && selectedMethod && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleSelectMethod(selectedMethod)}
          >
            <Text style={styles.actionButtonText}>Continuer</Text>
          </TouchableOpacity>
        )}
        
        {currentStep === 'details' && selectedProvider && phoneNumber && !phoneError && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleContinue}
          >
            <Text style={styles.actionButtonText}>Continuer</Text>
          </TouchableOpacity>
        )}
        
        {currentStep === 'confirmation' && !showOtpInput && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handlePayment}
            disabled={processingPayment}
          >
            <Text style={styles.actionButtonText}>
              {processingPayment ? 'Traitement...' : 'Payer maintenant'}
            </Text>
          </TouchableOpacity>
        )}
        
        {showOtpInput && (
          <TouchableOpacity 
            style={[
              styles.actionButton,
              !otpCode.trim() && styles.actionButtonDisabled
            ]}
            onPress={handleOtpVerification}
            disabled={!otpCode.trim() || verifyingOtp}
          >
            <Text style={styles.actionButtonText}>
              {verifyingOtp ? 'Vérification...' : 'Valider le paiement'}
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
  
  // Indicateur d'étapes
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.grey[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.xs,
  },
  stepCircleActive: {
    backgroundColor: Colors.primary.main,
  },
  stepCircleCompleted: {
    backgroundColor: Colors.success.main,
  },
  stepNumber: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.sm,
    color: Colors.grey[600],
  },
  stepNumberActive: {
    color: Colors.common.white,
  },
  stepTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.xs,
    color: Colors.grey[600],
    textAlign: 'center',
  },
  stepTitleActive: {
    color: Colors.primary.main,
    fontFamily: 'Roboto-Medium',
  },
  stepLine: {
    position: 'absolute',
    top: 16,
    left: '60%',
    right: '-60%',
    height: 2,
    backgroundColor: Colors.grey[300],
  },
  stepLineCompleted: {
    backgroundColor: Colors.success.main,
  },
  
  // Contenu principal
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    padding: Layout.spacing.lg,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.xl,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.lg,
  },
  subsectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
    marginTop: Layout.spacing.lg,
  },
  
  // Méthodes de paiement
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    borderWidth: 2,
    borderColor: Colors.grey[200],
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  methodCardSelected: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.light,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  methodDescription: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Opérateurs
  providersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Layout.spacing.xs,
  },
  providerCard: {
    width: '31%',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    margin: Layout.spacing.xs,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.grey[200],
    position: 'relative',
  },
  providerCardSelected: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.light,
  },
  providerLogo: {
    width: 40,
    height: 40,
    marginBottom: Layout.spacing.sm,
  },
  providerName: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 2,
  },
  providerPrefix: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  providerBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Saisie téléphone
  phoneSection: {
    marginTop: Layout.spacing.lg,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 2,
    borderColor: Colors.grey[200],
    paddingHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  phoneInputError: {
    borderColor: Colors.error.main,
  },
  phoneIcon: {
    marginRight: Layout.spacing.sm,
  },
  phoneInput: {
    flex: 1,
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    paddingVertical: Layout.spacing.md,
  },
  helpText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginTop: Layout.spacing.xs,
  },
  errorText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.error.main,
    marginTop: Layout.spacing.xs,
  },
  
  // Résumé
  summaryCard: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryHeader: {
    marginBottom: Layout.spacing.md,
  },
  summaryTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
  },
  totalValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xl,
    color: Colors.primary.main,
  },
  
  // OTP
  otpCard: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  otpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  otpTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginLeft: Layout.spacing.sm,
  },
  otpInstructions: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.md,
  },
  otpCodeDisplay: {
    backgroundColor: Colors.grey[100],
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  otpCodeText: {
    fontFamily: 'Roboto-Bold',
    fontSize: FontSizes.xl,
    color: Colors.primary.main,
    letterSpacing: 2,
  },
  otpInput: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 2,
    borderColor: Colors.grey[200],
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: Layout.spacing.md,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
  },
  resendText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.primary.main,
    textDecorationLine: 'underline',
  },
  
  // Bouton d'action
  actionContainer: {
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
  actionButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonDisabled: {
    backgroundColor: Colors.grey[400],
    shadowOpacity: 0,
    elevation: 0,
  },
  actionButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.common.white,
  },
  
  // Écran de succès
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.lg,
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