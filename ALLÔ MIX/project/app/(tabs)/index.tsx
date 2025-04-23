import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Phone, Zap as ZapFast, MessageSquare, Gift, Repeat, ChevronRight, CircleAlert as AlertCircle } from 'lucide-react-native';

import Header from '@/components/common/Header';
import UsageCard from '@/components/dashboard/UsageCard';
import QuickAction from '@/components/dashboard/QuickAction';
import RechargeCard from '@/components/dashboard/RechargeCard';
import PromoCard from '@/components/dashboard/PromoCard';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <View style={styles.container}>
      <Header title="TeleRecharge" showNotification />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Toggle (Personal/Business) */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, activeTab === 'personal' && styles.activeToggle]}
            onPress={() => setActiveTab('personal')}
          >
            <Text style={[styles.toggleText, activeTab === 'personal' && styles.activeToggleText]}>
              Personal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, activeTab === 'business' && styles.activeToggle]}
            onPress={() => setActiveTab('business')}
          >
            <Text style={[styles.toggleText, activeTab === 'business' && styles.activeToggleText]}>
              Business
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Usage Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Usage</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            <UsageCard 
              icon={<ZapFast color={Colors.primary.main} size={24} />}
              title="Data"
              used={3.5}
              total={5}
              unit="GB"
              daysLeft={7}
            />
            <UsageCard 
              icon={<Phone color={Colors.primary.main} size={24} />}
              title="Voice"
              used={35}
              total={100}
              unit="min"
              daysLeft={7}
            />
            <UsageCard 
              icon={<MessageSquare color={Colors.primary.main} size={24} />}
              title="SMS"
              used={25}
              total={100}
              unit="SMS"
              daysLeft={7}
            />
          </ScrollView>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <QuickAction 
              icon={<ZapFast color={Colors.common.white} size={24} />}
              title="Buy Data"
              color={Colors.secondary.main}
              onPress={() => router.push('/(tabs)/packages')}
            />
            <QuickAction 
              icon={<Phone color={Colors.common.white} size={24} />}
              title="Call Plan"
              color="#FF9800"
              onPress={() => router.push('/(tabs)/packages')}
            />
            <QuickAction 
              icon={<MessageSquare color={Colors.common.white} size={24} />}
              title="SMS Bundle"
              color="#9C27B0"
              onPress={() => router.push('/(tabs)/packages')}
            />
            <QuickAction 
              icon={<Gift color={Colors.common.white} size={24} />}
              title="Gifting"
              color="#E91E63"
              onPress={() => router.push('/(modals)/gift')}
            />
          </View>
        </View>
        
        {/* Recent Recharges */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Recharges</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
              <View style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight color={Colors.secondary.main} size={16} />
              </View>
            </TouchableOpacity>
          </View>
          
          <RechargeCard 
            operator="Orange"
            amount={10}
            date="2023-06-10"
            type="Data Bundle"
            success={true}
          />
          <RechargeCard 
            operator="MTN"
            amount={5}
            date="2023-06-08"
            type="Airtime"
            success={true}
          />
          <RechargeCard 
            operator="Moov"
            amount={20}
            date="2023-06-05"
            type="Voice + Data"
            success={false}
          />
        </View>
        
        {/* Promotions Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            <PromoCard 
              title="Weekend Data Bundle"
              description="Get 3GB for just $2 this weekend!"
              discount="50% OFF"
              backgroundColor={Colors.primary.main}
              textColor={Colors.primary.contrastText}
            />
            <PromoCard 
              title="Unlimited Social"
              description="Unlimited social media for 7 days"
              discount="NEW"
              backgroundColor={Colors.secondary.main}
              textColor={Colors.secondary.contrastText}
            />
            <PromoCard 
              title="Family Plan"
              description="Share data with up to 5 family members"
              discount="POPULAR"
              backgroundColor="#9C27B0"
              textColor="#FFFFFF"
            />
          </ScrollView>
        </View>
        
        {/* Low Balance Alert */}
        <View style={styles.alertContainer}>
          <AlertCircle color={Colors.primary.main} size={24} />
          <Text style={styles.alertText}>Your balance is running low. Recharge now to stay connected!</Text>
        </View>
        
      </ScrollView>
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
    paddingBottom: Layout.spacing.xxl,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.round,
    padding: Layout.spacing.xs,
    marginVertical: Layout.spacing.lg,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: Layout.spacing.sm,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.round,
  },
  activeToggle: {
    backgroundColor: Colors.primary.main,
  },
  toggleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
  activeToggleText: {
    color: Colors.primary.contrastText,
  },
  sectionContainer: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  horizontalScrollContent: {
    paddingRight: Layout.spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.sm,
    color: Colors.secondary.main,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.main,
    marginBottom: Layout.spacing.xl,
  },
  alertText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginLeft: Layout.spacing.sm,
    flex: 1,
  },
});