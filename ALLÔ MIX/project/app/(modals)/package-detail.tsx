import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  TextInput,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { X, Check, TriangleAlert as AlertTriangle, ChevronDown, ChevronUp, Wifi, Phone, Clock, Zap } from 'lucide-react-native';
import Header from '@/components/common/Header';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

const { width } = Dimensions.get('window');

// Même interface Package que dans votre fichier principal
interface Package {
  id: string;
  name: string;
  operator: string;
  data: string;
  validity: string;
  price: number;
  description: string;
  popular: boolean;
  type: string;
  category: 'internet' | 'appels' | 'mixte';
  bonus?: string;
  color: string;
}

// Même tableau PACKAGES que dans votre fichier principal

// Données complètes des forfaits avec détails étendus
const PACKAGES = [
  // ORANGE CI - Forfaits réels
  {
    id: '1',
    name: 'Orange Internet 24h',
    operator: 'Orange',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png',
    data: '1.5Go',
    calls: '0 min',
    sms: '0 SMS',
    validity: '24h',
    price: 500,
    description: '1,5Go + 100Mo offerts entre 00h-06h pour navigation rapide',
    popular: true,
    type: 'Internet',
    category: 'internet',
    bonus: '100Mo nuit gratuit',
    color: '#FF6600',
    features: [
      'Navigation haute vitesse 4G',
      'Bonus 100Mo nuit (00h-06h)',
      'Accès réseaux sociaux',
      'Compatible partage de connexion',
      'Valable 24h après activation'
    ],
    restrictions: [
      'Pas d\'appels inclus',
      'Pas de SMS inclus',
      'Usage limité à 24h',
      'Bonus nuit non cumulable'
    ]
  },
  {
    id: '2',
    name: 'Orange Internet 7J',
    operator: 'Orange',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png',
    data: '3Go',
    calls: '0 min',
    sms: '0 SMS',
    validity: '7 jours',
    price: 1500,
    description: '3Go Internet valable 7 jours pour vos besoins hebdomadaires',
    popular: false,
    type: 'Internet',
    category: 'internet',
    color: '#FF6600',
    features: [
      'Navigation haute vitesse 4G',
      'Accès complet internet',
      'Compatible tous appareils',
      'Partage de connexion autorisé',
      'Validité 7 jours'
    ],
    restrictions: [
      'Pas d\'appels inclus',
      'Pas de SMS inclus',
      'Non renouvelable automatiquement',
      'Usage strictement internet'
    ]
  },
  {
    id: '3',
    name: 'Orange Internet 30J',
    operator: 'Orange',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png',
    data: '10Go',
    calls: '0 min',
    sms: '0 SMS',
    validity: '30 jours',
    price: 5000,
    description: '10Go Internet + Facebook gratuit pour un mois complet',
    popular: true,
    type: 'Internet',
    category: 'internet',
    bonus: 'Facebook gratuit',
    color: '#FF6600',
    features: [
      'Navigation haute vitesse 4G',
      'Facebook illimité gratuit',
      'Streaming vidéo autorisé',
      'Partage connexion multi-appareils',
      'Validité 30 jours complets'
    ],
    restrictions: [
      'Pas d\'appels inclus',
      'Pas de SMS inclus',
      'Facebook gratuit hors data',
      'Non cumulable avec autres offres'
    ]
  },
  {
    id: '4',
    name: 'Orange Appels 7J',
    operator: 'Orange',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png',
    data: '0 Mo',
    calls: '200min',
    sms: '0 SMS',
    validity: '7 jours',
    price: 1000,
    description: 'Appels illimités Orange + 50min autres réseaux pour une semaine',
    popular: false,
    type: 'Appels',
    category: 'appels',
    color: '#FF6600',
    features: [
      'Appels illimités vers Orange',
      '50 minutes vers autres réseaux',
      'Qualité HD pour tous appels',
      'Numérotation internationale',
      'Validité 7 jours'
    ],
    restrictions: [
      'Pas de data internet incluse',
      'Pas de SMS inclus',
      'Limité 50min hors Orange',
      'International non inclus'
    ]
  },
  {
    id: '5',
    name: 'Orange Mixte',
    operator: 'Orange',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png',
    data: '2Go',
    calls: '100min',
    sms: 'Illimités',
    validity: '7 jours',
    price: 2000,
    description: '2Go Internet + 100min tous réseaux + SMS illimités',
    popular: true,
    type: 'Mixte',
    category: 'mixte',
    bonus: 'SMS illimités',
    color: '#FF6600',
    features: [
      'Navigation internet 4G - 2Go',
      '100 minutes tous réseaux',
      'SMS illimités nationaux',
      'Partage de connexion',
      'Forfait complet 7 jours'
    ],
    restrictions: [
      'SMS international non inclus',
      'Appels limités à 100min',
      'Validité 7 jours uniquement',
      'Non renouvelable automatique'
    ]
  },

  // MTN CI - Forfaits réels
  {
    id: '6',
    name: 'MTN Internet 24h',
    operator: 'MTN',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/200px-MTN_Logo.svg.png',
    data: '1Go',
    calls: '0 min',
    sms: '0 SMS',
    validity: '24h',
    price: 500,
    description: '1Go Internet + WhatsApp gratuit 24h pour rester connecté',
    popular: false,
    type: 'Internet',
    category: 'internet',
    bonus: 'WhatsApp gratuit',
    color: '#FFCC00',
    features: [
      'Navigation internet 4G - 1Go',
      'WhatsApp illimité gratuit',
      'Vitesse optimisée',
      'Compatible tous appareils',
      'Activation instantanée'
    ],
    restrictions: [
      'Pas d\'appels inclus',
      'Pas de SMS inclus',
      'Validité 24h seulement',
      'WhatsApp seul gratuit'
    ]
  },
  {
    id: '7',
    name: 'MTN Internet 7J',
    operator: 'MTN',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/200px-MTN_Logo.svg.png',
    data: '3Go',
    calls: '0 min',
    sms: '0 SMS',
    validity: '7 jours',
    price: 1500,
    description: '3Go Internet + réseaux sociaux gratuits pour une semaine',
    popular: true,
    type: 'Internet',
    category: 'internet',
    bonus: 'Réseaux sociaux gratuits',
    color: '#FFCC00',
    features: [
      'Navigation internet 4G - 3Go',
      'Facebook, WhatsApp, Instagram gratuits',
      'Streaming musique autorisé',
      'Partage connexion permis',
      'Validité complète 7 jours'
    ],
    restrictions: [
      'Pas d\'appels inclus',
      'Pas de SMS inclus',
      'Réseaux sociaux hors quota',
      'YouTube non inclus gratuitement'
    ]
  },
  {
    id: '8',
    name: 'MTN Internet 30J',
    operator: 'MTN',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/200px-MTN_Logo.svg.png',
    data: '12Go',
    calls: '0 min',
    sms: '0 SMS',
    validity: '30 jours',
    price: 6000,
    description: '12Go Internet + YouTube gratuit le weekend',
    popular: false,
    type: 'Internet',
    category: 'internet',
    bonus: 'YouTube weekend gratuit',
    color: '#FFCC00',
    features: [
      'Navigation internet 4G - 12Go',
      'YouTube gratuit weekends',
      'Streaming HD autorisé',
      'Multi-appareils compatible',
      'Validité 30 jours complets'
    ],
    restrictions: [
      'Pas d\'appels inclus',
      'Pas de SMS inclus',
      'YouTube gratuit weekend uniquement',
      'Streaming limité au quota'
    ]
  },
  {
    id: '9',
    name: 'MTN Appels Illimités',
    operator: 'MTN',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/200px-MTN_Logo.svg.png',
    data: '0 Mo',
    calls: 'Illimité MTN + 30min',
    sms: '0 SMS',
    validity: '7 jours',
    price: 1200,
    description: 'Appels illimités MTN + 30min autres réseaux',
    popular: true,
    type: 'Appels',
    category: 'appels',
    color: '#FFCC00',
    features: [
      'Appels illimités vers MTN',
      '30 minutes autres réseaux',
      'Qualité cristalline HD',
      'Disponible 24h/24',
      'Activation immédiate'
    ],
    restrictions: [
      'Pas de data internet',
      'Pas de SMS inclus',
      '30min seulement hors MTN',
      'Appels internationaux exclus'
    ]
  },
  {
    id: '10',
    name: 'MTN Combo',
    operator: 'MTN',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/200px-MTN_Logo.svg.png',
    data: '5Go',
    calls: '150min',
    sms: '100 SMS',
    validity: '30 jours',
    price: 4500,
    description: '5Go Internet + 150min tous réseaux + 100 SMS',
    popular: true,
    type: 'Mixte',
    category: 'mixte',
    bonus: '100 SMS inclus',
    color: '#FFCC00',
    features: [
      'Internet 4G haute vitesse - 5Go',
      '150 minutes tous réseaux',
      '100 SMS nationaux inclus',
      'Forfait équilibré complet',
      'Validité 30 jours'
    ],
    restrictions: [
      'SMS international non inclus',
      'Appels limités à 150min',
      'Pas de bonus réseaux sociaux',
      'Non renouvelable automatique'
    ]
  },

  // MOOV CI - Forfaits réels
  {
    id: '11',
    name: 'Moov Internet Nuit',
    operator: 'Moov',
    operatorLogo: 'https://seeklogo.com/images/M/moov-africa-logo-459FC30F68-seeklogo.com.png',
    data: '3Go',
    calls: '0 min',
    sms: '0 SMS',
    validity: 'Nuit (00h-06h)',
    price: 300,
    description: '3Go Internet valable de 00h à 06h uniquement - idéal téléchargements',
    popular: false,
    type: 'Internet',
    category: 'internet',
    color: '#0066CC',
    features: [
      'Navigation internet 4G - 3Go',
      'Tarif économique nocturne',
      'Idéal pour téléchargements',
      'Vitesse maximale garantie',
      'Activation flexible'
    ],
    restrictions: [
      'Usage 00h-06h uniquement',
      'Pas d\'appels inclus',
      'Pas de SMS inclus',
      'Non utilisable en journée'
    ]
  },
  {
    id: '12',
    name: 'Moov Internet 7J',
    operator: 'Moov',
    operatorLogo: 'https://seeklogo.com/images/M/moov-africa-logo-459FC30F68-seeklogo.com.png',
    data: '2.5Go',
    calls: '0 min',
    sms: '0 SMS',
    validity: '7 jours',
    price: 1200,
    description: '2,5Go Internet + Facebook et WhatsApp gratuits',
    popular: true,
    type: 'Internet',
    category: 'internet',
    bonus: 'Facebook + WhatsApp gratuits',
    color: '#0066CC',
    features: [
      'Navigation internet - 2,5Go',
      'Facebook illimité gratuit',
      'WhatsApp illimité gratuit',
      'Compatible partage connexion',
      'Validité 7 jours'
    ],
    restrictions: [
      'Pas d\'appels inclus',
      'Pas de SMS inclus',
      'Autres réseaux sociaux payants',
      'Instagram non inclus'
    ]
  },
  {
    id: '13',
    name: 'Moov Internet 30J',
    operator: 'Moov',
    operatorLogo: 'https://seeklogo.com/images/M/moov-africa-logo-459FC30F68-seeklogo.com.png',
    data: '8Go',
    calls: '0 min',
    sms: '0 SMS',
    validity: '30 jours',
    price: 4000,
    description: '8Go Internet + applications sociales gratuites',
    popular: false,
    type: 'Internet',
    category: 'internet',
    bonus: 'Apps sociales gratuites',
    color: '#0066CC',
    features: [
      'Navigation internet 4G - 8Go',
      'Applications sociales illimitées',
      'Streaming autorisé',
      'Multi-appareils support',
      'Validité mensuelle complète'
    ],
    restrictions: [
      'Pas d\'appels inclus',
      'Pas de SMS inclus',
      'Apps définies par Moov',
      'YouTube non illimité'
    ]
  },
  {
    id: '14',
    name: 'Moov Appels Famille',
    operator: 'Moov',
    operatorLogo: 'https://seeklogo.com/images/M/moov-africa-logo-459FC30F68-seeklogo.com.png',
    data: '0 Mo',
    calls: 'Illimité Moov + 3 favoris',
    sms: '0 SMS',
    validity: '7 jours',
    price: 1500,
    description: 'Appels illimités Moov + 3 numéros favoris autres réseaux',
    popular: true,
    type: 'Appels',
    category: 'appels',
    bonus: '3 numéros favoris',
    color: '#0066CC',
    features: [
      'Appels illimités vers Moov',
      '3 numéros favoris autres réseaux',
      'Gestion favoris flexible',
      'Qualité HD garantie',
      'Parfait usage familial'
    ],
    restrictions: [
      'Pas de data internet',
      'Pas de SMS inclus',
      '3 numéros favoris maximum',
      'Autres numéros payants'
    ]
  },
  {
    id: '15',
    name: 'Moov Tout-en-Un',
    operator: 'Moov',
    operatorLogo: 'https://seeklogo.com/images/M/moov-africa-logo-459FC30F68-seeklogo.com.png',
    data: '4Go',
    calls: '120min',
    sms: 'Illimités',
    validity: '30 jours',
    price: 3500,
    description: '4Go Internet + 120min tous réseaux + SMS illimités',
    popular: false,
    type: 'Mixte',
    category: 'mixte',
    bonus: 'SMS illimités',
    color: '#0066CC',
    features: [
      'Internet 4G - 4Go inclus',
      '120 minutes tous réseaux',
      'SMS illimités nationaux',
      'Forfait équilibré mensuel',
      'Rapport qualité-prix optimal'
    ],
    restrictions: [
      'SMS international exclus',
      'Appels limités 120min',
      'Pas de bonus social',
      'Non cumulable'
    ]
  },

  // Forfaits spéciaux weekend et promotions
  {
    id: '16',
    name: 'Weekend Orange',
    operator: 'Orange',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png',
    data: '5Go',
    calls: '0 min',
    sms: '0 SMS',
    validity: 'Weekend (48h)',
    price: 1000,
    description: 'Forfait spécial weekend - 5Go pour 48h de navigation intensive',
    popular: true,
    type: 'Internet',
    category: 'internet',
    bonus: 'Spécial weekend',
    color: '#FF6600',
    features: [
      'Navigation ultra-rapide 5Go',
      'Validité weekend complet',
      'Streaming HD autorisé',
      'Partage connexion illimité',
      'Activation flexible'
    ],
    restrictions: [
      'Valable weekend uniquement',
      'Pas d\'appels inclus',
      'Pas de SMS inclus',
      'Expire dimanche 23h59'
    ]
  },
  {
    id: '17',
    name: 'MTN Étudiant',
    operator: 'MTN',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/200px-MTN_Logo.svg.png',
    data: '15Go',
    calls: '0 min',
    sms: '0 SMS',
    validity: '30 jours',
    price: 5000,
    description: 'Forfait étudiant - 15Go + plateformes éducatives gratuites',
    popular: true,
    type: 'Internet',
    category: 'internet',
    bonus: 'Plateformes éducatives gratuites',
    color: '#FFCC00',
    features: [
      'Internet haute vitesse - 15Go',
      'Plateformes éducatives illimitées',
      'Recherche académique gratuite',
      'Streaming éducatif inclus',
      'Tarif préférentiel étudiant'
    ],
    restrictions: [
      'Justificatif étudiant requis',
      'Pas d\'appels inclus',
      'Pas de SMS inclus',
      'Plateformes définies par MTN'
    ]
  },
  {
    id: '18',
    name: 'Moov Business',
    operator: 'Moov',
    operatorLogo: 'https://seeklogo.com/images/M/moov-africa-logo-459FC30F68-seeklogo.com.png',
    data: '20Go',
    calls: '300min',
    sms: 'Illimités',
    validity: '30 jours',
    price: 8000,
    description: 'Forfait professionnel - 20Go + 300min + email professionnel',
    popular: false,
    type: 'Mixte',
    category: 'mixte',
    bonus: 'Email professionnel',
    color: '#0066CC',
    features: [
      'Internet ultra-rapide - 20Go',
      '300 minutes tous réseaux',
      'SMS illimités professionnels',
      'Email professionnel inclus',
      'Support client prioritaire'
    ],
    restrictions: [
      'Forfait entreprise uniquement',
      'Facture mensuelle requise',
      'SMS international exclus',
      'Conditions commerciales spéciales'
    ]
  }
];

const formatXOF = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
};

export default function PackageDetailScreen() {
  const { id } = useLocalSearchParams();
  const [showFeatures, setShowFeatures] = useState(true);
  const [showRestrictions, setShowRestrictions] = useState(true);
  const [recipient, setRecipient] = useState('self');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  const packageData = PACKAGES.find(pkg => pkg.id === id);

  // Gestion du clavier
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow', 
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide', 
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const toggleFeatures = () => setShowFeatures(!showFeatures);
  const toggleRestrictions = () => setShowRestrictions(!showRestrictions);

  const handlePurchase = () => {
    if (recipient === 'other' && !phoneNumber) {
      Alert.alert(
        "Numéro manquant",
        "Veuillez entrer un numéro de téléphone pour le bénéficiaire.",
        [{ text: "OK" }]
      );
      return;
    }
    
    router.push({
      pathname: '/payment',
      params: {
        packageId: packageData.id,
        recipient: recipient,
        phoneNumber: recipient === 'other' ? phoneNumber : 'self'
      }
    });
  };

  const viewCard = () => {
    router.push({
      pathname: '/card',
      params: {
        packageId: packageData.id
      }
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'internet':
        return <Wifi size={20} color={Colors.primary.main} />;
      case 'appels':
        return <Phone size={20} color={Colors.primary.main} />;
      case 'mixte':
        return <Zap size={20} color={Colors.primary.main} />;
      default:
        return <Clock size={20} color={Colors.primary.main} />;
    }
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
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Détails du forfait" showBack />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          keyboardVisible && styles.scrollContentKeyboard
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête du forfait */}
        <View style={[styles.packageHeader, { backgroundColor: `${packageData.color}15` }]}>
          <View style={styles.headerTop}>
            <View style={styles.operatorSection}>
              <View style={[styles.operatorBadge, { backgroundColor: packageData.color }]}>
                <Text style={styles.operatorText}>{packageData.operator}</Text>
              </View>
              {packageData.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>🔥 Populaire</Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.cardButton}
              onPress={viewCard}
            >
              <Text style={styles.cardButtonText}>📱 Voir carte</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.packageName}>{packageData.name}</Text>
          <Text style={styles.packageDescription}>{packageData.description}</Text>
          
          {packageData.bonus && (
            <View style={[styles.bonusContainer, { backgroundColor: `${packageData.color}25` }]}>
              <Text style={[styles.bonusText, { color: packageData.color }]}>
                🎁 {packageData.bonus}
              </Text>
            </View>
          )}
        </View>

        {/* Informations principales */}
        <View style={styles.mainInfoContainer}>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Wifi size={20} color={packageData.color} />
              <Text style={styles.infoLabel}>Internet</Text>
              <Text style={[styles.infoValue, { color: packageData.color }]}>
                {packageData.data}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Phone size={20} color={packageData.color} />
              <Text style={styles.infoLabel}>Appels</Text>
              <Text style={[styles.infoValue, { color: packageData.color }]}>
                {packageData.calls || '0 min'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={[styles.smsIcon, { color: packageData.color }]}>💬</Text>
              <Text style={styles.infoLabel}>SMS</Text>
              <Text style={[styles.infoValue, { color: packageData.color }]}>
                {packageData.sms || '0 SMS'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Clock size={20} color={packageData.color} />
              <Text style={styles.infoLabel}>Validité</Text>
              <Text style={[styles.infoValue, { color: packageData.color }]}>
                {packageData.validity}
              </Text>
            </View>
          </View>
        </View>

        {/* Prix */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Prix du forfait</Text>
          <Text style={[styles.priceValue, { color: packageData.color }]}>
            {formatXOF(packageData.price)}
          </Text>
        </View>

        {/* Avantages */}
        {packageData.features && packageData.features.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={toggleFeatures}
            >
              <Text style={styles.sectionTitle}>✅ Avantages inclus</Text>
              {showFeatures ? 
                <ChevronUp color={Colors.text.secondary} size={20} /> : 
                <ChevronDown color={Colors.text.secondary} size={20} />
              }
            </TouchableOpacity>
            
            {showFeatures && (
              <View style={styles.sectionContent}>
                {packageData.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Text style={styles.featureIcon}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Restrictions */}
        {packageData.restrictions && packageData.restrictions.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.sectionHeader}
              onPress={toggleRestrictions}
            >
              <Text style={styles.sectionTitle}>⚠️ Conditions & Restrictions</Text>
              {showRestrictions ? 
                <ChevronUp color={Colors.text.secondary} size={20} /> : 
                <ChevronDown color={Colors.text.secondary} size={20} />
              }
            </TouchableOpacity>
            
            {showRestrictions && (
              <View style={styles.sectionContent}>
                {packageData.restrictions.map((restriction, index) => (
                  <View key={index} style={styles.restrictionItem}>
                    <Text style={styles.restrictionIcon}>⚠️</Text>
                    <Text style={styles.restrictionText}>{restriction}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Section d'achat */}
        <View style={styles.purchaseSection}>
          <Text style={styles.purchaseTitle}>Pour qui acheter ce forfait ?</Text>
          
          <View style={styles.recipientOptions}>
            <TouchableOpacity
              style={[
                styles.recipientOption,
                recipient === 'self' && styles.recipientOptionActive
              ]}
              onPress={() => setRecipient('self')}
            >
              <Text style={[
                styles.recipientOptionText,
                recipient === 'self' && styles.recipientOptionTextActive
              ]}>
                👤 Pour moi
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.recipientOption,
                recipient === 'other' && styles.recipientOptionActive
              ]}
              onPress={() => setRecipient('other')}
            >
              <Text style={[
                styles.recipientOptionText,
                recipient === 'other' && styles.recipientOptionTextActive
              ]}>
                👥 Pour quelqu'un d'autre
              </Text>
            </TouchableOpacity>
          </View>

          {recipient === 'other' && (
            <View style={styles.phoneInputContainer}>
              <Text style={styles.phoneInputLabel}>Numéro du bénéficiaire</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="Ex: 07 12 34 56 78"
                placeholderTextColor={Colors.text.secondary}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bouton d'achat fixe */}
      <View style={[styles.fixedButtonContainer, keyboardVisible && styles.fixedButtonKeyboard]}>
        <TouchableOpacity
          style={[styles.purchaseButton, { backgroundColor: packageData.color }]}
          onPress={handlePurchase}
          activeOpacity={0.8}
        >
          <Text style={styles.purchaseButtonText}>
            💳 Acheter - {formatXOF(packageData.price)}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  scrollContentKeyboard: {
    paddingBottom: 200,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.error.main,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  packageHeader: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  operatorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  operatorBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  operatorText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  popularBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  popularText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: '#000000',
  },
  cardButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cardButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.text.primary,
  },
  packageName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  packageDescription: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  bonusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bonusText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
  },
  mainInfoContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  smsIcon: {
    fontSize: 20,
  },
  priceContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  priceLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  priceValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
  },
  sectionContent: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureIcon: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 2,
  },
  featureText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
    lineHeight: 20,
  },
  restrictionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  restrictionIcon: {
    fontSize: 14,
    marginTop: 2,
  },
  restrictionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  purchaseSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
  },
  purchaseTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  recipientOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  recipientOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  recipientOptionActive: {
    backgroundColor: Colors.primary.main + '15',
    borderColor: Colors.primary.main,
  },
  recipientOptionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  recipientOptionTextActive: {
    color: Colors.primary.main,
    fontFamily: 'Poppins-SemiBold',
  },
  phoneInputContainer: {
    marginTop: 8,
  },
  phoneInputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  phoneInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.primary,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  fixedButtonKeyboard: {
    position: 'relative',
    borderTopWidth: 0,
    paddingBottom: 12,
  },
  purchaseButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  purchaseButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});