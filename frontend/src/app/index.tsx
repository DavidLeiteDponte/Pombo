import React, { useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, View } from 'react-native';
import {
  Text,
  Card,
  BottomNavigation,
  Appbar,
  Provider as PaperProvider,
} from 'react-native-paper';

// --- Pantallas (separadas para mejor legibilidad) ---
const RecentsScreen = () => (
  <View style={styles.screen}>
    <Text variant="titleMedium">Pantalla de Recientes</Text>
  </View>
);

const FavoritesScreen = () => (
  <View style={styles.screen}>
    <Text variant="titleMedium">Pantalla de Favoritos</Text>
  </View>
);

const NearbyScreen = () => (
  <View style={styles.screen}>
    <Text variant="titleMedium">Pantalla de Cercanos</Text>
  </View>
);

// --- Mapa de escenas ---
const renderScene = BottomNavigation.SceneMap({
  recents: RecentsScreen,
  favorites: FavoritesScreen,
  nearby: NearbyScreen,
});

// --- Rutas de navegación ---
const routes = [
  { key: 'recents', title: 'Recientes', focusedIcon: 'history', unfocusedIcon: 'history' },
  { key: 'favorites', title: 'Favoritos', focusedIcon: 'heart', unfocusedIcon: 'heart-outline' },
  { key: 'nearby', title: 'Cercanos', focusedIcon: 'map-marker', unfocusedIcon: 'map-marker-outline' },
];

// --- Encabezado ---
const Header = () => (
  <Appbar.Header elevated>
    <Appbar.Content title="Pombo" subtitle="Tu asistente inteligente" />
    <Appbar.Action icon="bell-outline" onPress={() => {}} />
  </Appbar.Header>
);

// --- Contenido principal de la primera pestaña (opcional) ---
const HomeContent = () => (
  <ScrollView contentContainerStyle={styles.scrollContent}>
    <Text variant="headlineSmall" style={styles.title}>
      ¡Hola! 👋
    </Text>
    <Text variant="bodyMedium" style={styles.subtitle}>
      ¿Qué necesitas hoy?
    </Text>

    <Card style={styles.card} mode="elevated">
      <Card.Title title="Sugerencia" subtitle="Prueba a preguntar algo" />
      <Card.Content>
        <Text variant="bodyMedium">
          Puedo ayudarte a organizar tus tareas, buscar información o recordarte cosas importantes.
        </Text>
      </Card.Content>
    </Card>

    <Card style={styles.card} mode="elevated">
      <Card.Title title="Tus accesos rápidos" />
      <Card.Content>
        <Text variant="bodyMedium">Aquí verás tus accesos más usados.</Text>
      </Card.Content>
    </Card>
  </ScrollView>
);

// --- App principal ---
export default function App() {
  const [index, setIndex] = useState(0);

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <Header />

        {/* Contenido scrollable encima de la navegación */}
        <View style={styles.content}>
          <HomeContent />
        </View>

        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          shifting={false}
          labeled
        />
      </SafeAreaView>
    </PaperProvider>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
  },
  title: {
    fontWeight: '200',
  },
  subtitle: {
    color: '#666666',
  },
});