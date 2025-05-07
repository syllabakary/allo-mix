import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout } from '../constants/Theme';

export default function RechargeScreen() {
  const [selectedMethod, setSelectedMethod] = useState('mobile_money');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState(5000);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAmountSelector, setShowAmountSelector] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Prix du produit (simulé)
  const productPrice = 12000;
  
  // Méthodes de paiement disponibles
  const PAYMENT_METHODS = [
    {
      id: 'mobile_money',
      name: 'Mobile Money',
      icon: 'phone-portrait',
      color: '#3B82F6',
      providers: [
        {
          id: 'orange',
          name: 'Orange Money',
          // logo: require('../assets/images/orange-logo.png'),
          color: '#FF7900'
        },
        {
          id: 'mtn',
          name: 'MTN Mobile Money',
          // logo: require('../assets/images/mtn-logo.png'),
          color: '#FFCC00'
        },
        {
          id: 'moov',
          name: 'Moov Money',
          // logo: require('../assets/images/moov-logo.png'),
          color: '#0096FF'
        }
      ]
    },
    {
      id: 'wave',
      name: 'Wave',
      icon: 'wallet',
      color: '#14B8A6',
      providers: []
    },
    {
      id: 'card',
      name: 'Carte Bancaire',
      icon: 'card',
      color: '#9333EA',
      providers: []
    },
    {
      id: 'crypto',
      name: 'Cryptomonnaie',
      icon: 'logo-bitcoin',
      color: '#F59E0B',
      providers: []
    }
  ];

  // Trouver la méthode sélectionnée
  const selectedMethodData = PAYMENT_METHODS.find(method => method.id === selectedMethod);
  
  // Gérer la sélection d'un fournisseur
  const handleSelectProvider = (provider) => {
    setSelectedProvider(provider);
    setShowAmountSelector(true);
  };
  
  // Gérer le changement de montant
  const handleAmountChange = (newAmount) => {
    setAmount(newAmount);
  };
  
  // Simuler un paiement
  const processPayment = () => {
    setProcessing(true);
    
    // Simuler un délai de traitement
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      
      // Réinitialiser après quelques secondes
      setTimeout(() => {
        setShowPaymentModal(false);
        setSuccess(false);
      }, 2000);
    }, 2000);
  };
  
  // Simuler une redirection vers l'application correspondante
  const redirectToApp = () => {
    Alert.alert(`Redirection vers l'application ${selectedProvider?.name || selectedMethodData?.name}`);
    setShowAmountSelector(false);
    setShowPaymentModal(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Paiement Sécurisé</Text>
          <View style={styles.securityBadge}>
            <View style={styles.securityIcon}>
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
            <Text style={styles.securityText}>Sécurisé à 100%</Text>
          </View>
        </View>
      </View>
      
      {/* Contenu principal */}
      <View style={styles.content}>
        {/* Carte récapitulative */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Récapitulatif de la commande</Text>
          
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Forfait Premium</Text>
            <Text style={styles.rowValue}>Internet Illimité</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Durée</Text>
            <Text style={styles.rowValue}>30 jours</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Montant Total</Text>
            <Text style={styles.totalValue}>{productPrice.toLocaleString()} FCFA</Text>
          </View>
        </View>
        
        {/* Méthodes de paiement */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>Choisir votre mode de paiement</Text>
          </View>
          
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity 
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedMethod === method.id && styles.selectedPaymentMethod
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={[styles.methodIcon, { backgroundColor: method.color }]}>
                <Ionicons name={method.icon} size={20} color="white" />
              </View>
              
              <Text style={styles.methodName}>{method.name}</Text>
              
              {selectedMethod === method.id ? (
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark" size={12} color="white" />
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Fournisseurs (pour Mobile Money) */}
        {selectedMethod === 'mobile_money' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle}>Sélectionner votre opérateur</Text>
            </View>
            
            <View style={styles.providersGrid}>
              {selectedMethodData.providers.map((provider) => (
                <TouchableOpacity
                  key={provider.id}
                  style={[
                    styles.providerCard,
                    selectedProvider?.id === provider.id && styles.selectedProviderCard
                  ]}
                  onPress={() => handleSelectProvider(provider)}
                >
                  <View style={styles.providerLogo}>
                    <Image 
                      source={provider.logo} 
                      style={{ width: 40, height: 40, resizeMode: 'contain' }} 
                    />
                  </View>
                  <Text style={styles.providerName}>{provider.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={18} color="#1E40AF" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                Cliquez sur un logo pour recharger votre compte ou effectuer un paiement via l'application correspondante
              </Text>
            </View>
          </View>
        )}
        
        {/* Choix de montant */}
        {selectedMethod !== 'mobile_money' && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle}>Paiement via {selectedMethodData?.name}</Text>
            </View>
            
            <View style={styles.paymentContent}>
              <View style={[styles.bigMethodIcon, { backgroundColor: method.color }]}>
                <Ionicons name={selectedMethodData?.icon} size={32} color="white" />
              </View>
              
              <Text style={styles.paymentInstructions}>
                Cliquez sur "Payer maintenant" pour être redirigé vers l'application {selectedMethodData?.name}
              </Text>
              
              <TouchableOpacity 
                style={styles.payButton}
                onPress={() => redirectToApp()}
              >
                <Text style={styles.payButtonText}>Payer maintenant</Text>
                <Ionicons name="arrow-forward" size={18} color="white" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {/* Bouton de paiement */}
        {!showAmountSelector && selectedMethod === 'mobile_money' && !selectedProvider && (
          <TouchableOpacity 
            style={styles.payButton}
            onPress={() => setShowPaymentModal(true)}
          >
            <Text style={styles.payButtonText}>Payer maintenant</Text>
            <Ionicons name="arrow-forward" size={18} color="white" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Modal de sélection de montant */}
      <Modal
        visible={showAmountSelector}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rechargement {selectedProvider?.name}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowAmountSelector(false)}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Montant à recharger</Text>
              <TextInput
                style={styles.input}
                value={amount.toString()}
                onChangeText={(text) => setAmount(parseInt(text) || 0)}
                keyboardType="numeric"
                placeholder="Entrez le montant"
              />
              
              <View style={styles.amountGrid}>
                {[5000, 10000, 15000, 20000].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    style={[
                      styles.amountButton,
                      amount === amt && styles.selectedAmountButton
                    ]}
                    onPress={() => handleAmountChange(amt)}
                  >
                    <Text 
                      style={[
                        styles.amountButtonText,
                        amount === amt && styles.selectedAmountButtonText
                      ]}
                    >
                      {amt.toLocaleString()} FCFA
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowAmountSelector(false)}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.confirmButton}
                  onPress={redirectToApp}
                >
                  <Text style={styles.confirmButtonText}>Confirmer</Text>
                  <Ionicons name="arrow-forward" size={16} color="white" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Modal de paiement */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Paiement</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            {success ? (
              <View style={styles.successContent}>
                <View style={styles.successIcon}>
                  <Ionicons name="checkmark" size={36} color="white" />
                </View>
                <Text style={styles.successTitle}>Paiement Réussi!</Text>
                <Text style={styles.successMessage}>
                  Votre transaction a été traitée avec succès.
                </Text>
              </View>
            ) : (
              <View style={styles.modalBody}>
                <Text style={styles.inputLabel}>Numéro de téléphone</Text>
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholder="Entrez votre numéro"
                />
                
                <View style={styles.warningBox}>
                  <Ionicons name="warning" size={18} color="#B45309" style={{ marginRight: 8 }} />
                  <Text style={styles.warningText}>
                    Assurez-vous d'avoir un solde suffisant sur votre compte mobile money pour effectuer cette transaction.
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={[
                    styles.processButton,
                    (!phoneNumber || processing) && styles.disabledButton
                  ]}
                  onPress={processPayment}
                  disabled={processing || !phoneNumber}
                >
                  {processing ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
                      <Text style={styles.processButtonText}>Traitement en cours...</Text>
                    </View>
                  ) : (
                    <View style={styles.buttonContent}>
                      <Text style={styles.processButtonText}>
                        Payer {productPrice.toLocaleString()} FCFA
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color="white" style={{ marginLeft: 8 }} />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 4,
    marginRight: 6,
  },
  securityText: {
    color: 'white',
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rowLabel: {
    color: '#6B7280',
  },
  rowValue: {
    color: '#1F2937',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  cardHeader: {
    backgroundColor: '#111827',
    padding: 16,
  },
  cardHeaderTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentMethod: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedPaymentMethod: {
    backgroundColor: '#EFF6FF',
  },
  methodIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  methodName: {
    flex: 1,
    color: '#1F2937',
    fontWeight: '500',
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  providerCard: {
    width: '33%',
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    margin: 0,
  },
  selectedProviderCard: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  providerLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  providerName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    color: '#1F2937',
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#1E40AF',
  },
  paymentContent: {
    padding: 24,
    alignItems: 'center',
  },
  bigMethodIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  paymentInstructions: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 16,
  },
  payButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  payButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: '#2563EB',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    padding: 4,
    borderRadius: 50,
  },
  modalBody: {
    padding: 24,
  },
  inputLabel: {
    color: '#4B5563',
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  amountButton: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    margin: '1%',
    alignItems: 'center',
  },
  selectedAmountButton: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  amountButtonText: {
    color: '#4B5563',
  },
  selectedAmountButtonText: {
    color: '#1E40AF',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    borderRadius: 4,
    padding: 12,
    marginBottom: 24,
    flexDirection: 'row',
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
  },
  processButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  processButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successContent: {
    padding: 32,
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
  },
  successMessage: {
    color: '#6B7280',
    textAlign: 'center',
  }
});