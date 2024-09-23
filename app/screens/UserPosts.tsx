import React, { FC, useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Image, Pressable } from "react-native";
import { observer } from "mobx-react-lite";
import { Text } from "app/components";
import { AppStackScreenProps } from "app/navigators";
import { colors, spacing } from "../theme";
import { useStores } from "app/models";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

interface UserPostProps extends AppStackScreenProps<"UserPost"> {}

export const UserPostScreen: FC<UserPostProps> = observer(function UserPostScreen({ route }) {
  const { UserPostStore } = useStores();
  const[loading,setLoading] = useState(false);
  const navigation = useNavigation();
  const { data } = route.params;

  useEffect(() => {
    UserPostStore.fetchUserPostData(data?.id); // Load initial posts
  }, [data]);

  const loadMoreData = () => {
    if (!UserPostStore.loading && UserPostStore.hasMore) {
      UserPostStore.setProp('loading',true); // Start loading
      setLoading(true);
      // Show loading for 2 seconds before fetching more data
      setTimeout(() => {
        UserPostStore.fetchUserPostData(1).then(() => {
          UserPostStore.setProp('loading',false);
          setLoading(false); // Stop loading after data is fetched
        });
      }, 5000); // 3 seconds delay
    }
  };

  const renderPostItem = ({ item }: { item: { id: number; title: string; body: string } }) => (
    <Pressable style={styles.postContainer}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBody}>{item.body}</Text>
    </Pressable>
  );
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.palette.primary500} />
        </Pressable>
        <Text style={styles.headerTitle} text="Posts" preset="heading" />
      </View>

      {/* User Profile Section */}
      <View style={styles.profileContainer}>
        <Image source={{ uri: `https://picsum.photos/seed/${data.id}/50/50` }} style={styles.profileImage} />
        <Text style={styles.userName}>{data.firstName}</Text>
        <Text style={styles.userDetails}>Phone: {data.phone}</Text>
        <Text style={styles.userDetails}>Email: {data.email}</Text>
      </View>

      {/* Posts Section */}
      <FlatList
        data={UserPostStore.userPostData}
        keyExtractor={(item,index) => `${item.id+index}`}
        renderItem={renderPostItem}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() =>
          loading ? (
            <ActivityIndicator size="large" color={colors.palette.primary500} />
          ) : null
        }
      />
    </View>
  );
});

// Styles using Ignite theme
const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    // padding: spacing.sm,
    marginTop:20,
    borderBottomWidth: 1,
    borderBottomColor: colors.palette.neutral200,
  },
  backButton: {
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.palette.primary500,
  },
  profileContainer: {
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.palette.primary500,
    borderRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: spacing.sm,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.palette.neutral100,
  },
  userDetails: {
    fontSize: 14,
    color: colors.palette.neutral100,
  },
  postContainer: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.palette.neutral200,
    borderRadius: 1,
    backgroundColor: colors.palette.neutral100,
    marginBottom: spacing.sm,
    elevation: 1,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.palette.neutral900,
  },
  postBody: {
    fontSize: 14,
    color: colors.palette.neutral700,
  },
};
