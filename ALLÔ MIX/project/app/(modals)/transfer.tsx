import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { ArrowRight, ChevronDown, QrCode, RefreshCw } from 'lucide-react-native';
import Header from '@/components/common/Header';
import Colors from '@/constants/Colors';
import FontSizes from '@/constants/FontSizes';
import Layout from '@/constants/Layout';

const { width } = Dimensions.get('window');

const OPERATORS = [
  { id: 'wave', name: 'Wave', logo: require('../../assets/images/wave.jpeg'), color: '#00B8D4' },
  { id: 'orange', name: 'Orange Money', logo: require('../../assets/images/orange.png'), color: '#FF6600' },
  { id: 'moov', name: 'Moov Money', logo: require('../../assets/images/moov.png'), color: '#0066CC' },
  { id: 'mtn', name: 'MTN Mobile Money', logo: require('../../assets/images/mtn.png'), color: '#FFCC00' },
  { id: 'crypto', name: 'Crypto Wallet', logo: require('../../assets/images/crypto.jpeg'), color: '#F7931A' },
];

interface Operator {
  id: string;
  name: string;
  logo: any;
  color: string;
}

export default function MoneyTransferScreen() {
  const [amount, setAmount] = useState('');
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [selectedOperatorFrom, setSelectedOperatorFrom] = useState<Operator | null>(null);
  const [selectedOperatorTo, setSelectedOperatorTo] = useState<Operator | null>(null);
  const [showOperatorsFrom, setShowOperatorsFrom] = useState(false);
  const [showOperatorsTo, setShowOperatorsTo] = useState(false);

  const handleTransfer = () => {
    if (!amount || !sender || !receiver || !selectedOperatorFrom || !selectedOperatorTo) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const queryParams = new URLSearchParams({
      amount,
      sender,
      receiver,
      operatorFrom: selectedOperatorFrom.id,
      operatorTo: selectedOperatorTo.id,
    }).toString();

    router.push(`/transfer-confirmation?${queryParams}`);
  };

  const swapOperators = () => {
    const temp = selectedOperatorFrom;
    setSelectedOperatorFrom(selectedOperatorTo);
    setSelectedOperatorTo(temp);
  };

  const formatAmount = (text: string) => {
    const numericValue = text.replace(/\D/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatAmount(text);
    setAmount(formatted);
  };

  const calculateTotal = () => {
    if (!amount) return 0;
    const numericAmount = parseInt(amount.replace(/\D/g, ''));
    return numericAmount + 500;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header title="Transfert d'argent" showBack />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Card principale pour les opérateurs */}
        <View style={styles.operatorsCard}>
          <Text style={styles.cardTitle}>Sélection des opérateurs</Text>
          
          <View style={styles.operatorsContainer}>
            {/* Opérateur source */}
            <View style={styles.operatorSelector}>
              <Text style={styles.operatorLabel}>De</Text>
              
              <TouchableOpacity 
                style={[
                  styles.operatorButton,
                  selectedOperatorFrom && { borderColor: selectedOperatorFrom.color, borderWidth: 2 }
                ]}
                onPress={() => setShowOperatorsFrom(!showOperatorsFrom)}
                activeOpacity={0.7}
              >
                {selectedOperatorFrom ? (
                  <View style={styles.selectedOperator}>
                    <View style={[styles.logoContainer, { backgroundColor: selectedOperatorFrom.color + '20' }]}>
                      <Image 
                        source={selectedOperatorFrom.logo} 
                        style={styles.operatorLogo} 
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.operatorInfo}>
                      <Text style={styles.operatorName}>{selectedOperatorFrom.name}</Text>
                      <Text style={styles.operatorSubtext}>Source</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.placeholderContainer}>
                    <View style={styles.placeholderIcon}>
                      <Text style={styles.placeholderIconText}>?</Text>
                    </View>
                    <Text style={styles.operatorPlaceholder}>Choisir</Text>
                  </View>
                )}
                <ChevronDown 
                  color={selectedOperatorFrom ? selectedOperatorFrom.color : Colors.grey[400]} 
                  size={20} 
                />
              </TouchableOpacity>

              {showOperatorsFrom && (
                <View style={styles.operatorDropdown}>
                  {OPERATORS.map(operator => (
                    <TouchableOpacity
                      key={`from-${operator.id}`}
                      style={styles.operatorItem}
                      onPress={() => {
                        setSelectedOperatorFrom(operator);
                        setShowOperatorsFrom(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.logoContainer, { backgroundColor: operator.color + '20' }]}>
                        <Image 
                          source={operator.logo} 
                          style={styles.operatorLogo} 
                          resizeMode="contain"
                        />
                      </View>
                      <Text style={styles.operatorName}>{operator.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Bouton d'échange */}
            <TouchableOpacity style={styles.swapButton} onPress={swapOperators} activeOpacity={0.7}>
              <RefreshCw color={Colors.primary.main} size={20} />
            </TouchableOpacity>

            {/* Opérateur destination */}
            <View style={styles.operatorSelector}>
              <Text style={styles.operatorLabel}>Vers</Text>
              
              <TouchableOpacity 
                style={[
                  styles.operatorButton,
                  selectedOperatorTo && { borderColor: selectedOperatorTo.color, borderWidth: 2 }
                ]}
                onPress={() => setShowOperatorsTo(!showOperatorsTo)}
                activeOpacity={0.7}
              >
                {selectedOperatorTo ? (
                  <View style={styles.selectedOperator}>
                    <View style={[styles.logoContainer, { backgroundColor: selectedOperatorTo.color + '20' }]}>
                      <Image 
                        source={selectedOperatorTo.logo} 
                        style={styles.operatorLogo} 
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.operatorInfo}>
                      <Text style={styles.operatorName}>{selectedOperatorTo.name}</Text>
                      <Text style={styles.operatorSubtext}>Destination</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.placeholderContainer}>
                    <View style={styles.placeholderIcon}>
                      <Text style={styles.placeholderIconText}>?</Text>
                    </View>
                    <Text style={styles.operatorPlaceholder}>Choisir</Text>
                  </View>
                )}
                <ChevronDown 
                  color={selectedOperatorTo ? selectedOperatorTo.color : Colors.grey[400]} 
                  size={20} 
                />
              </TouchableOpacity>

              {showOperatorsTo && (
                <View style={styles.operatorDropdown}>
                  {OPERATORS.map(operator => (
                    <TouchableOpacity
                      key={`to-${operator.id}`}
                      style={styles.operatorItem}
                      onPress={() => {
                        setSelectedOperatorTo(operator);
                        setShowOperatorsTo(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.logoContainer, { backgroundColor: operator.color + '20' }]}>
                        <Image 
                          source={operator.logo} 
                          style={styles.operatorLogo} 
                          resizeMode="contain"
                        />
                      </View>
                      <Text style={styles.operatorName}>{operator.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Card du montant */}
        <View style={styles.amountCard}>
          <Text style={styles.cardTitle}>Montant du transfert</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>XOF</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              keyboardType="numeric"
              value={amount}
              onChangeText={handleAmountChange}
              placeholderTextColor={Colors.grey[400]}
            />
          </View>
          {amount ? (
            <Text style={styles.amountWords}>
              {parseInt(amount.replace(/\D/g, '')) < 1000000 ? 
                `${(parseInt(amount.replace(/\D/g, '')) / 1000).toFixed(0)}K FCFA` : 
                `${(parseInt(amount.replace(/\D/g, '')) / 1000000).toFixed(1)}M FCFA`
              }
            </Text>
          ) : null}
        </View>

        {/* Card des informations */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Informations du transfert</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Numéro expéditeur</Text>
            <View style={styles.phoneInputContainer}>
              <TextInput
                style={styles.phoneInput}
                placeholder="+225 XX XX XX XX XX"
                keyboardType="phone-pad"
                value={sender}
                onChangeText={setSender}
                placeholderTextColor={Colors.grey[400]}
              />
              <TouchableOpacity style={styles.qrButton} activeOpacity={0.7}>
                <QrCode color={Colors.primary.main} size={18} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Numéro destinataire</Text>
            <View style={styles.phoneInputContainer}>
              <TextInput
                style={styles.phoneInput}
                placeholder="+225 XX XX XX XX XX"
                keyboardType="phone-pad"
                value={receiver}
                onChangeText={setReceiver}
                placeholderTextColor={Colors.grey[400]}
              />
              <TouchableOpacity style={styles.qrButton} activeOpacity={0.7}>
                <QrCode color={Colors.primary.main} size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Card récapitulatif */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Récapitulatif</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Montant</Text>
            <Text style={styles.summaryValue}>
              {amount ? `${amount} XOF` : '0 XOF'}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frais de transfert</Text>
            <Text style={styles.summaryValue}>500 XOF</Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total à débiter</Text>
            <Text style={styles.totalValue}>
              {calculateTotal().toLocaleString('fr-FR')} XOF
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bouton de transfert flottant */}
      <View style={styles.transferButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.transferButton,
            (!amount || !sender || !receiver || !selectedOperatorFrom || !selectedOperatorTo) && 
            styles.disabledButton
          ]}
          onPress={handleTransfer}
          disabled={!amount || !sender || !receiver || !selectedOperatorFrom || !selectedOperatorTo}
          activeOpacity={0.8}
        >
          <Text style={styles.transferButtonText}>Effectuer le transfert</Text>
          <ArrowRight color={Colors.primary.contrastText} size={20} style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey[50],
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: Layout.spacing.md,
    paddingBottom: 120,
  },
  
  // Cards
  operatorsCard: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amountCard: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCard: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryCard: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  
  // Opérateurs
  operatorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  operatorSelector: {
    flex: 1,
    maxWidth: (width - 100) / 2,
  },
  operatorLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
    textAlign: 'center',
  },
  operatorButton: {
    backgroundColor: Colors.background.default,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.grey[200],
    minHeight: 80,
    justifyContent: 'space-between',
  },
  selectedOperator: {
    alignItems: 'center',
    flex: 1,
  },
  placeholderContainer: {
    alignItems: 'center',
    flex: 1,
  },
  placeholderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.grey[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  placeholderIconText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.lg,
    color: Colors.grey[400],
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  operatorLogo: {
    width: 30,
    height: 30,
  },
  operatorInfo: {
    alignItems: 'center',
  },
  operatorName: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.sm,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  operatorSubtext: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  operatorPlaceholder: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.grey[400],
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.main + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Layout.spacing.sm,
  },
  operatorDropdown: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.grey[200],
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  operatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[100],
  },
  
  // Montant
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey[50],
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderWidth: 2,
    borderColor: Colors.primary.main + '30',
  },
  currencySymbol: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.xl,
    color: Colors.primary.main,
    marginRight: Layout.spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xxl,
    color: Colors.text.primary,
    textAlign: 'right',
  },
  amountWords: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Layout.spacing.xs,
  },
  
  // Inputs
  inputGroup: {
    marginBottom: Layout.spacing.lg,
  },
  inputLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey[50],
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.grey[200],
  },
  phoneInput: {
    flex: 1,
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    paddingVertical: Layout.spacing.md,
  },
  qrButton: {
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
    backgroundColor: Colors.primary.main + '20',
  },
  
  // Récapitulatif
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
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
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
    paddingTop: Layout.spacing.md,
    marginTop: Layout.spacing.sm,
  },
  totalLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
  },
  totalValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.lg,
    color: Colors.primary.main,
  },
  
  // Bouton de transfert
  transferButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Layout.spacing.lg,
    backgroundColor: Colors.background.default,
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
  },
  transferButton: {
    backgroundColor: Colors.primary.main,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: Colors.grey[300],
    shadowOpacity: 0,
    elevation: 0,
  },
  transferButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.primary.contrastText,
    marginRight: Layout.spacing.sm,
  },
  buttonIcon: {
    marginLeft: Layout.spacing.xs,
  },
});