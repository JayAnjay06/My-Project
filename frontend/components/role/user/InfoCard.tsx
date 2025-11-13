import { View, Text } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

interface InfoCardProps {
  icon: string;
  iconColor: string;
  title: string;
  text: string;
}

export default function InfoCard({ icon, iconColor, title, text }: InfoCardProps) {
  return (
    <View style={styles.infoCard}>
      <Ionicons name={icon as any} size={24} color={iconColor} />
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = {
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
} as const;