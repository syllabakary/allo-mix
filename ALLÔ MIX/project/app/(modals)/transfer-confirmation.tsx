import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '@/components/common/Header';
import Colors from '@/constants/Colors';
import FontSizes from '@/constants/FontSizes';
import Layout from '@/constants/Layout';

export default function TransferConfirmationScreen() {
  return (
    <View style={styles.container}>
      <Header title="Confirmation de transfert" showBack />
      <View style={styles.content}>
        <Text style={styles.message}>Votre transfert a été effectué avec succès.</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  message: {
    fontFamily: 'Poppins-Medium',
    fontSize: FontSizes.lg,
    color: Colors.text.primary,
    textAlign: 'center',
  },
});
