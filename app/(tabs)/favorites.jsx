import { View, Text, Alert, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { API_URL } from "../../constants/api";
import { favoritesStyles } from "../../assets/styles/favorites.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "../../components/RecipeCard";
import NoFavoritesFound from "../../components/NoFavoritesFound";
import LoadingSpinner from "../../components/LoadingSpinner";

const FavoritesScreen = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?.id) {
        console.log('No user ID available');
        setLoading(false);
        return;
      }

      try {
        console.log('API_URL:', API_URL);
        console.log('User ID:', user.id);
        console.log(`Fetching favorites from: ${API_URL}/favorites/${user.id}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${API_URL}/favorites/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response body:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const favorites = await response.json();
        console.log('Favorites received:', favorites.length, 'items');

        // Validate that favorites is an array
        if (!Array.isArray(favorites)) {
          console.error('Favorites is not an array:', typeof favorites, favorites);
          throw new Error('Invalid response format');
        }

        // Transform the data to match the RecipeCard component's expected format
        const transformedFavorites = favorites.map((favorite) => ({
          ...favorite,
          id: favorite.recipeId,
        }));

        setFavoriteRecipes(transformedFavorites);
        setError(null);

      } catch (error) {
        console.error("Error loading favorites:", error);
        
        let errorMessage = "Failed to load favorites";
        
        if (error.name === 'AbortError') {
          errorMessage = "Request timed out. Please check your connection.";
        } else if (error.message.includes('Network request failed')) {
          errorMessage = "Network error. Please check your internet connection.";
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "Cannot connect to server. Please check if the server is running.";
        } else if (error.message.startsWith('HTTP')) {
          errorMessage = `Server error: ${error.message}`;
        }

        setError(errorMessage);
        Alert.alert("Error", errorMessage);
        
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user?.id]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Trigger useEffect again by updating a dependency
    const loadFavorites = async () => {
      if (!user?.id) return;

      try {
        console.log(`Retrying: ${API_URL}/favorites/${user.id}`);
        
        const response = await fetch(`${API_URL}/favorites/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const favorites = await response.json();
        
        if (!Array.isArray(favorites)) {
          throw new Error('Invalid response format');
        }

        const transformedFavorites = favorites.map((favorite) => ({
          ...favorite,
          id: favorite.recipeId,
        }));

        setFavoriteRecipes(transformedFavorites);
        setError(null);

      } catch (error) {
        console.error("Retry failed:", error);
        setError("Still unable to load favorites");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  };

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: signOut },
    ]);
  };

  if (loading) return <LoadingSpinner message="Loading your favorites..." />;

  // Show error state with retry option
  if (error) {
    return (
      <View style={favoritesStyles.container}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
          <TouchableOpacity style={favoritesStyles.logoutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="warning-outline" size={60} color={COLORS.textLight} />
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 16, textAlign: 'center' }}>
            Unable to Load Favorites
          </Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight, marginTop: 8, textAlign: 'center' }}>
            {error}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
              marginTop: 20,
            }}
            onPress={handleRetry}
          >
            <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={favoritesStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
          <TouchableOpacity style={favoritesStyles.logoutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={favoritesStyles.recipesSection}>
          <FlatList
            data={favoriteRecipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={favoritesStyles.row}
            contentContainerStyle={favoritesStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={<NoFavoritesFound />}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default FavoritesScreen;