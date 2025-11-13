import { View, Text } from "react-native";

interface HeaderProps {
  greeting: string;
  title: string;
}

export default function Header({ greeting, title }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
} as const;