import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import IconButton from "../components/iconButton";
import Toolbar from "../components/toolbar";
import { FlatList } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Pdf from "react-native-pdf";
import { openComposer } from "react-native-email-link";
import Loading from "./loading";
import Divider from "../components/divider";

const articles = [
  {
    title: "General FAQs",
    subtopics: [
      {
        title: "Adding a Client",
        url: "https://mcsurfacesinc-assets.s3.us-east-1.amazonaws.com/PDFs/Adding%20a%20Client.pdf"
      },
      {
        title: "Application Purpose",
        url: "https://mcsurfacesinc-assets.s3.us-east-1.amazonaws.com/PDFs/Application%20Purpose.pdf",
      },
    ]
  },
  {
    title: "Client Information",
    subtopics: [
      {
        title: "Contacts",
        url: "https://mcsurfacesinc-assets.s3.us-east-1.amazonaws.com/PDFs/Contacts.pdf",
      },
      {
        title: "Addresses",
        url: "https://mcsurfacesinc-assets.s3.us-east-1.amazonaws.com/PDFs/Addresses.pdf",
      },
      {
        title: "Programs",
        url: "https://mcsurfacesinc-assets.s3.us-east-1.amazonaws.com/PDFs/Programs.pdf",
      },
    ]
  },
  {
    title: "Process Flow",
    subtopics: [
      {
        title: "Client Status",
        url: "https://mcsurfacesinc-assets.s3.us-east-1.amazonaws.com/PDFs/Client%20Status.pdf",
      },
    ]
  }
]

// TODO:  - create divider component for FlatList
export default function Help({ navigation, route }) {
  const [category, setCategory] = React.useState(null);
  const [pageSource, setPageSource] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  console.log(navigation)

  return (
    <SafeAreaView>
      <View className={"flex-row h-full w-full justify-items-start"}>
        <Toolbar navigation={navigation} />

        <View className={"bg-gray-800 rounded-md mx-2 flex-1"}>
          <View className={"items-center justify-between flex-row py-2 px-2"}>
            <Text className={"font-quicksand text-4xl text-white"}>
              Application Purpose & FAQs

            </Text>
            <IconButton
              icon={<FontAwesome5 name={"flag"} size={24} color={"#dc2626"} solid/>}
              onPress={() => openComposer({
                to: "tech.admin@mcsurfacesinc.com",
                subject: "OnBoard - Error",
                body: ""
              })}
            />
          </View>

          <View className={"bg-gray-100 rounded-md m-2"}>
            <View className={"flex-row h-full"}>
              <FlatList
                flex={1}
                data={articles}
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress={() => setCategory(index)}>
                    <View className={"items-center justify-between flex-row p-4"}>
                      <Text className={"font-quicksand size-18"}>{item.title}</Text>

                      <FontAwesome5 name={"angle-right"} size={18} />
                    </View>
                    <Divider />
                  </TouchableOpacity>
                )}
              />
              <Divider orientation={"vertical"} />
              <FlatList
                flex={1}
                data={articles[category]?.subtopics}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => {
                    setLoading(true);
                    setPageSource(item.url);
                  }}>
                    <View className={"items-center justify-between flex-row p-4"}>
                      <Text className={"font-quicksand size-18"}>{item.title}</Text>

                      <FontAwesome5 name={"angle-right"} size={18} />
                    </View>
                    <Divider />
                  </TouchableOpacity>
                )}
              />
              <Divider orientation={"vertical"} />
              <View className={"w-1/2 justify-items-start"}>
                { pageSource &&
                  <Pdf
                    source={{ uri: pageSource }}
                    onLoadComplete={(numberOfPages,filePath) => {
                      setLoading(false);
                      console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages) => {
                      console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                      console.log(error);
                    }}
                    onPressLink={(uri) => {
                      console.log(`Link pressed: ${uri}`);
                    }}
                    style={{
                      flex: 1,
                      width: "100%",
                      height: "100%"
                    }}
                  />
                }
                { loading && !pageSource &&
                  <Loading navigation={null} />
                }
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}