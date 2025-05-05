import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ChevronDown, Filter, Download } from 'lucide-react-native';
import Header from '@/components/common/Header';
import TransactionItem from '@/components/transactions/TransactionItem';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';
import { useTranslation } from 'react-i18next';

const formatCurrency = (amount: number) =>
  `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} FCFA`;
// Sample transaction data
const TRANSACTIONS = [
  {
    id: '1',
    type: 'Data Purchase',
    amount: 5.99,
    date: '2023-06-15',
    status: 'completed',
    operator: 'Orange',
    recipient: 'Self',
    details: '3GB Data Bundle - 7 Days'
  },
  {
    id: '2',
    type: 'Airtime',
    amount: 10,
    date: '2023-06-12',
    status: 'completed',
    operator: 'MTN',
    recipient: '+1234567890',
    details: 'Airtime Top-up'
  },
  {
    id: '3',
    type: 'SMS Bundle',
    amount: 2.5,
    date: '2023-06-10',
    status: 'pending',
    operator: 'Moov',
    recipient: 'Self',
    details: '200 SMS - 30 Days'
  },
  {
    id: '4',
    type: 'Data + Voice',
    amount: 15,
    date: '2023-06-05',
    status: 'failed',
    operator: 'Orange',
    recipient: 'Self',
    details: 'Payment Failed - Try Again'
  },
  {
    id: '5',
    type: 'Data Purchase',
    amount: 25,
    date: '2023-06-01',
    status: 'completed',
    operator: 'MTN',
    recipient: '+9876543210',
    details: '10GB Data Bundle - 30 Days'
  },
  {
    id: '6',
    type: 'International Calls',
    amount: 20,
    date: '2023-05-25',
    status: 'completed',
    operator: 'Moov',
    recipient: 'Self',
    details: '60 Minutes International Calls'
  },
  {
    id: '7',
    type: 'Data Purchase',
    amount: 3.99,
    date: '2023-05-20',
    status: 'completed',
    operator: 'Orange',
    recipient: 'Self',
    details: '1GB Data Bundle - 24 Hours'
  },
  {
    id: '8',
    type: 'Airtime',
    amount: 5,
    date: '2023-05-15',
    status: 'completed',
    operator: 'MTN',
    recipient: '+2345678901',
    details: 'Airtime Top-up'
  },
];



const TIME_FILTERS = ['All Time', 'This Month', 'Last Month', 'Last 3 Months'];
const TYPE_FILTERS = ['All Types', 'Data', 'Airtime', 'SMS', 'Combo'];
const STATUS_FILTERS = ['All Status', 'Completed', 'Pending', 'Failed'];

export default function TransactionsScreen() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('All Time');
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState(TRANSACTIONS);
  
  const toggleTimeFilter = () => {
    setShowTimeFilter(!showTimeFilter);
  };
  
  const selectTimeFilter = (filter: string) => {
    setSelectedTimeFilter(filter);
    setShowTimeFilter(false);
    
    // Apply filtering logic (simplified for demo)
    if (filter === 'All Time') {
      setFilteredTransactions(TRANSACTIONS);
    } else {
      // In a real app, you'd filter based on dates
      const filtered = TRANSACTIONS.filter(t => {
        if (filter === 'This Month') return t.date.startsWith('2023-06');
        if (filter === 'Last Month') return t.date.startsWith('2023-05');
        return true;
      });
      setFilteredTransactions(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Transaction History" showBack={false} />
      
      <View style={styles.content}>
        {/* Filter Controls */}
        <View style={styles.filterSection}>
          <View style={styles.filterRow}>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity 
                style={styles.dropdown}
                onPress={toggleTimeFilter}
              >
                <Text style={styles.dropdownText}>{selectedTimeFilter}</Text>
                <ChevronDown color={Colors.grey[700]} size={16} />
              </TouchableOpacity>
              
              {showTimeFilter && (
                <View style={styles.dropdownMenu}>
                  {TIME_FILTERS.map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      style={[
                        styles.dropdownItem,
                        selectedTimeFilter === filter && styles.selectedDropdownItem
                      ]}
                      onPress={() => selectTimeFilter(filter)}
                    >
                      <Text 
                        style={[
                          styles.dropdownItemText,
                          selectedTimeFilter === filter && styles.selectedDropdownItemText
                        ]}
                      >
                        {filter}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            <TouchableOpacity style={styles.iconButton}>
              <Filter color={Colors.text.primary} size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconButton}>
              <Download color={Colors.text.primary} size={20} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: Colors.primary.main }]}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summaryValue}>$87.48</Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: Colors.secondary.main }]}>
            <Text style={styles.summaryLabel}>Transactions</Text>
            <Text style={styles.summaryValue}>{filteredTransactions.length}</Text>
          </View>
        </View>
        
        {/* Transactions List */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.transactionsTitle}>Transactions</Text>
          
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TransactionItem transaction={item} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.transactionsList}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  content: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
  },
  filterSection: {
    marginVertical: Layout.spacing.lg,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 10,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.grey[200],
  },
  dropdownText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.grey[200],
    marginTop: Layout.spacing.xs,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 20,
  },
  dropdownItem: {
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
  },
  selectedDropdownItem: {
    backgroundColor: Colors.primary.light,
  },
  dropdownItemText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  selectedDropdownItemText: {
    fontFamily: 'Roboto-Medium',
    color: Colors.primary.main,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    marginLeft: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.grey[200],
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.lg,
  },
  summaryCard: {
    flex: 1,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginHorizontal: Layout.spacing.xs,
  },
  summaryLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.common.white,
    opacity: 0.8,
    marginBottom: Layout.spacing.xs,
  },
  summaryValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.xl,
    color: Colors.common.white,
  },
  transactionsContainer: {
    flex: 1,
  },
  transactionsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  transactionsList: {
    paddingBottom: Layout.spacing.xxl,
  },
});