import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { X, Check, TriangleAlert as AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react-native';
import Header from '@/components/common/Header';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

// Sample packages data (in a real app, you would fetch this from an API or database)
const PACKAGES = [
  {
    id: '1',
    name: 'Daily Data',
    operator: 'Orange',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png',
    data: '1GB',
    calls: '10 min',
    sms: '10 SMS',
    validity: '1 day',
    price: 1.99,
    description: 'Fast internet for your daily needs',
    popular: true,
    features: [
      'High-speed browsing',
      'Social media access',
      'Limited calls included',
      'Limited SMS included'
    ],
    restrictions: [
      'No video streaming',
      'Not shareable'
    ]
  },
  {
    id: '2',
    name: 'Weekly Social',
    operator: 'MTN',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/200px-MTN_Logo.svg.png',
    data: '3GB',
    calls: '20 min',
    sms: '20 SMS',
    validity: '7 days',
    price: 4.99,
    description: 'Unlimited social media access',
    popular: false,
    features: [
      'Unlimited social media',
      'High-speed browsing',
      'Limited calls included',
      'Limited SMS included'
    ],
    restrictions: [
      'No video streaming',
      'Not shareable'
    ]
  },
  {
    id: '3',
    name: 'Monthly Max',
    operator: 'Orange',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/200px-Orange_logo.svg.png',
    data: '20GB',
    calls: '100 min',
    sms: '100 SMS',
    validity: '30 days',
    price: 15.99,
    description: 'Our best value monthly plan',
    popular: true,
    features: [
      'High-speed browsing',
      'Video streaming allowed',
      'Generous call minutes',
      'Generous SMS',
      'Shareable with 1 device'
    ],
    restrictions: [
      'Fair usage policy applies'
    ]
  },
  {
    id: '4',
    name: 'Unlimited Calls',
    operator: 'Moov',
    operatorLogo: 'https://seeklogo.com/images/M/moov-africa-logo-459FC30F68-seeklogo.com.png',
    data: '500MB',
    calls: 'Unlimited',
    sms: '50 SMS',
    validity: '30 days',
    price: 9.99,
    description: 'Unlimited calls to all networks',
    popular: false,
    features: [
      'Unlimited calls to all networks',
      'Basic data included',
      'Limited SMS'
    ],
    restrictions: [
      'Fair usage policy applies',
      'Not shareable'
    ]
  },
  {
    id: '5',
    name: 'Family Share',
    operator: 'MTN',
    operatorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MTN_Logo.svg/200px-MTN_Logo.svg.png',
    data: '50GB',
    calls: '300 min',
    sms: '300 SMS',
    validity: '30 days',
    price: 29.99,
    description: 'Share data with up to 5 family members',
    popular: true,
    features: [
      'High-speed browsing',
      'Video streaming allowed',
      'Generous call minutes',
      'Generous SMS',
      'Shareable with up to 5 devices'
    ],
    restrictions: [
      'Fair usage policy applies'
    ]
  },
  {
    id: '6',
    name: 'Weekend Special',
    operator: 'Moov',
    operatorLogo: 'https://seeklogo.com/images/M/moov-africa-logo-459FC30F68-seeklogo.com.png',
    data: '5GB',
    calls: '30 min',
    sms: '30 SMS',
    validity: '2 days',
    price: 2.99,
    description: 'Extra data for your weekend',
    popular: false,
    features: [
      'High-speed browsing',
      'Video streaming allowed',
      'Limited calls included',
      'Limited SMS included'
    ],
    restrictions: [
      'Valid only on weekends (Fri-Sun)',
      'Not shareable'
    ]
  },
];

export default function PackageDetailScreen() {
  const { id } = useLocalSearchParams();
  const [showFeatures, setShowFeatures] = useState(true);
  const [showRestrictions, setShowRestrictions] = useState(true);
  const [recipient, setRecipient] = useState('self');
  
  // Find the package by id
  const packageData = PACKAGES.find(pkg => pkg.id === id);
  
  if (!packageData) {
    return (
      <View style={styles.container}>
        <Header title="Package Details" showBack />
        <View style={styles.errorContainer}>
          <AlertTriangle color={Colors.error.main} size={48} />
          <Text style={styles.errorText}>Package not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const toggleFeatures = () => {
    setShowFeatures(!showFeatures);
  };
  
  const toggleRestrictions = () => {
    setShowRestrictions(!showRestrictions);
  };
  
  const handlePurchase = () => {
    router.push({
      pathname: '/(modals)/payment',
      params: { 
        id: packageData.id,
        amount: packageData.price,
        name: packageData.name,
        recipient: recipient
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Package Details" showBack />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Package Header */}
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
              <Text style={styles.popularText}>Popular</Text>
            </View>
          )}
        </View>
        
        {/* Package Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.descriptionText}>{packageData.description}</Text>
          
          <View style={styles.featureGrid}>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>{packageData.data}</Text>
              <Text style={styles.featureLabel}>Data</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>{packageData.calls}</Text>
              <Text style={styles.featureLabel}>Calls</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>{packageData.sms}</Text>
              <Text style={styles.featureLabel}>SMS</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>{packageData.validity}</Text>
              <Text style={styles.featureLabel}>Validity</Text>
            </View>
          </View>
          
          {/* Features */}
          <TouchableOpacity 
            style={styles.accordionHeader}
            onPress={toggleFeatures}
          >
            <Text style={styles.accordionTitle}>Features</Text>
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
        
        {/* Recipient Selection */}
        <View style={styles.recipientCard}>
          <Text style={styles.recipientTitle}>Choose Recipient</Text>
          
          <View style={styles.recipientOptions}>
            <TouchableOpacity 
              style={[
                styles.recipientOption,
                recipient === 'self' && styles.activeRecipientOption
              ]}
              onPress={() => setRecipient('self')}
            >
              <Text 
                style={[
                  styles.recipientOptionText,
                  recipient === 'self' && styles.activeRecipientOptionText
                ]}
              >
                For Myself
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.recipientOption,
                recipient === 'other' && styles.activeRecipientOption
              ]}
              onPress={() => setRecipient('other')}
            >
              <Text 
                style={[
                  styles.recipientOptionText,
                  recipient === 'other' && styles.activeRecipientOptionText
                ]}
              >
                For Someone Else
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Purchase Bar */}
      <View style={styles.purchaseBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>${packageData.price.toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.purchaseButton}
          onPress={handlePurchase}
        >
          <Text style={styles.purchaseButtonText}>Purchase Now</Text>
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