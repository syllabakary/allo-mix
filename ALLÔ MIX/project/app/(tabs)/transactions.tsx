import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ChevronDown, Filter, Download } from 'lucide-react-native';
import Header from '@/components/common/Header';
import TransactionItem from '@/components/transactions/TransactionItem';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import FontSizes from '@/constants/FontSizes';

// Fonction de formatage sécurisée
const formatMontant = (montant?: number): string => {
  if (typeof montant !== 'number' || isNaN(montant)) {
    return 'Montant indisponible';
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(montant).replace('XOF', 'F CFA');
};

// Interface TypeScript pour les transactions
interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  operator: string;
  recipient: string;
  details: string;
}

// Données de transactions
const TRANSACTIONS: Transaction[] = [
  // ... vos données existantes ...
];

const FILTRES_TEMPS = ['Toutes', 'Ce mois', 'Mois dernier', '3 derniers mois'];

export default function TransactionsScreen() {
  const [filtreTemps, setFiltreTemps] = useState<string>('Toutes');
  const [showFiltreTemps, setShowFiltreTemps] = useState<boolean>(false);
  const [transactionsFiltrees, setTransactionsFiltrees] = useState<Transaction[]>(TRANSACTIONS);
  
  const toggleFiltreTemps = () => {
    setShowFiltreTemps(!showFiltreTemps);
  };
  
  const selectionnerFiltreTemps = (filtre: string) => {
    setFiltreTemps(filtre);
    setShowFiltreTemps(false);
    
    // Filtrage sécurisé
    try {
      let filtered = TRANSACTIONS;
      if (filtre !== 'Toutes') {
        const now = new Date();
        filtered = TRANSACTIONS.filter(t => {
          const date = new Date(t.date);
          switch(filtre) {
            case 'Ce mois':
              return date.getMonth() === now.getMonth() && 
                     date.getFullYear() === now.getFullYear();
            case 'Mois dernier':
              const lastMonth = new Date(now);
              lastMonth.setMonth(lastMonth.getMonth() - 1);
              return date.getMonth() === lastMonth.getMonth() && 
                     date.getFullYear() === lastMonth.getFullYear();
            case '3 derniers mois':
              const threeMonthsAgo = new Date(now);
              threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
              return date >= threeMonthsAgo;
            default:
              return true;
          }
        });
      }
      setTransactionsFiltrees(filtered);
    } catch (error) {
      console.error('Erreur de filtrage:', error);
      setTransactionsFiltrees(TRANSACTIONS);
    }
  };

  // Calcul sécurisé du total dépensé
  const totalDepense = transactionsFiltrees
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <View style={styles.container}>
      <Header title="Historique des transactions" showBack={false} />
      
      <View style={styles.content}>
        {/* Filtres */}
        <View style={styles.filterSection}>
          <View style={styles.filterRow}>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity 
                style={styles.dropdown}
                onPress={toggleFiltreTemps}
              >
                <Text style={styles.dropdownText}>{filtreTemps}</Text>
                <ChevronDown color={Colors.grey[700]} size={16} />
              </TouchableOpacity>
              
              {showFiltreTemps && (
                <View style={styles.dropdownMenu}>
                  {FILTRES_TEMPS.map((filtre) => (
                    <TouchableOpacity
                      key={filtre}
                      style={[
                        styles.dropdownItem,
                        filtreTemps === filtre && styles.selectedDropdownItem
                      ]}
                      onPress={() => selectionnerFiltreTemps(filtre)}
                    >
                      <Text 
                        style={[
                          styles.dropdownItemText,
                          filtreTemps === filtre && styles.selectedDropdownItemText
                        ]}
                      >
                        {filtre}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => console.log('Filtres avancés')}
            >
              <Filter color={Colors.text.primary} size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => console.log('Exporter')}
            >
              <Download color={Colors.text.primary} size={20} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Cartes récapitulatives */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: Colors.primary.main }]}>
            <Text style={styles.summaryLabel}>Total dépensé</Text>
            <Text style={styles.summaryValue}>{formatMontant(totalDepense)}</Text>
          </View>
          
          <View style={[styles.summaryCard, { backgroundColor: Colors.secondary.main }]}>
            <Text style={styles.summaryLabel}>Transactions</Text>
            <Text style={styles.summaryValue}>{transactionsFiltrees.length}</Text>
          </View>
        </View>
        
        {/* Liste des transactions */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.transactionsTitle}>Détail des transactions</Text>
          
          {transactionsFiltrees.length > 0 ? (
            <FlatList
              data={transactionsFiltrees}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TransactionItem 
                  transaction={{
                    ...item,
                    formattedAmount: formatMontant(item.amount)
                  }} 
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.transactionsList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Aucune transaction trouvée</Text>
            </View>
          )}
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
    fontFamily: 'Poppins-Medium',
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
    backgroundColor: Colors.primary.light + '20',
  },
  dropdownItemText: {
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
  },
  selectedDropdownItemText: {
    fontFamily: 'Poppins-SemiBold',
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
    fontFamily: 'Poppins-Regular',
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.secondary,
  },
});