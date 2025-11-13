import { TouchableOpacity, Text, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";

interface MenuItemProps {
  title: string;
  icon: string;
  color: string;
  route: string;
  description: string;
}

export default function MenuItem({ title, icon, color, route, description }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={styles.menuCard}
      onPress={() => router.push(route as any)}>
      <View style={[styles.menuIcon, { backgroundColor: color }]}>
        <Ionicons name={icon as any} size={24} color="white" />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuDescription}>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = {
  menuCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
    textAlign: 'center',
  },
  menuDescription: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    lineHeight: 14,
  },
} as const;