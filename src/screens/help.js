import React from "react";
import { Box, Divider, Heading, HStack, IconButton, Pressable, StatusBar, Text, VStack } from "native-base";
import Toolbar from "../components/toolbar";
import { FlatList } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Pdf from "react-native-pdf";
import { openComposer, openInbox } from "react-native-email-link";
import Loading from "./loading";

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

export default function Help({ navigation, route }) {
  const [category, setCategory] = React.useState(null);
  const [pageSource, setPageSource] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  console.log(navigation)

  return (
    <HStack flex={1} justifyContent={"flex-start"} pt={5}>
      <StatusBar />
      <Toolbar navigation={navigation} />

      <VStack flex={1}>
        <VStack bg={"coolGray.800"} borderRadius={"md"} flex={1} m={2}>
          <HStack alignItems={"center"} justifyContent={"space-between"}>
            <Heading color={"#fafaf9"} pb={1} pl={5} pt={2.5} m={1.5}>
              Help Articles & Documentation
            </Heading>
            <IconButton
              icon={<FontAwesome5 name={"flag"} size={24} color={"#dc2626"} solid/>}
              my={2.5}
              onPress={() => openComposer({
                to: "tech.admin@mcsurfacesinc.com",
                subject: "OnBoard - Error",
                body: ""
              })}/>
          </HStack>
          <Divider />

          <VStack bg={"#fafaf9"} borderRadius={"md"} flex={1} m={2.5}>
            <HStack h={"100%"}>
              <FlatList
                flex={1}
                data={articles}
                renderItem={({ item, index }) => (
                  <Pressable onPress={() => setCategory(index)}>
                    <HStack
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      p={4}>
                      <Box>
                        <Text fontSize={"lg"}>{item.title}</Text>
                      </Box>
                      <HStack alignItems={"center"}>
                        <FontAwesome5 name={"angle-right"} size={18} />
                      </HStack>
                    </HStack>
                    <Divider/>
                  </Pressable>
                )}
              />
              <Divider orientation={"vertical"} />
              <FlatList
                flex={1}
                data={articles[category]?.subtopics}
                renderItem={({ item }) => (
                  <Pressable onPress={() => {
                    setLoading(true);
                    setPageSource(item.url);
                  }}>
                    <HStack
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      p={4}>
                      <Box>
                        <Text fontSize={"lg"}>{item.title}</Text>
                      </Box>
                      <HStack alignItems={"center"}>
                        <FontAwesome5 name={"angle-right"} size={18} />
                      </HStack>
                    </HStack>
                    <Divider/>
                  </Pressable>
                )}
              />
              <Divider orientation={"vertical"} />
              <Box flex={2} justifyContent={"flex-start"}>
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
              </Box>
            </HStack>
          </VStack>
        </VStack>
      </VStack>

    </HStack>
  )
}