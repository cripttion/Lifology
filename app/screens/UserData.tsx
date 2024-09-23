import React, { FC, useEffect,useState } from "react";
import { View, ViewStyle, TextStyle, FlatList, ActivityIndicator, Image, StyleSheet, Pressable } from "react-native";
import { observer } from "mobx-react-lite";
import { Text } from "app/components";
import { AppStackParamList, AppStackScreenProps, NavigationProps } from "app/navigators";
import { colors, spacing } from "../theme";
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle";
import { useStores } from "app/models";
import { useNavigation } from "@react-navigation/native";
import Contact from "app/components/Contact";

// Define the types for user data
interface Address {
      address: string,
      city: string,
      state: string,
      stateCode: string,
      postalCode: string,
}
interface coordinates{
  lat:number,
  lng: number
}
interface Company {
  department: string,
  name: string,
  title:string,
   address:Address
    coordinates:coordinates
    country: string
}

interface User {
  id: number,
  firstName: string,
  email: string,
  phone: string,
  company: Company
}

interface UserDataProps extends AppStackScreenProps<"User"> {}

export const UserScreen: FC<UserDataProps> = observer(function UserScreen() {
  const { userDataStore } = useStores();
  const [userData,setUserData] = useState();
  const [count,setcount] = useState(0);
  const navigation = useNavigation();
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"]);
  const[loading,setLoading] = useState(false);
  useEffect(() => {
    userDataStore.fetchUserData();

  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
       setUserData(userDataStore.userData)
    }, 3000);

    // Cleanup function
    return () => clearTimeout(timer);
  }, []);
  const loadMoreData = () => {
    if (!userDataStore.loading && userDataStore.hasMore) {
      userDataStore.setProp('loading',true); // Start loading
      setLoading(true);
      // Show loading for 2 seconds before fetching more data
      setTimeout(() => {
        userDataStore.fetchUserData().then(() => {
          userDataStore.setProp('loading',false);
          setLoading(false); // Stop loading after data is fetched
        });
      }, 3000); // 3 seconds delay
    }
  };
 console.log(userData)
  const renderItem = ({ item }: { item: User }) => (
    <Pressable onPress={()=>navigation.navigate('UserPost',{data:item})}  style={styles.userContainer}>
      <Image
        source={{ uri: `https://picsum.photos/seed/${item.id}/50/50` }}
        style={styles.profilePicture}
      />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.firstName}</Text>
        <Text style={styles.details}>Email: {item.email}</Text>
        <Text style={styles.details}>Phone: {item.phone}</Text>
        <Text style={styles.details}>Company: {item?.company.name}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={$container}>
      <View style={$topContainer}>
        <Text testID="welcome-heading" style={$welcomeHeading} text="Lifology Users" preset="heading" />
        <Text text="contributed by @Pulak Raj" preset="formHelper" />
        <Contact />
      </View>

      <View style={[$bottomContainer, $bottomContainerInsets]}>
        <FlatList
          data={userDataStore?.userData}
          keyExtractor={(item, index) => `${item.id}-${index}`} // Use a unique key based on the user ID
          renderItem={renderItem}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.1} // Trigger loading more data when 50% from the bottom
          ListFooterComponent={() =>
            userDataStore.loading? (
              <ActivityIndicator size="large" color={colors.palette.primary500} />
            ) : null
          }
        />
      </View>
    </View>
  );
});

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.primary500,
};

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "20%",
  justifyContent: "center",
  paddingHorizontal: spacing.sm,
};

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "80%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  justifyContent: "space-around",
};

const $welcomeHeading: TextStyle = {
  marginBottom: spacing.xs,
  color:colors.palette.neutral100
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  details: {
    fontSize: 14,
    color: "#555",
  },
});
