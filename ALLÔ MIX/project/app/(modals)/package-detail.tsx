import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  TextInput,
  Alert
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { X, Check, TriangleAlert as AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react-native';
import Header from '@/components/common/Header';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

// Données des forfaits en français
const PACKAGES = [
  {
    id: '1',
    name: 'Forfait Quotidien',
    operator: 'Orange',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png',
    data: '1 Go',
    calls: '10 min',
    sms: '10 SMS',
    validity: '1 jour',
    price: 1200,
    description: 'Internet rapide pour vos besoins quotidiens',
    popular: true,
    features: [
      'Navigation haute vitesse',
      'Accès aux réseaux sociaux',
      'Appels inclus limités',
      'SMS inclus limités'
    ],
    restrictions: [
      'Pas de streaming vidéo',
      'Non partageable'
    ]
  },
  {
    id: '2',
    name: 'Réseaux Sociaux Hebdo',
    operator: 'MTN',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/200px-MTN_Logo.svg.png',
    data: '3 Go',
    calls: '20 min',
    sms: '20 SMS',
    validity: '7 jours',
    price: 3000,
    description: 'Accès illimité aux réseaux sociaux',
    popular: false,
    features: [
      'Réseaux sociaux illimités',
      'Navigation haute vitesse',
      'Appels inclus limités',
      'SMS inclus limités'
    ],
    restrictions: [
      'Pas de streaming vidéo',
      'Non partageable'
    ]
  },
  {
    id: '3',
    name: 'Forfait Mensuel Max',
    operator: 'Orange',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png',
    data: '20 Go',
    calls: '100 min',
    sms: '100 SMS',
    validity: '30 jours',
    price: 10000,
    description: 'Notre meilleure offre mensuelle',
    popular: true,
    features: [
      'Navigation haute vitesse',
      'Streaming vidéo autorisé',
      'Minutes d\'appel généreuses',
      'SMS généreux',
      'Partageable avec 1 appareil'
    ],
    restrictions: [
      'Politique d\'usage équitable applicable'
    ]
  },
  {
    id: '4',
    name: 'Appels Illimités',
    operator: 'Moov',
    operatorLogo: 'https://seeklogo.com/images/M/moov-africa-logo-459FC30F68-seeklogo.com.png',
    data: '500 Mo',
    calls: 'Illimités',
    sms: '50 SMS',
    validity: '30 jours',
    price: 6000,
    description: 'Appels illimités vers tous les réseaux',
    popular: false,
    features: [
      'Appels illimités tous réseaux',
      'Data basique incluse',
      'SMS limités'
    ],
    restrictions: [
      'Politique d\'usage équitable',
      'Non partageable'
    ]
  },
  {
    id: '5',
    name: 'Partage Familial',
    operator: 'MTN',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/200px-MTN_Logo.svg.png',
    data: '50 Go',
    calls: '300 min',
    sms: '300 SMS',
    validity: '30 jours',
    price: 18000,
    description: 'Partagez avec jusqu\'à 5 membres',
    popular: true,
    features: [
      'Navigation haute vitesse',
      'Streaming vidéo autorisé',
      'Minutes d\'appel généreuses',
      'SMS généreux',
      'Partageable jusqu\'à 5 appareils'
    ],
    restrictions: [
      'Politique d\'usage équitable applicable'
    ]
  },
];

export default function PackageDetailScreen() {
  const { id } = useLocalSearchParams();
  const [showFeatures, setShowFeatures] = useState(true);
  const [showRestrictions, setShowRestrictions] = useState(true);
  const [recipient, setRecipient] = useState('self');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const packageData = PACKAGES.find(pkg => pkg.id === id);
  
  // Formatage des nombres en XOF
  const formatXOF = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' XOF';
  };

  // Fonction pour basculer l'affichage des caractéristiques
  const toggleFeatures = () => {
    setShowFeatures(!showFeatures);
  };

  // Fonction pour basculer l'affichage des restrictions
  const toggleRestrictions = () => {
    setShowRestrictions(!showRestrictions);
  };

  // Fonction pour gérer l'achat
  const handlePurchase = () => {
    if (recipient === 'other' && !phoneNumber) {
      Alert.alert(
        "Numéro manquant",
        "Veuillez entrer un numéro de téléphone pour le bénéficiaire.",
        [{ text: "OK" }]
      );
      return;
    }
    
    // Naviguer vers la page de paiement avec les détails du forfait et du bénéficiaire
    router.push({
      pathname: '/payment',
      params: {
        packageId: packageData.id,
        recipient: recipient,
        phoneNumber: recipient === 'other' ? phoneNumber : 'self'
      }
    });
  };

  // Fonction pour naviguer vers la page de la carte
  const viewCard = () => {
    router.push({
      pathname: '/card',
      params: {
        packageId: packageData.id
      }
    });
  };

  if (!packageData) {
    return (
      <View style={styles.container}>
        <Header title="Détails du forfait" showBack />
        <View style={styles.errorContainer}>
          <AlertTriangle color={Colors.error.main} size={48} />
          <Text style={styles.errorText}>Forfait non trouvé</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Détails du forfait" showBack />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* En-tête du forfait */}
        <View style={styles.packageHeader}>
          <View style={styles.operatorLogoContainer}>
            <Image 
              source={{ uri: packageData.operatorLogo }} 
              style={styles.operatorLogo}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.packageTitleContainer}>
            <Text style={styles.packageName}>{packageData.name}</Text>
            <Text style={styles.operatorName}>{packageData.operator}</Text>
          </View>
          
          {packageData.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Populaire</Text>
            </View>
          )}
        </View>
        
        {/* Détails du forfait */}
        <View style={styles.detailsCard}>
          <Text style={styles.descriptionText}>{packageData.description}</Text>
          
          <View style={styles.featureGrid}>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>{packageData.data}</Text>
              <Text style={styles.featureLabel}>Internet</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>{packageData.calls}</Text>
              <Text style={styles.featureLabel}>Appels</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>{packageData.sms}</Text>
              <Text style={styles.featureLabel}>SMS</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>{packageData.validity}</Text>
              <Text style={styles.featureLabel}>Validité</Text>
            </View>
          </View>
          
          {/* Bouton pour voir la carte */}
          <TouchableOpacity 
            style={styles.viewCardButton}
            onPress={viewCard}
          >
            <Text style={styles.viewCardText}>Voir la carte</Text>
          </TouchableOpacity>
          
          {/* Caractéristiques */}
          <TouchableOpacity 
            style={styles.accordionHeader}
            onPress={toggleFeatures}
          >
            <Text style={styles.accordionTitle}>Caractéristiques</Text>
            {showFeatures ? (
              <ChevronUp color={Colors.text.primary} size={20} />
            ) : (
              <ChevronDown color={Colors.text.primary} size={20} />
            )}
          </TouchableOpacity>
          
          {showFeatures && (
            <View style={styles.featuresList}>
              {packageData.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Check color={Colors.success.main} size={16} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Restrictions */}
          <TouchableOpacity 
            style={styles.accordionHeader}
            onPress={toggleRestrictions}
          >
            <Text style={styles.accordionTitle}>Restrictions</Text>
            {showRestrictions ? (
              <ChevronUp color={Colors.text.primary} size={20} />
            ) : (
              <ChevronDown color={Colors.text.primary} size={20} />
            )}
          </TouchableOpacity>
          
          {showRestrictions && (
            <View style={styles.featuresList}>
              {packageData.restrictions.map((restriction, index) => (
                <View key={index} style={styles.featureRow}>
                  <X color={Colors.error.main} size={16} />
                  <Text style={styles.restrictionText}>{restriction}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Choix du bénéficiaire */}
        <View style={styles.recipientCard}>
          <Text style={styles.recipientTitle}>Choisir le bénéficiaire</Text>
          <View style={styles.recipientOptions}>
            <TouchableOpacity 
              style={[styles.recipientOption, recipient === 'self' && styles.activeRecipientOption]}
              onPress={() => setRecipient('self')}
            >
              <Text style={[styles.recipientOptionText, recipient === 'self' && styles.activeRecipientOptionText]}>
                Pour moi-même
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.recipientOption, recipient === 'other' && styles.activeRecipientOption]}
              onPress={() => setRecipient('other')}
            >
              <Text style={[styles.recipientOptionText, recipient === 'other' && styles.activeRecipientOptionText]}>
                Pour quelqu'un d'autre
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Champ pour entrer le numéro de téléphone si "Pour quelqu'un d'autre" est sélectionné */}
          {recipient === 'other' && (
            <View style={styles.phoneInputContainer}>
              <Text style={styles.phoneInputLabel}>Numéro du bénéficiaire</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="Ex: +225 XX XX XX XX XX"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Barre d'achat */}
      <View style={styles.purchaseBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Prix</Text>
          <Text style={styles.priceValue}>{formatXOF(packageData.price)}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.purchaseButton}
          onPress={handlePurchase}
        >
          <Text style={styles.purchaseButtonText}>Acheter maintenant</Text>
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.xl,
  },
  errorText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
  },
  backButton: {
    backgroundColor: Colors.secondary.main,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.xl,
    borderRadius: Layout.borderRadius.md,
  },
  backButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.common.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: 100, // To account for the fixed bottom bar
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Layout.spacing.lg,
  },
  operatorLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.background.paper,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.sm,
    marginRight: Layout.spacing.md,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  operatorLogo: {
    width: '100%',
    height: '100%',
  },
  packageTitleContainer: {
    flex: 1,
  },
  packageName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.xl,
    color: Colors.text.primary,
  },
  operatorName: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  popularBadge: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  popularText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.sm,
    color: Colors.primary.contrastText,
  },
  detailsCard: {
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
  descriptionText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.lg,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
    paddingBottom: Layout.spacing.lg,
  },
  featureItem: {
    width: '50%',
    marginBottom: Layout.spacing.md,
  },
  featureValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
  },
  featureLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  viewCardButton: {
    backgroundColor: Colors.secondary.light,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.lg,
  },
  viewCardText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.secondary.main,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  accordionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  featuresList: {
    paddingVertical: Layout.spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  featureText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginLeft: Layout.spacing.sm,
  },
  restrictionText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginLeft: Layout.spacing.sm,
  },
  recipientCard: {
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
  recipientTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  recipientOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  recipientOption: {
    flex: 1,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.grey[300],
    marginHorizontal: Layout.spacing.xs,
  },
  activeRecipientOption: {
    backgroundColor: Colors.primary.light,
    borderColor: Colors.primary.main,
  },
  recipientOptionText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  activeRecipientOptionText: {
    color: Colors.primary.main,
  },
  phoneInputContainer: {
    marginTop: Layout.spacing.md,
  },
  phoneInputLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.sm,
  },
  phoneInput: {
    backgroundColor: Colors.background.default,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.grey[300],
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  purchaseBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.paper,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  priceValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xl,
    color: Colors.text.primary,
  },
  purchaseButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.xl,
    borderRadius: Layout.borderRadius.md,
  },
  purchaseButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.md,
    color: Colors.primary.contrastText,
  },
});