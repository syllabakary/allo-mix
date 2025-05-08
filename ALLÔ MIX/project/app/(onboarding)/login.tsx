import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { AtSign, Lock, ArrowRight, Phone, Shield, Check } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  withSpring,
  withDelay,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define FontSizes that were missing in the original code
const FontSizes = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  h2: 28
};

const PIN_KEY = '@teleRecharge_pin';
const HAS_LOGGED_IN = '@teleRecharge_hasLoggedIn';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [phoneMethod, setPhoneMethod] = useState(true);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [authStep, setAuthStep] = useState('login'); // 'login', 'otp', 'createPin', 'confirmPin', 'enterPin'
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [savedPin, setSavedPin] = useState('');
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  
  // Animation values
  const containerOpacity = useSharedValue(1);
  const containerTranslateY = useSharedValue(0);
  const successScale = useSharedValue(0);
  const shakeValue = useSharedValue(0);
  
  // Refs for OTP and PIN inputs to allow automatic focus on next input
  const otpInputRefs = useRef([]);
  const pinInputRefs = useRef([]);
  const confirmPinInputRefs = useRef([]);
  const enterPinInputRefs = useRef([]);

  // Check if user has previously logged in and set PIN
  useEffect(() => {
    const checkPreviousLogin = async () => {
      try {
        const storedPin = await AsyncStorage.getItem(PIN_KEY);
        const loggedIn = await AsyncStorage.getItem(HAS_LOGGED_IN);
        
        if (storedPin) {
          setSavedPin(storedPin);
        }
        
        if (loggedIn === 'true') {
          setHasLoggedIn(true);
          setAuthStep('enterPin');
        }
      } catch (error) {
        console.error('Failed to load stored PIN:', error);
      }
    };
    
    checkPreviousLogin();
  }, []);

  // Animation styles
  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: containerOpacity.value,
      transform: [{ translateY: containerTranslateY.value }]
    };
  });
  
  const successAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: successScale.value }],
      opacity: successScale.value,
      position: 'absolute',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      top: '50%',
      left: '38%', // Center approximately
    };
  });
  
  const shakeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeValue.value }]
    };
  });

  const handleAuthentication = () => {
    if (authStep === 'otp') {
      // Validate OTP
      const otpValue = otp.join('');
      if (otpValue.length !== 4) {
        Alert.alert("Code incomplet", "Veuillez entrer les 4 chiffres du code OTP");
        return;
      }
      
      // OTP is valid, move to PIN creation
      animateTransition(() => {
        setAuthStep('createPin');
        // Reset PIN fields
        setPin(['', '', '', '']);
      });
      return;
    }
    
    if (authStep === 'login') {
      // Simple validation before sending OTP
      if (phoneMethod && phone.trim().length < 8) {
        Alert.alert("Numéro invalide", "Veuillez entrer un numéro de téléphone valide");
        shakeAnimation();
        return;
      }
      
      if (!phoneMethod && (!email.includes('@') || email.trim().length < 5)) {
        Alert.alert("Email invalide", "Veuillez entrer une adresse email valide");
        shakeAnimation();
        return;
      }
      
      if (!isLogin && password.trim().length < 6) {
        Alert.alert("Mot de passe trop court", "Votre mot de passe doit contenir au moins 6 caractères");
        shakeAnimation();
        return;
      }
      
      // Proceed with sending OTP
      animateTransition(() => {
        setAuthStep('otp');
      });
      return;
    }
    
    if (authStep === 'createPin') {
      const pinValue = pin.join('');
      if (pinValue.length !== 4) {
        Alert.alert("Code PIN incomplet", "Veuillez entrer les 4 chiffres du code PIN");
        shakeAnimation();
        return;
      }
      
      // Move to confirm PIN
      animateTransition(() => {
        setAuthStep('confirmPin');
        // Reset confirm PIN fields
        setConfirmPin(['', '', '', '']);
      });
      return;
    }
    
    if (authStep === 'confirmPin') {
      const pinValue = pin.join('');
      const confirmPinValue = confirmPin.join('');
      
      if (confirmPinValue.length !== 4) {
        Alert.alert("Code PIN incomplet", "Veuillez confirmer les 4 chiffres du code PIN");
        shakeAnimation();
        return;
      }
      
      if (pinValue !== confirmPinValue) {
        Alert.alert("Les codes PIN ne correspondent pas", "Veuillez réessayer");
        shakeAnimation();
        // Reset confirm PIN fields
        setConfirmPin(['', '', '', '']);
        return;
      }
      
      // PIN confirmed, save it and navigate to home
      savePin(pinValue);
      showSuccessAndNavigate();
      return;
    }
    
    if (authStep === 'enterPin') {
      const enteredPin = pin.join('');
      
      if (enteredPin.length !== 4) {
        Alert.alert("Code PIN incomplet", "Veuillez entrer les 4 chiffres du code PIN");
        shakeAnimation();
        return;
      }
      
      if (enteredPin !== savedPin) {
        Alert.alert("Code PIN incorrect", "Veuillez réessayer");
        shakeAnimation();
        // Reset PIN fields
        setPin(['', '', '', '']);
        return;
      }
      
      // PIN is correct, navigate to home
      showSuccessAndNavigate();
      return;
    }
  };

  const savePin = async (pinValue) => {
    try {
      await AsyncStorage.setItem(PIN_KEY, pinValue);
      await AsyncStorage.setItem(HAS_LOGGED_IN, 'true');
    } catch (error) {
      console.error('Failed to save PIN:', error);
      Alert.alert("Erreur", "Impossible de sauvegarder votre code PIN");
    }
  };

  const animateTransition = (callback) => {
    containerOpacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(callback)();
      containerOpacity.value = withTiming(1, { duration: 300 });
      containerTranslateY.value = withSequence(
        withTiming(20, { duration: 1 }),
        withTiming(0, { duration: 300 })
      );
    });
  };
  
  const shakeAnimation = () => {
    shakeValue.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };
  
  const showSuccessAndNavigate = () => {
    containerOpacity.value = withTiming(0, { duration: 300 });
    successScale.value = withTiming(1, { duration: 500, easing: Easing.elastic(1) });
    
    // Delay navigation to home to show success animation
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleToggleMethod = () => {
    setPhoneMethod(!phoneMethod);
  };

  const handleToggleAuthType = () => {
    setIsLogin(!isLogin);
    setAuthStep('login');
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
  
  const handlePinChange = (value, index, inputType) => {
    let newValues, inputRefs;
    
    if (inputType === 'pin') {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      newValues = newPin;
      inputRefs = pinInputRefs;
    } else if (inputType === 'confirmPin') {
      const newConfirmPin = [...confirmPin];
      newConfirmPin[index] = value;
      setConfirmPin(newConfirmPin);
      newValues = newConfirmPin;
      inputRefs = confirmPinInputRefs;
    } else if (inputType === 'enterPin') {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      newValues = newPin;
      inputRefs = enterPinInputRefs;
    }
    
    // Auto-focus next input if value is entered, or previous if deleted
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    
    // Auto-submit if all fields are filled
    if (value && index === 3 && newValues.every(v => v !== '')) {
      setTimeout(() => handleAuthentication(), 300);
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
    if (authStep === 'otp') {
      return otp.join('').length === 4;
    } else if (authStep === 'createPin') {
      return pin.join('').length === 4;
    } else if (authStep === 'confirmPin') {
      return confirmPin.join('').length === 4;
    } else if (authStep === 'enterPin') {
      return pin.join('').length === 4;
    } else if (authStep === 'login') {
      if (phoneMethod) {
        return phone.trim().length >= 8;
      } else {
        return email.includes('@') && email.trim().length >= 5;
      }
    }
    return false;
  };
  
  const resetPinSetup = () => {
    setAuthStep('createPin');
    setPin(['', '', '', '']);
  };
  
  const forgotPin = async () => {
    try {
      await AsyncStorage.removeItem(PIN_KEY);
      await AsyncStorage.removeItem(HAS_LOGGED_IN);
      
      // Reset to login screen
      setAuthStep('login');
      setPin(['', '', '', '']);
      setHasLoggedIn(false);
      setSavedPin('');
      Alert.alert("PIN réinitialisé", "Veuillez vous reconnecter pour configurer un nouveau PIN");
    } catch (error) {
      console.error('Failed to reset PIN:', error);
      Alert.alert("Erreur", "Impossible de réinitialiser votre code PIN");
    }
  };

  // Render different screens based on auth step
  const renderAuthContent = () => {
    switch (authStep) {
      case 'login':
        return (
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
            
            <TouchableOpacity
              style={[styles.button, !isFormValid() && styles.buttonDisabled]}
              onPress={handleAuthentication}
              disabled={!isFormValid()}
            >
              <Text style={styles.buttonText}>
                {isLogin ? 'Se connecter' : "S'inscrire"}
              </Text>
              <ArrowRight color={Colors.primary.contrastText} size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.authToggle}
              onPress={handleToggleAuthType}
            >
              <Text style={styles.authToggleText}>
                {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
              </Text>
            </TouchableOpacity>
          </>
        );
        
      case 'otp':
        return (
          <>
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
            
            <TouchableOpacity
              style={[styles.button, !isFormValid() && styles.buttonDisabled]}
              onPress={handleAuthentication}
              disabled={!isFormValid()}
            >
              <Text style={styles.buttonText}>Vérifier</Text>
              <ArrowRight color={Colors.primary.contrastText} size={20} />
            </TouchableOpacity>
          </>
        );
        
      case 'createPin':
        return (
          <>
            <View style={styles.pinInfoContainer}>
              <Shield color={Colors.secondary.main} size={30} />
              <Text style={styles.pinInfoText}>
                Créez un code PIN à 4 chiffres pour sécuriser votre accès à l'application
              </Text>
            </View>
            
            <View style={styles.otpContainer}>
              <View style={styles.otpInputsRow}>
                {[0, 1, 2, 3].map((index) => (
                  <TextInput
                    key={index}
                    ref={el => pinInputRefs.current[index] = el}
                    style={[
                      styles.otpInput, 
                      pin[index] ? styles.otpInputFilled : null
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    secureTextEntry
                    value={pin[index]}
                    onChangeText={(value) => handlePinChange(value, index, 'pin')}
                  />
                ))}
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.button, !isFormValid() && styles.buttonDisabled]}
              onPress={handleAuthentication}
              disabled={!isFormValid()}
            >
              <Text style={styles.buttonText}>Continuer</Text>
              <ArrowRight color={Colors.primary.contrastText} size={20} />
            </TouchableOpacity>
          </>
        );
        
      case 'confirmPin':
        return (
          <>
            <View style={styles.pinInfoContainer}>
              <Shield color={Colors.secondary.main} size={30} />
              <Text style={styles.pinInfoText}>
                Confirmez votre code PIN à 4 chiffres
              </Text>
            </View>
            
            <View style={styles.otpContainer}>
              <View style={styles.otpInputsRow}>
                {[0, 1, 2, 3].map((index) => (
                  <TextInput
                    key={index}
                    ref={el => confirmPinInputRefs.current[index] = el}
                    style={[
                      styles.otpInput, 
                      confirmPin[index] ? styles.otpInputFilled : null
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    secureTextEntry
                    value={confirmPin[index]}
                    onChangeText={(value) => handlePinChange(value, index, 'confirmPin')}
                  />
                ))}
              </View>
              
              <TouchableOpacity style={styles.resendButton} onPress={resetPinSetup}>
                <Text style={styles.resendButtonText}>Modifier mon PIN</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={[styles.button, !isFormValid() && styles.buttonDisabled]}
              onPress={handleAuthentication}
              disabled={!isFormValid()}
            >
              <Text style={styles.buttonText}>Confirmer et terminer</Text>
              <ArrowRight color={Colors.primary.contrastText} size={20} />
            </TouchableOpacity>
          </>
        );
        
      case 'enterPin':
        return (
          <>
            <View style={styles.pinInfoContainer}>
              <Shield color={Colors.secondary.main} size={30} />
              <Text style={styles.pinInfoText}>
                Entrez votre code PIN pour accéder à l'application
              </Text>
            </View>
            
            <View style={styles.otpContainer}>
              <View style={styles.otpInputsRow}>
                {[0, 1, 2, 3].map((index) => (
                  <TextInput
                    key={index}
                    ref={el => enterPinInputRefs.current[index] = el}
                    style={[
                      styles.otpInput, 
                      pin[index] ? styles.otpInputFilled : null
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    secureTextEntry
                    value={pin[index]}
                    onChangeText={(value) => handlePinChange(value, index, 'enterPin')}
                  />
                ))}
              </View>
              
              <TouchableOpacity style={styles.resendButton} onPress={forgotPin}>
                <Text style={styles.resendButtonText}>J'ai oublié mon PIN</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={[styles.button, !isFormValid() && styles.buttonDisabled]}
              onPress={handleAuthentication}
              disabled={!isFormValid()}
            >
              <Text style={styles.buttonText}>Accéder</Text>
              <ArrowRight color={Colors.primary.contrastText} size={20} />
            </TouchableOpacity>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={containerAnimatedStyle}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {authStep === 'otp' && 'Entrez le code OTP'}
              {authStep === 'login' && (isLogin ? 'Bon Retour' : 'Créer un Compte')}
              {authStep === 'createPin' && 'Créer un code PIN'}
              {authStep === 'confirmPin' && 'Confirmer le code PIN'}
              {authStep === 'enterPin' && 'Accès sécurisé'}
            </Text>
            <Text style={styles.subtitle}>
              {authStep === 'otp' && `Nous avons envoyé un code de vérification à ${phoneMethod ? phone : email}`}
              {authStep === 'login' && (isLogin ? 'Connectez-vous pour continuer' : 'Inscrivez-vous pour commencer')}
              {authStep === 'createPin' && 'Protégez votre application avec un code à 4 chiffres'}
              {authStep === 'confirmPin' && 'Assurez-vous de bien mémoriser votre code PIN'}
              {authStep === 'enterPin' && 'Entrez votre code PIN pour continuer'}
            </Text>
          </View>

          <Animated.View style={[styles.formContainer, shakeAnimatedStyle]}>
            {renderAuthContent()}
          </Animated.View>
        </Animated.View>
        
        {/* Success animation */}
        <Animated.View style={successAnimatedStyle}>
          <View style={styles.successContainer}>
            <Check size={80} color={Colors.success.main} />
          </View>
        </Animated.View>
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
    marginTop: Layout.spacing.lg,
  },
  authToggleText: {
    fontFamily: 'Roboto-Medium',
    fontSize: FontSizes.md,
    color: Colors.secondary.main,
  },
  pinInfoContainer: {
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
    backgroundColor: Colors.background.paper,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.secondary.light,
  },
  pinInfoText: {
    fontFamily: 'Roboto-Regular',
    fontSize: FontSizes.md,
    color: Colors.text.primary,
    textAlign: 'center',
    marginTop: Layout.spacing.sm,
  },
  successContainer: {
    backgroundColor: Colors.success.light,
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});