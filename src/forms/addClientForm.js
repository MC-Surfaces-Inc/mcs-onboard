import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { states, territories, yesOrNo } from "../constants/dropdownValues";
import { useForm } from "react-hook-form";
import TextInput from "../components/input";
import {
  useCreateAddressMutation, useCreateAirtableClientMutation,
  useCreateClientMutation, useCreateFolderMutation, useCreateInternalFolderMutation, useUpdateClientMutation,
} from "../services/client";
import { useSelector } from "react-redux";
import { ErrorMessage } from "@hookform/error-message";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { toast } from "../components/toast";
import Button from "../components/button";
import Divider from "../components/divider";
import Dropdown from "../components/dropdown";

export default function AddClientForm({ progress, width, isOpen }) {
  const user = useSelector(state => state.auth.user);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      client: {
        name: "",
        territory: "",
      },
      address: {
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
      },
    }
  });
  const [createClient, { isLoading, isUpdating }] = useCreateClientMutation();
  const [createAddress, status] = useCreateAddressMutation();
  const [createFolder, result] = useCreateFolderMutation();
  const [createInternalFolder, result2] = useCreateInternalFolderMutation();
  const [createAirtableClient, result3] = useCreateAirtableClientMutation();
  const [updateClient, result4] = useUpdateClientMutation();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 2 * width.value }],
  }));

  const onSubmit = async (values) => {
    let clientId = null;
    let parentId = null;
    let createdId = null;
    let sharepointUrl = null;

    setLoading(true);
    createClient({
      ...values.client,
      userId: user.id,
      employeeNumber: user.sageEmployeeNumber,
    })
      .unwrap()
      .then(res => {
        clientId = res.data.insertId;

        createAddress({
          id: res.data.insertId,
          body: {
            ...values.address,
            type: "Corporate",
            clientId: res.data.insertId,
          },
        });
        setLoading(false);
        toast.success({
          message: "Client Successfully Created",
          title: "Success!",
        });
        reset({
          client: {
            name: "",
            territory: "",
          },
          address: {
            address1: "",
            address2: "",
            city: "",
            state: "",
            zip: "",
          },
        });
      });

    if (!values.client.territory) {
      toast.danger({
        title: "Whoops, no territory specified!",
        message: "To create a folder in SharePoint, you'll need to enter a territory for this client.",
      });

      return;
    }

    // CREATE FOLDERS FOR CLIENT
    // Jobs, Programs, Purchase Orders, Selection Sheets and Diagrams
    if (values.client.territory === "Austin") {
      parentId = "01XZCDNO6TTXM6UZXBFBC33WJWWDN3EEBJ";
    } else if (values.client.territory === "Dallas") {
      parentId = "01XZCDNO4JKCYSEARSCZDJYLUGIHQ2SKQP";
    } else if (values.client.territory === "Houston") {
      parentId = "01XZCDNO4WAPZ5LVJ33JG2JGIWKKSM6Z2B";
    } else if (values.client.territory === "San Antonio") {
      parentId = "01XZCDNOZKISHGJNG4DRCY7AVLE5VUPAJQ";
    }

    await createFolder({ parentId: parentId, folder: values.client.name })
      .unwrap()
      .then(async (res) => {
        toast.success({
          title: "Success!",
          message: "Folder Successfully Created",
        });

        // Need to receive created ID back
        createdId = res.id;
        sharepointUrl = res.webUrl;

        // Create Top Folder
        createInternalFolder({
          body: {
            clientId: clientId,
            sharepointId: createdId,
            sharepointParentId: parentId,
          }
        });

        // Create subfolders
        let res1 = await createFolder({ parentId: createdId, folder: "Jobs" });
        let res2 = await createFolder({ parentId: createdId, folder: "Programs" });
        let res3 = await createFolder({ parentId: createdId, folder: "Purchase Orders" });

        await createAirtableClient({
          body: {
            name: values.client.name,
            territory: values.client.territory,
            sharepointId: createdId,
            sharepointUrl: sharepointUrl,
            jobsSharePointId: res1.data.id,
            email: user.email,
          }
        }).unwrap()
          .then(res => {
            updateClient({
              id: clientId,
              body: {
                airtableId: res1.data.id
              }
            });

            toast.success({
              title: "Success!",
              message: "Airtable Client Created",
            })
          });
      });
  };

  return (
    <Animated.View
      className={"bg-gray-100 rounded-md border border-gray-400 shadow-md"}
      onLayout={(e) => {
        width.value = e.nativeEvent.layout.width;
      }}
      style={[sheetStyles.sheet, sheetStyle]}
    >
      <ScrollView className={"pr-2"}>
        <View className={"flex-col"}>
          <Text className={"font-quicksand text-2xl text-gray-800 my-2"}>Add a Client</Text>
          <Divider />
          <TextInput
            control={control}
            field={"client.name"}
            title={"Client Name"}
            rules={{
              required: "Required Field"
            }}
            errorMessage={<ErrorMessage errors={errors} name={"client.name"} />}
          />

          <Dropdown
            title={"Territory"}
            options={territories}
            control={control}
            field={"client.territory"}
          />

          <TextInput
            control={control}
            field={"address.address1"}
            title={"Corporate Address 1"}
          />

          <TextInput
            control={control}
            field={"address.address2"}
            title={"Corporate Address 2"}
          />

          <TextInput
            control={control}
            field={"address.city"}
            title={"Corporate City"}
          />

          <Dropdown
            title={"Corporate State"}
            options={states}
            control={control}
            field={"address.state"}
          />

          <TextInput
            control={control}
            field={"address.zip"}
            title={"Corporate Zip"}
          />
        </View>

        <View className={"flex-row justify-between mt-5"}>
          <Button
            title={"Cancel"}
            type={"outlined"}
            size={"md"}
            color={"error"}
            onPress={() => {
              isOpen.value = !isOpen.value;
              reset();
            }}
          />
          <Button
            title={"Save"}
            type={"contained"}
            size={"md"}
            color={"success"}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const sheetStyles = StyleSheet.create({
  sheet: {
    padding: 5,
    paddingHorizontal: 10,
    width: 400,
    height: '100%',
    position: 'absolute',
    right: 0,
    zIndex: 3,
  },
});