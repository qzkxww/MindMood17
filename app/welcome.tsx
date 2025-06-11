import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Moon, Sun, Globe } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolate,
  Easing,
  withSpring
} from 'react-native-reanimated';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/components/AuthProvider';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { signIn, signInWithApple, signInWithGoogle } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Animation values
  const pulseScale = useSharedValue(1);
  const coreGlow = useSharedValue(0);
  const particle1Rotation = useSharedValue(0);
  const particle2Rotation = useSharedValue(0);
  const particle3Float = useSharedValue(0);
  const particle4Float = useSharedValue(0);

  useEffect(() => {
    // Core pulsing animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Core glow animation
    coreGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Particle orbital animations
    particle1Rotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );

    particle2Rotation.value = withRepeat(
      withTiming(-360, { duration: 12000, easing: Easing.linear }),
      -1,
      false
    );

    // Particle floating animations
    particle3Float.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    particle4Float.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const handleGetStarted = () => {
    router.push('/onboarding');
  };

  const handleSignIn = () => {
    setShowSignInModal(true);
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Apple sign in failed:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Google sign in failed:', error);
    }
  };

  const handleEmailSignIn = () => {
    router.push('/signin');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'ES' : 'EN');
  };

  const theme = {
    background: isDarkMode ? '#0f172a' : '#ffffff',
    text: isDarkMode ? '#f8fafc' : '#1e293b',
    subtext: isDarkMode ? '#94a3b8' : '#64748b',
    accent: '#3b82f6',
    buttonBg: isDarkMode ? '#f8fafc' : '#1e293b',
    buttonText: isDarkMode ? '#1e293b' : '#ffffff',
  };

  // Animated styles
  const animatedCoreStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
      opacity: interpolate(coreGlow.value, [0, 1], [0.8, 1]),
    };
  });

  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value * 0.8 }],
      opacity: interpolate(coreGlow.value, [0, 1], [0.4, 0.8]),
    };
  });

  const animatedParticle1Style = useAnimatedStyle(() => {
    const translateX = interpolate(
      particle1Rotation.value,
      [0, 360],
      [0, 2 * Math.PI]
    );
    return {
      transform: [
        { translateX: Math.cos(translateX) * 80 },
        { translateY: Math.sin(translateX) * 80 },
        { scale: interpolate(particle1Rotation.value % 180, [0, 90, 180], [0.8, 1.2, 0.8]) }
      ],
    };
  });

  const animatedParticle2Style = useAnimatedStyle(() => {
    const translateX = interpolate(
      particle2Rotation.value,
      [-360, 0],
      [0, 2 * Math.PI]
    );
    return {
      transform: [
        { translateX: Math.cos(translateX) * 60 },
        { translateY: Math.sin(translateX) * 60 },
        { scale: interpolate(Math.abs(particle2Rotation.value) % 180, [0, 90, 180], [0.6, 1, 0.6]) }
      ],
    };
  });

  const animatedParticle3Style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(particle3Float.value, [0, 1], [0, -15]) },
        { scale: interpolate(particle3Float.value, [0, 1], [0.8, 1.2]) }
      ],
      opacity: interpolate(particle3Float.value, [0, 0.5, 1], [0.6, 1, 0.6]),
    };
  });

  const animatedParticle4Style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(particle4Float.value, [0, 1], [0, 12]) },
        { scale: interpolate(particle4Float.value, [0, 1], [1, 0.7]) }
      ],
      opacity: interpolate(particle4Float.value, [0, 0.5, 1], [0.8, 0.4, 0.8]),
    };
  });

  // Abstract brain/energy visualization component
  const EnergyVisualization = () => (
    <View style={styles.visualizationContainer}>
      <View style={[styles.energyRing, styles.outerRing, { borderColor: theme.accent + '20' }]}>
        <View style={[styles.energyRing, styles.middleRing, { borderColor: theme.accent + '40' }]}>
          <View style={[styles.energyRing, styles.innerRing, { borderColor: theme.accent + '60' }]}>
            <Animated.View style={[styles.energyCore, { backgroundColor: theme.accent }, animatedCoreStyle]}>
              <Animated.View style={[styles.energyPulse, { backgroundColor: theme.accent + '80' }, animatedPulseStyle]} />
            </Animated.View>
          </View>
        </View>
      </View>
      
      {/* Floating particles with animations */}
      <Animated.View style={[
        styles.particle, 
        styles.particle1, 
        { backgroundColor: theme.accent },
        animatedParticle1Style
      ]} />
      <Animated.View style={[
        styles.particle, 
        styles.particle2, 
        { backgroundColor: theme.accent },
        animatedParticle2Style
      ]} />
      <Animated.View style={[
        styles.particle, 
        styles.particle3, 
        { backgroundColor: theme.accent },
        animatedParticle3Style
      ]} />
      <Animated.View style={[
        styles.particle, 
        styles.particle4, 
        { backgroundColor: theme.accent },
        animatedParticle4Style
      ]} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header with controls */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: theme.background }]}
            onPress={toggleDarkMode}
          >
            {isDarkMode ? (
              <Sun size={20} color={theme.text} />
            ) : (
              <Moon size={20} color={theme.text} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.languageButton, { backgroundColor: theme.background }]}
            onPress={toggleLanguage}
          >
            <Globe size={16} color={theme.text} />
            <Text style={[styles.languageText, { color: theme.text }]}>{language}</Text>
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <View style={styles.content}>
          {/* Energy visualization */}
          <View style={styles.illustrationContainer}>
            <EnergyVisualization />
          </View>

          {/* Text content */}
          <View style={styles.textContainer}>
            <Text style={[styles.headline, { color: theme.text }]}>
              Mood & Energy Coaching,{'\n'}Simplified
            </Text>
            <Text style={[styles.subheadline, { color: theme.subtext }]}>
              Understand your emotions. Build better days.
            </Text>
          </View>

          {/* Action buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[styles.getStartedButton, { backgroundColor: theme.buttonBg }]}
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <Text style={[styles.getStartedText, { color: theme.buttonText }]}>
                Get Started
              </Text>
            </TouchableOpacity>

            <View style={styles.signInContainer}>
              <Text style={[styles.signInPrompt, { color: theme.subtext }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={[styles.signInLink, { color: theme.text }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Sign In Modal */}
        <AuthModal
          visible={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          onAppleSignIn={handleAppleSignIn}
          onGoogleSignIn={handleGoogleSignIn}
          onEmailSignIn={handleEmailSignIn}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  languageText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingBottom: 48,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  visualizationContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  energyRing: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    width: 180,
    height: 180,
  },
  middleRing: {
    width: 120,
    height: 120,
  },
  innerRing: {
    width: 80,
    height: 80,
  },
  energyCore: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  energyPulse: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  particle1: {
    top: 30,
    right: 60,
  },
  particle2: {
    bottom: 40,
    left: 50,
  },
  particle3: {
    top: 80,
    left: 20,
  },
  particle4: {
    bottom: 80,
    right: 30,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  headline: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subheadline: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  actionContainer: {
    alignItems: 'center',
  },
  getStartedButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: -0.2,
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInPrompt: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  signInLink: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    textDecorationLine: 'underline',
  },
});