import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Alert, 
  Modal,
  Linking,
  Dimensions,
  Platform
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Bitcoin, 
  Check, 
  ChevronRight, 
  RefreshCw, 
  UserPlus, 
  User,
  X,
  Info
} from 'lucide-react-native';
import Header from '@/components/common/Header';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

// Dimensions pour le responsive
const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

// Configuration des méthodes de paiement
const PAYMENT_METHODS = [
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    icon: <Smartphone color={Colors.secondary.main} size={24} />,
    providers: [
      {
        id: 'orange',
        name: 'Orange Money',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png',
        paymentUrl: 'orange-money://pay',
        minAmount: 100,
        maxAmount: 1000000,
        fees: '1%',
        countries: ['CI', 'SN', 'CM', 'ML', 'BF']
      },
      {
        id: 'mtn',
        name: 'MTN Mobile Money',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/200px-MTN_Logo.svg.png',
        paymentUrl: 'mtn-momo://pay',
        minAmount: 100,
        maxAmount: 500000,
        fees: '1.5%',
        countries: ['CI', 'GH', 'UG', 'RW', 'ZA']
      },
      {
        id: 'moov',
        name: 'Moov Money',
        logo: 'https://seeklogo.com/images/M/moov-africa-logo-459FC30F68-seeklogo.com.png',
        paymentUrl: 'moov-money://pay',
        minAmount: 200,
        maxAmount: 750000,
        fees: '1.2%',
        countries: ['CI', 'BJ', 'TG', 'BF']
      }
    ]
  },
  {
    id: 'wave',
    name: 'Wave',
    icon: <Wallet color={Colors.secondary.main} size={24} />,
    providers: [],
    paymentUrl: 'wave://pay',
    minAmount: 100,
    maxAmount: 500000,
    fees: '0% jusqu\'à 100.000 FCFA',
    countries: ['CI', 'SN']
  },
  {
    id: 'card',
    name: 'Carte Bancaire',
    icon: <CreditCard color={Colors.secondary.main} size={24} />,
    providers: [],
    paymentUrl: null, // Généralement intégration avec Stripe ou autre
    minAmount: 500,
    maxAmount: 1000000,
    fees: '2.5%',
    countries: ['*']
  },
  {
    id: 'crypto',
    name: 'Cryptomonnaie',
    icon: <Bitcoin color={Colors.secondary.main} size={24} />,
    providers: [],
    paymentUrl: null, // Intégration avec Binance Pay ou autre
    minAmount: 1000,
    maxAmount: 5000000,
    fees: '0.5%',
    countries: ['*']
  }
];

// Historique des recharges récentes
const RECENT_RECHARGES = [
  { id: 1, provider: 'orange', amount: 5000, date: '02/05/2025', phone: '07123456' },
  { id: 2, provider: 'mtn', amount: 10000, date: '28/04/2025', phone: '05555666' },
  { id: 3, provider: 'moov', amount: 2000, date: '20/04/2025', phone: '01234567' },
];

export default function PaymentScreen() {
  const { id, amount, name, recipient } = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState('mobile_money');
  const [selectedProvider, setSelectedProvider] = useState('orange');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false);
  
  // États pour la recharge
  const [isRechargeModalVisible, setIsRechargeModalVisible] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('5000');
  const [rechargeTarget, setRechargeTarget] = useState('self');
  const [beneficiaryPhone, setBeneficiaryPhone] = useState('');
  const [isProcessingRecharge, setIsProcessingRecharge] = useState(false);
  const [rechargeSuccess, setRechargeSuccess] = useState(false);
  const [showFeesInfo, setShowFeesInfo] = useState(false);
  
  const amountFCFA = parseInt(amount) * 600; // Conversion approximative de USD à FCFA
  
  const selectedMethodData = PAYMENT_METHODS.find(method => method.id === selectedMethod);
  const selectedProviderData = selectedMethod === 'mobile_money' 
    ? selectedMethodData?.providers.find(p => p.id === selectedProvider)
    : PAYMENT_METHODS.find(method => method.id === selectedMethod);
  
  // Vérifie si le numéro de téléphone est valide
  const isValidPhoneNumber = (phone) => {
    const regex = /^(77|78|76|75|70|05|06|07|01|02|03|04)\d{7}$/;
    return regex.test(phone);
  };

  // Ferme la modal de recharge et réinitialise les états
  const closeRechargeModal = () => {
    setIsRechargeModalVisible(false);
    setRechargeSuccess(false);
    setIsProcessingRecharge(false);
  };
  
  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);
    
    // Reset provider when changing method
    if (methodId === 'mobile_money') {
      setSelectedProvider('orange');
    } else {
      setSelectedProvider('');
    }
  };
  
  const handleSelectProvider = (providerId) => {
    setSelectedProvider(providerId);
    
    // Pour Wave, on ouvre directement l'application
    if (selectedMethod === 'wave') {
      handleWavePayment();
      return;
    }
    
    // Pour les autres, on ouvre la modal de recharge
    setIsRechargeModalVisible(true);
  };
  
  // Gère le paiement via Wave
  const handleWavePayment = async () => {
    try {
      const waveUrl = `wave://pay?amount=${amountFCFA}&recipient=YOUR_MERCHANT_CODE`;
      const canOpen = await Linking.canOpenURL(waveUrl);
      
      if (canOpen) {
        await Linking.openURL(waveUrl);
      } else {
        Alert.alert(
          'Wave non installé',
          'Veuillez installer l\'application Wave pour effectuer ce paiement.',
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Installer', onPress: () => Linking.openURL('https://wave.com/download') }
          ]
        );
      }
    } catch (error) {
      console.error('Erreur lors de l\'ouverture de Wave:', error);
      Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application Wave');
    }
  };
  
  const handleRecharge = () => {
    setIsRechargeModalVisible(true);
  };
  
  const processRecharge = () => {
    // Valider les entrées
    const amountNum = parseInt(rechargeAmount);
    
    if (!rechargeAmount || isNaN(amountNum) || amountNum < selectedProviderData?.minAmount || amountNum > selectedProviderData?.maxAmount) {
      Alert.alert(
        'Montant invalide', 
        `Veuillez entrer un montant valide (entre ${selectedProviderData?.minAmount} et ${selectedProviderData?.maxAmount} FCFA)`
      );
      return;
    }
    
    if (rechargeTarget === 'other' && !isValidPhoneNumber(beneficiaryPhone)) {
      Alert.alert('Numéro invalide', 'Veuillez entrer un numéro de téléphone valide pour la Côte d\'Ivoire');
      return;
    }
    
    // Simuler le traitement de la recharge
    setIsProcessingRecharge(true);
    
    setTimeout(() => {
      setIsProcessingRecharge(false);
      setRechargeSuccess(true);
      
      // Dans une application réelle, on mettrait à jour le solde de l'utilisateur ici
      
      // Fermer la modal après quelques secondes
      setTimeout(() => {
        closeRechargeModal();
        setShowInsufficientFunds(false);
      }, 2000);
    }, 2000);
  };
  
  const handlePayment = async () => {
    // Validation pour Mobile Money
    if (selectedMethod === 'mobile_money' && !isValidPhoneNumber(phoneNumber)) {
      Alert.alert('Numéro invalide', 'Veuillez entrer un numéro de téléphone valide pour la Côte d\'Ivoire');
      return;
    }
    
    // Vérification du montant
    if (amountFCFA < selectedProviderData?.minAmount || amountFCFA > selectedProviderData?.maxAmount) {
      Alert.alert(
        'Montant invalide', 
        `Le montant doit être compris entre ${selectedProviderData?.minAmount} et ${selectedProviderData?.maxAmount} FCFA pour cette méthode`
      );
      return;
    }
    
    // Simuler une vérification de solde insuffisant (pour démonstration)
    const hasInsufficientFunds = Math.random() > 0.7;
    
    if (hasInsufficientFunds) {
      setShowInsufficientFunds(true);
      return;
    }
    
    // Pour Wave, on ouvre directement l'application
    if (selectedMethod === 'wave') {
      await handleWavePayment();
      return;
    }
    
    // Pour les autres méthodes, on simule le traitement
    setProcessingPayment(true);
    
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);
      
      setTimeout(() => {
        router.replace({
          pathname: '/(modals)/payment-success',
          params: { 
            amount: amountFCFA,
            method: selectedMethod,
            provider: selectedProvider || ''
          }
        });
      }, 1000);
    }, 2000);
  };

  // Rendu du contenu de la modal de recharge
  const renderRechargeModalContent = () => {
    if (rechargeSuccess) {
      return (
        <View style={styles.rechargeSuccessContainer}>
          <View style={styles.successIcon}>
            <Check color={Colors.common.white} size={48} />
          </View>
          <Text style={styles.rechargeSuccessTitle}>Recharge Réussie!</Text>
          <Text style={styles.rechargeSuccessText}>
            Votre compte a été rechargé de {rechargeAmount} FCFA.
          </Text>
          <TouchableOpacity 
            style={styles.rechargeCloseButton}
            onPress={closeRechargeModal}
          >
            <Text style={styles.rechargeCloseButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.rechargeModalContent}>
        <Text style={styles.rechargeModalTitle}>
          Recharger via {selectedMethodData?.providers.find(p => p.id === selectedProvider)?.name || selectedMethodData?.name}
        </Text>
        
        {/* Informations sur les frais */}
        <TouchableOpacity 
          style={styles.feesInfoButton}
          onPress={() => setShowFeesInfo(!showFeesInfo)}
        >
          <Info color={Colors.primary.main} size={18} />
          <Text style={styles.feesInfoText}>Frais: {selectedProviderData?.fees}</Text>
        </TouchableOpacity>
        
        {showFeesInfo && (
          <View style={styles.feesDetails}>
            <Text style={styles.feesDetailsText}>
              Frais appliqués: {selectedProviderData?.fees}. Montant minimum: {selectedProviderData?.minAmount} FCFA, 
              maximum: {selectedProviderData?.maxAmount} FCFA.
            </Text>
          </View>
        )}
        
        {/* Montant de recharge */}
        <Text style={styles.rechargeInputLabel}>Montant de recharge (FCFA)</Text>
        <TextInput
          style={styles.rechargeAmountInput}
          value={rechargeAmount}
          onChangeText={setRechargeAmount}
          keyboardType="numeric"
          placeholder={`Entre ${selectedProviderData?.minAmount} et ${selectedProviderData?.maxAmount} FCFA`}
        />
        
        {/* Options de recharge rapide */}
        <View style={styles.quickAmountContainer}>
          {[1000, 2000, 5000, 10000].map(amount => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.quickAmountButton,
                parseInt(rechargeAmount) === amount && styles.quickAmountButtonSelected
              ]}
              onPress={() => setRechargeAmount(amount.toString())}
              disabled={amount < selectedProviderData?.minAmount || amount > selectedProviderData?.maxAmount}
            >
              <Text style={[
                styles.quickAmountText,
                parseInt(rechargeAmount) === amount && styles.quickAmountTextSelected,
                (amount < selectedProviderData?.minAmount || amount > selectedProviderData?.maxAmount) && styles.quickAmountDisabled
              ]}>
                {amount} FCFA
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Options pour soi-même ou pour quelqu'un d'autre */}
        <Text style={styles.rechargeInputLabel}>Recharger pour</Text>
        <View style={styles.rechargeTargetContainer}>
          <TouchableOpacity
            style={[
              styles.rechargeTargetOption,
              rechargeTarget === 'self' && styles.rechargeTargetSelected
            ]}
            onPress={() => setRechargeTarget('self')}
          >
            <User color={rechargeTarget === 'self' ? Colors.primary.main : Colors.grey[500]} size={20} />
            <Text style={[
              styles.rechargeTargetText,
              rechargeTarget === 'self' && styles.rechargeTargetTextSelected
            ]}>
              Moi-même
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.rechargeTargetOption,
              rechargeTarget === 'other' && styles.rechargeTargetSelected
            ]}
            onPress={() => setRechargeTarget('other')}
          >
            <UserPlus color={rechargeTarget === 'other' ? Colors.primary.main : Colors.grey[500]} size={20} />
            <Text style={[
              styles.rechargeTargetText,
              rechargeTarget === 'other' && styles.rechargeTargetTextSelected
            ]}>
              Autre personne
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Afficher le champ pour le numéro du bénéficiaire si "Autre personne" est sélectionné */}
        {rechargeTarget === 'other' && (
          <View style={styles.beneficiaryContainer}>
            <Text style={styles.rechargeInputLabel}>Numéro du bénéficiaire</Text>
            <TextInput
              style={styles.phoneInput}
              value={beneficiaryPhone}
              onChangeText={setBeneficiaryPhone}
              keyboardType="phone-pad"
              placeholder="Ex: 07XXXXXXXX"
              maxLength={10}
            />
          </View>
        )}
        
        {/* Recharges récentes (si disponible) */}
        {rechargeTarget === 'other' && RECENT_RECHARGES.length > 0 && (
          <View style={styles.recentRechargesContainer}>
            <Text style={styles.recentRechargesTitle}>Recharges récentes</Text>
            <ScrollView 
              style={styles.recentRechargesScroll} 
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {RECENT_RECHARGES.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.recentRechargeItem}
                  onPress={() => setBeneficiaryPhone(item.phone)}
                >
                  <View style={styles.recentRechargeDetails}>
                    <Text style={styles.recentRechargePhone}>{item.phone}</Text>
                    <Text style={styles.recentRechargeDate}>{item.date}</Text>
                  </View>
                  <Text style={styles.recentRechargeAmount}>{item.amount} FCFA</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
        {/* Bouton pour effectuer la recharge */}
        <TouchableOpacity
          style={[
            styles.rechargeActionButton,
            isProcessingRecharge && styles.rechargeActionButtonProcessing
          ]}
          onPress={processRecharge}
          disabled={isProcessingRecharge}
        >
          <Text style={styles.rechargeActionButtonText}>
            {isProcessingRecharge ? 'Traitement...' : 'Effectuer la Recharge'}
          </Text>
        </TouchableOpacity>
      </View>
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
          <Text style={styles.successTitle}>Paiement Réussi !</Text>
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
          <Text style={styles.summaryTitle}>Résumé de la Commande</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Forfait</Text>
            <Text style={styles.summaryValue}>{name}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Destinataire</Text>
            <Text style={styles.summaryValue}>
              {recipient === 'self' ? 'Moi-même' : 'Autre Personne'}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Montant Total</Text>
            <Text style={styles.totalValue}>{amountFCFA.toLocaleString()} FCFA</Text>
          </View>
        </View>
        
        {/* Méthodes de paiement */}
        <View style={styles.paymentMethodsCard}>
          <Text style={styles.paymentTitle}>Méthode de Paiement</Text>
          
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
              
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>{method.name}</Text>
                {method.id !== 'mobile_money' && (
                  <Text style={styles.methodFees}>{method.fees}</Text>
                )}
              </View>
              
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
        
        {/* Sélection du fournisseur (pour Mobile Money) avec fonctionnalité de recharge rapide */}
        {selectedMethod === 'mobile_money' && (
          <View style={styles.providersCard}>
            <Text style={styles.providersTitle}>Sélectionner un Fournisseur</Text>
            
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
                    <Text style={styles.providerFees}>{provider.fees}</Text>
                  </View>
                  
                  {selectedProvider === provider.id && (
                    <View style={styles.providerSelectedIndicator}>
                      <Check color={Colors.common.white} size={16} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.tapToRechargeHint}>
              Cliquez sur un logo pour recharger directement votre compte
            </Text>
          </View>
        )}
        
        {/* Saisie du numéro de téléphone Mobile Money */}
        {selectedMethod === 'mobile_money' && selectedProvider && (
          <View style={styles.phoneInputCard}>
            <Text style={styles.phoneInputTitle}>Entrez votre numéro {selectedProviderData?.name}</Text>
            
            <View style={styles.phoneInputContainer}>
              <TextInput
                style={styles.phoneInput}
                placeholder={`Numéro ${selectedProviderData?.name}`}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            
            <Text style={styles.phoneInputHelp}>
              Entrez le numéro de téléphone associé à votre compte {selectedProviderData?.name}
            </Text>

            {/* Bouton de recharge */}
            <TouchableOpacity 
              style={styles.rechargeButtonInline}
              onPress={handleRecharge}
            >
              <RefreshCw color={Colors.common.white} size={20} style={styles.rechargeIcon} />
              <Text style={styles.rechargeButtonText}>Recharger Mon Compte</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Messages de solde insuffisant */}
        {showInsufficientFunds && (
          <View style={styles.insufficientFundsCard}>
            <Text style={styles.insufficientFundsTitle}>Solde Insuffisant</Text>
            <Text style={styles.insufficientFundsText}>
              Votre compte n'a pas suffisamment de fonds pour effectuer cette transaction.
            </Text>
            
            <TouchableOpacity 
              style={styles.rechargeButton}
              onPress={handleRecharge}
            >
              <RefreshCw color={Colors.common.white} size={20} style={styles.rechargeIcon} />
              <Text style={styles.rechargeButtonText}>Recharger Maintenant</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Instructions de paiement */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Instructions de Paiement</Text>
          
          <View style={styles.instructionStep}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              {selectedMethod === 'wave' 
                ? 'Cliquez sur "Payer Maintenant" pour ouvrir l\'application Wave'
                : 'Cliquez sur "Payer Maintenant" pour initier le paiement'}
            </Text>
          </View>
          
          <View style={styles.instructionStep}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              {selectedMethod === 'wave'
                ? 'Confirmez le paiement dans l\'application Wave'
                : 'Vous recevrez une notification sur votre téléphone pour confirmer le paiement'}
            </Text>
          </View>
          
          <View style={styles.instructionStep}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              {selectedMethod === 'wave'
                ? 'Retournez sur cette application après confirmation'
                : 'Entrez votre code PIN pour autoriser la transaction'}
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Bouton de paiement */}
      <View style={styles.paymentButtonContainer}>
        {showInsufficientFunds ? (
          <TouchableOpacity 
            style={styles.rechargeButtonLarge}
            onPress={handleRecharge}
          >
            <Text style={styles.paymentButtonText}>Recharger Mon Compte</Text>
          </TouchableOpacity>
        ) : (
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
              {processingPayment 
                ? 'Traitement en cours...' 
                : selectedMethod === 'wave' 
                  ? 'Ouvrir Wave pour Payer' 
                  : 'Payer Maintenant'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal de recharge */}
      <Modal
        visible={isRechargeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeRechargeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContainer,
            { height: height * 0.85 }
          ]}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={closeRechargeModal}
            >
              <X color={Colors.text.primary} size={24} />
            </TouchableOpacity>
            
            {renderRechargeModalContent()}
          </View>
        </View>
      </Modal>
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
    paddingBottom: 100, // Pour tenir compte du bouton fixe en bas
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
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  methodFees: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
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
    justifyContent: 'space-between',
    marginHorizontal: -Layout.spacing.xs,
  },
  providerOption: {
    width: width < 400 ? '48%' : '30%',
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
    width: 50,
    height: 50,
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
  providerFees: {
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
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background.paper,
  },
  tapToRechargeHint: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: Layout.spacing.md,
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
    marginBottom: Layout.spacing.md,
  },
  rechargeButtonInline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary.main,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
    alignSelf: 'flex-start',
    marginTop: Layout.spacing.md,
  },
  insufficientFundsCard: {
    backgroundColor: Colors.error.light,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error.main,
  },
  insufficientFundsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.md,
    color: Colors.error.dark,
    marginBottom: Layout.spacing.sm,
  },
  insufficientFundsText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.error.dark,
    marginBottom: Layout.spacing.md,
  },
  rechargeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary.main,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
    alignSelf: 'flex-start',
  },
  rechargeIcon: {
    marginRight: Layout.spacing.sm,
  },
  rechargeButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.common.white,
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
  rechargeButtonLarge: {
    backgroundColor: Colors.secondary.main,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
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
  
  // Styles pour la modal de recharge
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.background.paper,
    borderTopLeftRadius: Layout.borderRadius.lg,
    borderTopRightRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    paddingTop: Layout.spacing.xl,
  },
  closeButton: {
    position: 'absolute',
    right: Layout.spacing.lg,
    top: Layout.spacing.lg,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rechargeModalContent: {
    paddingTop: Layout.spacing.md,
  },
  rechargeModalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.xl,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  feesInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.lg,
  },
  feesInfoText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.sm,
    color: Colors.primary.main,
    marginLeft: Layout.spacing.xs,
  },
  feesDetails: {
    backgroundColor: Colors.grey[100],
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
  },
  feesDetailsText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  rechargeInputLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.sm,
  },
  rechargeAmountInput: {
    borderWidth: 1,
    borderColor: Colors.grey[300],
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.lg, 
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  quickAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: Layout.spacing.xl,
  },
  quickAmountButton: {
    borderWidth: 1,
    borderColor: Colors.grey[300],
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    alignItems: 'center',
    width: width < 400 ? '48%' : '23%',
    marginBottom: Layout.spacing.sm,
  },
  quickAmountButtonSelected: {
    backgroundColor: Colors.primary.light,
    borderColor: Colors.primary.main,
  },
  quickAmountText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
  },
  quickAmountTextSelected: {
    color: Colors.primary.main,
  },
  quickAmountDisabled: {
    color: Colors.grey[400],
  },
  rechargeTargetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.xl,
  },
  rechargeTargetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.grey[300],
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    width: '48%',
  },
  rechargeTargetSelected: {
    backgroundColor: Colors.primary.light,
    borderColor: Colors.primary.main,
  },
  rechargeTargetText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginLeft: Layout.spacing.sm,
  },
  rechargeTargetTextSelected: {
    color: Colors.primary.main,
  },
  beneficiaryContainer: {
    marginBottom: Layout.spacing.lg,
  },
  recentRechargesContainer: {
    marginBottom: Layout.spacing.xl,
  },
  recentRechargesTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  recentRechargesScroll: {
    marginHorizontal: -Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.lg,
  },
  recentRechargeItem: {
    backgroundColor: Colors.grey[100],
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginRight: Layout.spacing.sm,
    width: 180,
  },
  recentRechargeDetails: {
    flex: 1,
  },
  recentRechargePhone: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  recentRechargeDate: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  recentRechargeAmount: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.primary.main,
    marginTop: Layout.spacing.sm,
  },
  rechargeActionButton: {
    backgroundColor: Colors.primary.main,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    marginTop: Layout.spacing.md,
  },
  rechargeActionButtonProcessing: {
    backgroundColor: Colors.secondary.main,
  },
  rechargeActionButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.common.white,
  },
  rechargeSuccessContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.xl * 2,
  },
  rechargeSuccessTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.h3,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  rechargeSuccessText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.lg,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  rechargeCloseButton: {
    backgroundColor: Colors.primary.main,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.xl,
    alignItems: 'center',
  },
  rechargeCloseButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.md,
    color: Colors.common.white,
  }
});