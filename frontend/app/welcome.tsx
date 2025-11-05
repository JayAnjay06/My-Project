import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent" />
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.icon} />
          <Text style={styles.logoText}>MangroveCare</Text>
        </View>
        <Text style={styles.tagline}>
          Bersama Menjaga Kelestarian Mangrove
        </Text>
      </View>
      <View style={styles.illustrationContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.illustration} />
      </View>
      <View style={styles.buttonsContainer}>
        <Text style={styles.welcomeText}>Selamat Datang Di!</Text>
        <Text style={styles.subTitle}>Madura Mangrove Information Center</Text>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => router.push('/(user)')}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="people" size={24} color="#FFFFFF" />
            <View style={styles.buttonTextContainer}>
              <Text style={styles.buttonTitle}>Masuk sebagai Masyarakat</Text>
              <Text style={styles.buttonSubtitle}>Akses informasi dan laporan umum</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push('/(auth)/login')}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="business" size={24} color="#2E8B57" />
            <View style={styles.buttonTextContainer}>
              <Text style={[styles.buttonTitle, styles.secondaryTitle]}>
                Login Peneliti / Pemerintah
              </Text>
              <Text style={[styles.buttonSubtitle, styles.secondarySubtitle]}>
                Akses dashboard dan data monitoring
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#2E8B57" />
          </View>
        </TouchableOpacity>
        <Text style={styles.infoText}>
          Bergabung dalam upaya pelestarian ekosistem mangrove Indonesia
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginLeft: 10,
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  illustrationContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  illustration: {
    width: 500,
    height: 250,
    resizeMode: 'contain',
  },
  buttonsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: '#2E8B57',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2E8B57',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 12,
    color: '#E8F5E8',
  },
  secondaryTitle: {
    color: '#2E8B57',
  },
  secondarySubtitle: {
    color: '#666',
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  icon: {
    height: 40,
    width: 40
  }
});