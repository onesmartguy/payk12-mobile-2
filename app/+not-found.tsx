import { Link, Stack, useNavigation, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/features/common/components/ThemedText';
import { ThemedView } from '@/features/common/components/ThemedView';
import { Drawer } from 'expo-router/drawer';

export default function NotFoundScreen() {
  const navigation = useNavigation();
  return (
    <>
      <Drawer.Screen options={{ title: 'Oops!' }}  />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen doesn't exist. {navigation.getId()}</ThemedText>
        <Link href="index" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
