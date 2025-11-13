import { View, Text } from "react-native";
import MenuItem from "./MenuItem";

interface MenuItem {
  title: string;
  icon: string;
  color: string;
  route: string;
  description: string;
}

interface MenuGridProps {
  title: string;
  items: MenuItem[];
}

export default function MenuGrid({ title, items }: MenuGridProps) {
  return (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.menuGrid}>
        {items.map((item, index) => (
          <MenuItem
            key={index}
            title={item.title}
            icon={item.icon}
            color={item.color}
            route={item.route}
            description={item.description}
          />
        ))}
      </View>
    </View>
  );
}

const styles = {
  menuSection: {
    marginBottom: 24,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
} as const;