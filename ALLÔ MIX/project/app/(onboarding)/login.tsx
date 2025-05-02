import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { AtSign, Lock, ArrowRight, Phone } from 'lucide-react-native';

// Define FontSizes that were missing in the original code
const FontSizes = {
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  h2: 28
};

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [phoneMethod, setPhoneMethod] = useState(true);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  
  // Refs for OTP inputs to allow automatic focus on next input
  const otpInputRefs = useRef([]);

  const handleAuthentication = () => {
    if (otpSent) {
      // Validate OTP
      const otpValue = otp.join('');
      if (otpValue.length !== 4) {
        Alert.alert("Code incomplet", "Veuillez entrer les 4 chiffres du code OTP");
        return;
      }
      
      // Navigation corrected to the home page in the tab structure
      router.replace('/(tabs)');
      return;
    }
    
    // Simple validation before sending OTP
    if (phoneMethod && phone.trim().length < 8) {
      Alert.alert("Numéro invalide", "Veuillez entrer un numéro de téléphone valide");
      return;
    }
    
    if (!phoneMethod && (!email.includes('@') || email.trim().length < 5)) {
      Alert.alert("Email invalide", "Veuillez entrer une adresse email valide");
      return;
    }
    
    if (!isLogin && password.trim().length < 6) {
      Alert.alert("Mot de passe trop court", "Votre mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    // Proceed with sending OTP
    setOtpSent(true);
  };

  const handleToggleMethod = () => {
    setPhoneMethod(!phoneMethod);
  };

  const handleToggleAuthType = () => {
    setIsLogin(!isLogin);
    setOtpSent(false);
    setOtp(['', '', '', '']);
  };
  
  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input if value is entered, or previous if deleted
    if (value && index < 3) {
      otpInputRefs.current[index + 1].focus();
    } else if (!value && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };
  
  const resendOtp = () => {
    // Reset OTP fields
    setOtp(['', '', '', '']);
    Alert.alert("Code envoyé", `Un nouveau code a été envoyé à ${phoneMethod ? phone : email}`);
    // Focus on first input
    otpInputRefs.current[0].focus();
  };
  
  const isFormValid = () => {
    if (otpSent) {
      return otp.join('').length === 4;
    }
    
    if (phoneMethod) {
      return phone.trim().length >= 8;
    } else {
      return email.includes('@') && email.trim().length >= 5;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {otpSent ? 'Entrez le code OTP' : isLogin ? 'Bon Retour' : 'Créer un Compte'}
          </Text>
          <Text style={styles.subtitle}>
            {otpSent 
              ? `Nous avons envoyé un code de vérification à ${phoneMethod ? phone : email}` 
              : isLogin 
                ? 'Connectez-vous pour continuer' 
                : 'Inscrivez-vous pour commencer'}
          </Text>
        </View>

        <View style={styles.formContainer}>
          {!otpSent && (
            <>
              {phoneMethod ? (
                <View style={styles.inputContainer}>
                  <Phone color={Colors.grey[500]} size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Numéro de téléphone"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
              ) : (
                <View style={styles.inputContainer}>
                  <AtSign color={Colors.grey[500]} size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Adresse email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              )}

              {!isLogin && (
                <View style={styles.inputContainer}>
                  <Lock color={Colors.grey[500]} size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              )}

              <TouchableOpacity 
                style={styles.methodToggle}
                onPress={handleToggleMethod}
              >
                <Text style={styles.methodToggleText}>
                  {phoneMethod ? 'Utiliser Email' : 'Utiliser Téléphone'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {otpSent && (
            <View style={styles.otpContainer}>
              <View style={styles.otpInputsRow}>
                {[0, 1, 2, 3].map((index) => (
                  <TextInput
                    key={index}
                    ref={el => otpInputRefs.current[index] = el}
                    style={[
                      styles.otpInput, 
                      otp[index] ? styles.otpInputFilled : null
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={otp[index]}
                    onChangeText={(value) => handleOtpChange(value, index)}
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.resendButton} onPress={resendOtp}>
                <Text style={styles.resendButtonText}>Renvoyer le code</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, !isFormValid() && styles.buttonDisabled]}
            onPress={handleAuthentication}
            disabled={!isFormValid()}
          >
            <Text style={styles.buttonText}>
              {otpSent ? 'Vérifier' : isLogin ? 'Se connecter' : "S'inscrire"}
            </Text>
            <ArrowRight color={Colors.primary.contrastText} size={20} />
          </TouchableOpacity>
        </View>

        {!otpSent && (
          <TouchableOpacity 
            style={styles.authToggle}
            onPress={handleToggleAuthType}
          >
            <Text style={styles.authToggleText}>
              {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: Layout.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: Layout.spacing.xl,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: FontSizes.h2,
    color: Colors.secondary.main,
    marginBottom: Layout.spacing.xs,
  },
  subtitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.lg,
    color: Colors.text.secondary,
  },
  formContainer: {
    marginBottom: Layout.spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.grey[200],
  },
  input: {
    flex: 1,
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.lg,
    paddingVertical: Layout.spacing.md,
    marginLeft: Layout.spacing.sm,
  },
  methodToggle: {
    alignSelf: 'flex-end',
    marginBottom: Layout.spacing.lg,
  },
  methodToggleText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.secondary.main,
  },
  otpContainer: {
    marginBottom: Layout.spacing.lg,
  },
  otpInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.grey[300],
    textAlign: 'center',
    fontSize: FontSizes.xxl,
    fontFamily: 'Roboto-Bold',
  },
  otpInputFilled: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.light,
  },
  resendButton: {
    alignSelf: 'center',
    padding: Layout.spacing.sm,
  },
  resendButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.secondary.main,
  },
  button: {
    backgroundColor: Colors.primary.main,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.grey[300],
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: FontSizes.lg,
    color: Colors.primary.contrastText,
    marginRight: Layout.spacing.sm,
  },
  authToggle: {
    alignSelf: 'center',
  },
  authToggleText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.secondary.main,
  },
});