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
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { ArrowRight, ChevronDown, QrCode } from 'lucide-react-native';
import Header from '@/components/common/Header';
import Colors from '@/constants/Colors';
import FontSizes from '@/constants/FontSizes';
import Layout from '@/constants/Layout';

const OPERATORS = [
   { id: 'wave', name: 'Wave', logo: require('../../assets/images/wave.jpeg') },
  { id: 'orange', name: 'Orange Money', logo: require('../../assets/images/orange.png') },
  { id: 'moov', name: 'Moov Money', logo: require('../../assets/images/moov.png') },
  { id: 'mtn', name: 'MTN Mobile Money', logo: require('../../assets/images/mtn.png') },
  { id: 'crypto', name: 'Crypto Wallet', logo: require('../../assets/images/crypto.jpeg') },
];

interface Operator {
  id: string;
  name: string;
  logo: any;
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
      >
        {/* Sélection des opérateurs */}
        <View style={styles.operatorsContainer}>
          <View style={styles.operatorSelector}>
            <Text style={styles.sectionTitle}>De</Text>
            
            <TouchableOpacity 
              style={styles.operatorButton}
              onPress={() => setShowOperatorsFrom(!showOperatorsFrom)}
            >
              {selectedOperatorFrom ? (
                <View style={styles.selectedOperator}>
                  <Image 
                    source={selectedOperatorFrom.logo} 
                    style={styles.operatorLogo} 
                  />
                  <Text style={styles.operatorName}>{selectedOperatorFrom.name}</Text>
                </View>
              ) : (
                <Text style={styles.operatorPlaceholder}>Sélectionner un opérateur</Text>
              )}
              <ChevronDown color={Colors.text.primary} size={20} />
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
                  >
                    <Image source={operator.logo} style={styles.operatorLogo} />
                    <Text style={styles.operatorName}>{operator.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.transferArrow}>
            <ArrowRight color={Colors.primary.main} size={24} />
          </View>

          <View style={styles.operatorSelector}>
            <Text style={styles.sectionTitle}>À</Text>
            
            <TouchableOpacity 
              style={styles.operatorButton}
              onPress={() => setShowOperatorsTo(!showOperatorsTo)}
            >
              {selectedOperatorTo ? (
                <View style={styles.selectedOperator}>
                  <Image 
                    source={selectedOperatorTo.logo} 
                    style={styles.operatorLogo} 
                  />
                  <Text style={styles.operatorName}>{selectedOperatorTo.name}</Text>
                </View>
              ) : (
                <Text style={styles.operatorPlaceholder}>Sélectionner un opérateur</Text>
              )}
              <ChevronDown color={Colors.text.primary} size={20} />
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
                  >
                    <Image source={operator.logo} style={styles.operatorLogo} />
                    <Text style={styles.operatorName}>{operator.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Formulaire de transfert */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Montant à transférer</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>XOF</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor={Colors.grey[500]}
            />
          </View>

          <Text style={styles.sectionTitle}>Numéro de l'expéditeur</Text>
          <View style={styles.phoneInputContainer}>
            <TextInput
              style={styles.phoneInput}
              placeholder="Ex: +225 XX XX XX XX XX"
              keyboardType="phone-pad"
              value={sender}
              onChangeText={setSender}
              placeholderTextColor={Colors.grey[500]}
            />
            <TouchableOpacity style={styles.qrButton}>
              <QrCode color={Colors.primary.main} size={20} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Numéro du bénéficiaire</Text>
          <View style={styles.phoneInputContainer}>
            <TextInput
              style={styles.phoneInput}
              placeholder="Ex: +225 XX XX XX XX XX"
              keyboardType="phone-pad"
              value={receiver}
              onChangeText={setReceiver}
              placeholderTextColor={Colors.grey[500]}
            />
            <TouchableOpacity style={styles.qrButton}>
              <QrCode color={Colors.primary.main} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Frais et total */}
        <View style={styles.feesContainer}>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Frais de transfert</Text>
            <Text style={styles.feeValue}>500 XOF</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Total à débiter</Text>
            <Text style={styles.feeTotal}>
              {amount ? (parseInt(amount.replace(/\D/g, '')) + 500).toLocaleString('fr-FR') : '0'} XOF
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bouton de transfert */}
      <View style={styles.transferButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.transferButton,
            (!amount || !sender || !receiver || !selectedOperatorFrom || !selectedOperatorTo) && 
            styles.disabledButton
          ]}
          onPress={handleTransfer}
          disabled={!amount || !sender || !receiver || !selectedOperatorFrom || !selectedOperatorTo}
        >
          <Text style={styles.transferButtonText}>Effectuer le transfert</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    padding: Layout.spacing.lg,
    paddingBottom: 100,
  },
  operatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  operatorSelector: {
    flex: 1,
  },
  transferArrow: {
    marginHorizontal: Layout.spacing.sm,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.sm,
  },
  operatorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.grey[300],
  },
  selectedOperator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  operatorPlaceholder: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.grey[500],
  },
  operatorDropdown: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.grey[200],
    zIndex: 10,
    elevation: 5,
  },
  operatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[100],
  },
  operatorLogo: {
    width: 30,
    height: 30,
    marginRight: Layout.spacing.sm,
  },
  operatorName: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  formContainer: {
    marginBottom: Layout.spacing.xl,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.grey[300],
  },
  currencySymbol: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.xl,
    color: Colors.text.primary,
    marginRight: Layout.spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.xl,
    color: Colors.text.primary,
    paddingVertical: Layout.spacing.md,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.grey[300],
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
  },
  feesContainer: {
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  feeLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  feeValue: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  feeTotal: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.primary.main,
  },
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
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.grey[300],
  },
  transferButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.md,
    color: Colors.primary.contrastText,
  },
});
