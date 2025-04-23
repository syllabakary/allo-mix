import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

interface TransactionProps {
  transaction: {
    id: string;
    type: string;
    amount: number;
    date: string;
    status: string;
    operator: string;
    recipient: string;
    details: string;
  };
}

export default function TransactionItem({ transaction }: TransactionProps) {
  const statusColor = 
    transaction.status === 'completed' ? Colors.success.main :
    transaction.status === 'pending' ? Colors.primary.main :
    Colors.error.main;
  
  const statusText = 
    transaction.status === 'completed' ? 'Completed' :
    transaction.status === 'pending' ? 'Pending' :
    'Failed';

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.typeText}>{transaction.type}</Text>
        <Text style={styles.operatorText}>{transaction.operator}</Text>
        <Text style={styles.recipientText}>
          {transaction.recipient === 'Self' ? 'For yourself' : `To: ${transaction.recipient}`}
        </Text>
      </View>
      
      <View style={styles.rightContent}>
        <Text style={styles.amountText}>${transaction.amount.toFixed(2)}</Text>
        <Text style={styles.dateText}>{new Date(transaction.date).toLocaleDateString()}</Text>
        <View style={styles.statusContainer}>
          <View 
            style={[
              styles.statusIndicator,
              { backgroundColor: statusColor }
            ]}
          />
          <Text 
            style={[
              styles.statusText,
              { color: statusColor }
            ]}
          >
            {statusText}
          </Text>
        </View>
      </View>
      
      <ChevronRight color={Colors.grey[400]} size={16} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  leftContent: {
    flex: 1,
  },
  typeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  operatorText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.sm,
    color: Colors.secondary.main,
    marginBottom: Layout.spacing.xs,
  },
  recipientText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  rightContent: {
    alignItems: 'flex-end',
    marginRight: Layout.spacing.md,
  },
  amountText: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  dateText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Layout.spacing.xs,
  },
  statusText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.sm,
  },
});