import { StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, View, useThemeColor } from '@/components/Themed';
import { useAuth } from '@/context/AuthContext';
import SettingsItem from "@/components/SettingsItem";
import Colors from '@/constants/Colors';

export default function TabOneScreen() {
  const { user, signOut } = useAuth();
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={styles.container}>

      <View style={styles.avatarCircle} lightColor={Colors.palette.accentBgLight} darkColor={Colors.palette.accentBgDark}>
        <Ionicons name="person" size={40} color={Colors.palette.primary} />
      </View>

      <Text style={styles.name}>{user?.displayName || 'No name'}</Text>
      <Text style={styles.email}>{user?.email || 'No email'}</Text>

      <Pressable
        onPress={signOut}
        style={({ pressed }) => [
          styles.signOutButton,
          { opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Ionicons name="log-out-outline" size={20} color={Colors.palette.error} style={{ marginRight: 8 }} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>

      <SettingsItem icon="settings-outline" title="Setting" route="/settings" />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    opacity: 0.5,
    marginBottom: 40,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: Colors.palette.error,
  },
  signOutText: {
    color: Colors.palette.error,
    fontSize: 16,
    fontWeight: '600',
  },
});
