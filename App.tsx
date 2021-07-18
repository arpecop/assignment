import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Image,
  TouchableHighlight,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

interface ListItemProps {
  image?: string;
  title?: string;
  sort?: number;
  route?: any;
  navigation?: any;
  list_image_url: string;
  description?: string;
  type: string;
  query: string;
}
const Item: React.FC<ListItemProps> = ({
  type,
  list_image_url,
  title,
  description,
  query,
}) => {
  const navigation = useNavigation();
  if (type === "service") {
    return (
      <TouchableHighlight
        onPress={() =>
          navigation.navigate("Details", {
            list_image_url,
            title,
            description,
            query,
          })
        }
      >
        <View
          style={{
            flexDirection: "row",
            height: 50,
            width: "100%",
          }}
        >
          <Image
            style={{ width: 40, height: 40, margin: 5, borderRadius: 2 }}
            source={{
              uri: list_image_url,
            }}
          />
          <View>
            <View>
              <Text>{title}</Text>
            </View>
            <View style={{ flexGrow: 1 }}>
              <Text>{description}</Text>
            </View>
          </View>
          <View
            style={{
              height: 50,
              flexGrow: 1,
              justifyContent: "center",
              alignSelf: "flex-end",
            }}
          >
            <Text style={{ fontSize: 15, textAlign: "right" }}>&#8594;</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  } else {
    return null;
  }
};

const Home: React.FC = () => {
  const [query, setQuery] = useState("");
  const [heroes, setData] = useState([]);
  const fetchData = async (query: string) => {
    const cached = await AsyncStorage.getItem("cachereq" + query);
    if (cached) {
      setData(JSON.parse(cached));
    } else {
      axios({
        method: "post",
        url: "https://login.fantasticxrm.com/api/v2.2/client",
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "x-profile": "58",
          "x-application":
            "4rd4spxv8eg4tsl5l9bs4nmeh92i47z2fx8oyljnwcoqkq0kyxd74brtwgre3xj7",
        },
        data: `{"requests":[{"method":"get","path":"/search","params":{"q":"/api/v2.2/client/search/","query":{"phrase":"${query}"}},"data":[]}]}`,
      }).then(function (response) {
        AsyncStorage.setItem(
          "cachereq" + query,
          JSON.stringify(response.data.responses[0].data)
        );
        setData(response.data.responses[0].data);
      });
    }
  };
  useEffect(() => {
    if (query.length >= 3) {
      fetchData(query);
    }
  }, [query]);
  useEffect(() => {
    fetchData("Boiler");
  }, []);
  const updateQuery = (input: string) => {
    setQuery(input.replace(/[0-9\-]+/g, "").toLocaleLowerCase());
  };

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={updateQuery}
        value={query}
        placeholder="Type Here..."
      />
      <View>
        <Text>Recent Searches</Text>
      </View>
      <View>
        <Text>Results</Text>
      </View>
      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "gray",
          justifyContent: "flex-start",
        }}
        data={heroes}
        //keyExtractor={(i) => i.info_image_url.toString()}
        extraData={query}
        renderItem={({ item }) => <Item {...item} query={query} />}
      />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
  },
  flatList: {
    fontSize: 20,
    borderBottomColor: "#26a69a",
    borderBottomWidth: 1,
    alignSelf: "stretch",
  },
});

const Details: React.FC<ListItemProps> = ({ route }) => {
  const { list_image_url, title, description, query } = route.params;
  return (
    <View>
      <Image
        style={{ width: 40, height: 40, margin: 5, borderRadius: 2 }}
        source={{
          uri: list_image_url,
        }}
      />
      <Text>
        {title} - {description} - {query}
      </Text>
    </View>
  );
};
const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
