import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import { X, Mail } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  runOnJS
} from 'react-native-reanimated';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onAppleSignIn: () => void;
  onGoogleSignIn: () => void;
  onEmailSignIn: () => void;
}

export default function AuthModal({ 
  visible, 
  onClose, 
  onAppleSignIn, 
  onGoogleSignIn, 
  onEmailSignIn 
}: AuthModalProps) {
  const modalScale = useSharedValue(0);
  const modalOpacity = useSharedValue(0);

  const handleClose = () => {
    modalOpacity.value = withTiming(0, { duration: 200 });
    modalScale.value = withTiming(0.9, { duration: 200 }, () => {
      runOnJS(onClose)();
    });
  };

  const handleAppleSignIn = async () => {
    try {
      // In a real app, implement Apple Sign In using expo-apple-authentication
      // For now, simulate successful authentication
      handleClose();
      setTimeout(() => {
        onAppleSignIn();
      }, 300);
    } catch (error) {
      Alert.alert('Sign In Error', 'Failed to sign in with Apple. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // In a real app, implement Google Sign In using expo-auth-session
      // For now, simulate successful authentication
      handleClose();
      setTimeout(() => {
        onGoogleSignIn();
      }, 300);
    } catch (error) {
      Alert.alert('Sign In Error', 'Failed to sign in with Google. Please try again.');
    }
  };

  const handleEmailSignIn = () => {
    handleClose();
    setTimeout(() => {
      onEmailSignIn();
    }, 300);
  };

  // Animate modal in when visible changes
  useState(() => {
    if (visible) {
      modalOpacity.value = withTiming(1, { duration: 300 });
      modalScale.value = withSpring(1, {
        damping: 20,
        stiffness: 300,
      });
    }
  });

  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      opacity: modalOpacity.value,
      transform: [{ scale: modalScale.value }],
    };
  });

  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: modalOpacity.value,
    };
  });

  const AppleLogo = () => (
    <View style={styles.appleLogoContainer}>
      <Image 
        source={{ uri: 'https://i.imgur.com/eyHcHLY.png' }}
        style={styles.appleLogoImage}
        resizeMode="contain"
      />
    </View>
  );

  const GoogleLogo = () => (
    <View style={styles.googleLogoContainer}>
      <Image 
        source={{ uri: 'https://i.imgur.com/bunX9Gb.png' }}
        style={styles.googleLogoImage}
        resizeMode="contain"
      />
    </View>
  );

  const EmailIcon = () => (
    <View style={styles.emailIconContainer}>
      <Mail size={24} color="#64748b" />
    </View>
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.modalBackdrop, animatedBackdropStyle]}>
        <TouchableOpacity 
          style={styles.modalBackdropTouchable}
          activeOpacity={1}
          onPress={handleClose}
        >
          <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
            <TouchableOpacity 
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalContent}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Sign In</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={handleClose}
                  >
                    <X size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>

                {/* Sign In Options */}
                <View style={styles.signInOptions}>
                  {/* Apple Sign In */}
                  <TouchableOpacity 
                    style={styles.appleSignInButton}
                    onPress={handleAppleSignIn}
                    activeOpacity={0.8}
                  >
                    <AppleLogo />
                    <Text style={styles.appleSignInText}>Sign in with Apple</Text>
                  </TouchableOpacity>

                  {/* Google Sign In */}
                  <TouchableOpacity 
                    style={styles.googleSignInButton}
                    onPress={handleGoogleSignIn}
                    activeOpacity={0.8}
                  >
                    <GoogleLogo />
                    <Text style={styles.googleSignInText}>Sign in with Google</Text>
                  </TouchableOpacity>

                  {/* Email Sign In */}
                  <TouchableOpacity 
                    style={styles.emailSignInButton}
                    onPress={handleEmailSignIn}
                    activeOpacity={0.8}
                  >
                    <EmailIcon />
                    <Text style={styles.emailSignInText}>Continue with email</Text>
                  </TouchableOpacity>
                </View>

                {/* Terms */}
                <View style={styles.termsContainer}>
                  <Text style={styles.termsText}>
                    By continuing you agree to MindMood's{'\n'}
                    <Text style={styles.termsLink}>Terms and Conditions</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdropTouchable: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  signInOptions: {
    gap: 16,
    marginBottom: 32,
  },
  appleSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appleSignInText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  googleSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleSignInText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  emailSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emailSignInText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
  },
  appleLogoContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  appleLogoImage: {
    width: 40,
    height: 40,
    tintColor: '#ffffff',
  },
  googleLogoContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLogoImage: {
    width: 40,
    height: 40,
  },
  emailIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsContainer: {
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  termsLink: {
    color: '#3b82f6',
    textDecorationLine: 'underline',
  },
});