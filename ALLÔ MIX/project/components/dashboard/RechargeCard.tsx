import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleCheck as CheckCircle2, Circle as XCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

interface RechargeCardProps {
  operator: string;
  amount: number;
  date: string;
  type: string;
  success: boolean;
}

export default function RechargeCard({ operator, amount, date, type, success }: RechargeCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.operatorText}>{operator}</Text>
        <Text style={styles.amountText}>F CFA{amount.toFixed(2)}</Text>
        <Text style={styles.typeText}>{type}</Text>
      </View>
      
      <View style={styles.rightContent}>
        <Text style={styles.dateText}>{new Date(date).toLocaleDateString()}</Text>
        <View style={styles.statusContainer}>
          {success ? (
            <>
              <CheckCircle2 color={Colors.success.main} size={16} />
              <Text style={[styles.statusText, styles.successText]}>Succès</Text>
            </>
          ) : (
            <>
              <XCircle color={Colors.error.main} size={16} />
              <Text style={[styles.statusText, styles.failedText]}>Rejeter</Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    shadowColor: Colors.grey[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  leftContent: {
    flex: 1,
  },
  operatorText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  amountText: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.lg,
    color: Colors.primary.main,
    marginBottom: Layout.spacing.xs,
  },
  typeText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.sm,
    marginLeft: Layout.spacing.xs,
  },
  successText: {
    color: Colors.success.main,
  },
  failedText: {
    color: Colors.error.main,
  },
});