import React from "react";
import { FlatList } from "react-native";
import {
  Badge,
  Box,
  Divider,
  Heading,
  HStack,
  IconButton,
  Popover,
  Pressable,
  StatusBar,
  Text,
  VStack,
} from "native-base";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useGetClientsByUserQuery } from "../services/client";
import { useGetUserInfoQuery } from "../services/user";
import Toolbar from "../components/toolbar";
import AddClientForm from "../forms/addClientForm";
import S3 from "../utils/S3";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/auth/authSlice";
import Loading from "./loading";
import { useGetAllSageClientsQuery } from "../services/sage";

const statusColors = {
  Potential: "primary.900",
  Queued: "warning.500",
  Declined: "error.600",
  Approved: "success.400",
  Pushed: "darkBlue.500",
};

export default function Home({ navigation }) {
  const user = useSelector(state => state.auth.user);

  React.useEffect(() => {
    if (user) {
      S3.createBucket(`${user.sageUserId}-${user.sageEmployeeNumber}`);
    }
  }, [user]);

  const ClientList = ({ user }) => {
    const { data = [], error, isLoading } = useGetClientsByUserQuery(user.id);

    return (
      <FlatList
        data={data.clients}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              navigation.push("ClientProfile", { clientId: item.clientId });
            }}>
            <HStack
              alignItems={"center"}
              justifyContent={"space-between"}
              p={4}>
              <Box>
                <Text fontSize={"lg"}>{item.name}</Text>
              </Box>
              <HStack alignItems={"center"}>
                <Box>
                  {item.territory && <Badge bg={"coolGray.500"} style={{ marginRight: 10 }} _text={{ color: "white" }}>{item.territory}</Badge>}
                </Box>
                <Box>
                  {item.status && <Badge bg={statusColors[item.status]} style={{ marginRight: 10 }} _text={{ color: "white" }}>{item.status}</Badge>}
                </Box>
                <FontAwesome5 name={"angle-right"} size={18} />
              </HStack>
            </HStack>
            <Divider />
          </Pressable>
        )}
        keyExtractor={item => item.clientId}
        flex={1}
      />
    );
  };

  if (user === null || user === undefined) {
    return <Loading navigation={navigation} />;
  }

  return (
    <HStack flex={1} justifyContent={"flex-start"} pt={5}>
      <StatusBar />
      <Toolbar navigation={navigation} />

      <VStack bg={"coolGray.800"} borderRadius={"md"} flex={2} m={2}>
        <HStack alignItems={"center"} justifyContent={"space-between"}>
          <Heading color={"#fafaf9"} pb={1} pl={5} pt={2.5}>
            Client List
          </Heading>

          <Box>
            <Popover
              trigger={triggerProps => (
                <IconButton
                  icon={
                    <FontAwesome5
                      name={"user-plus"}
                      size={20}
                      color={"#fafaf9"}
                    />
                  }
                  my={2.5}
                  {...triggerProps}
                />
              )}>
              <AddClientForm />
            </Popover>
          </Box>
        </HStack>

        <Divider />

        <VStack bg={"#fafaf9"} borderRadius={"md"} flex={1} m={2.5}>
          <ClientList user={user} />
        </VStack>
      </VStack>

      <VStack flex={1}>
        <VStack bg={"coolGray.800"} borderRadius={"md"} flex={1} m={2}>
          <Heading color={"#fafaf9"} pb={1} pl={5} pt={2.5} m={1}>
            Notifications
          </Heading>
          <Divider />

          <VStack bg={"#fafaf9"} borderRadius={"md"} flex={1} m={2.5}>
            <FlatList flex={1} />
          </VStack>
        </VStack>

        <VStack bg={"coolGray.800"} borderRadius={"md"} flex={1} m={2}>
          <Heading color={"#fafaf9"} pb={1} pl={5} pt={2.5} m={1}>
            Documents
          </Heading>
          <Divider />

          <VStack bg={"#fafaf9"} borderRadius={"md"} flex={1} m={2}>
            <FlatList flex={1} />
          </VStack>
        </VStack>
      </VStack>
    </HStack>
  );
}
