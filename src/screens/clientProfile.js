import React from "react";
import {
  useCreateFileMutation,
  useCreateFolderMutation, useCreateInternalFolderMutation,
  useDeleteAddressMutation,
  useDeleteContactMutation,
  useDeleteProgramInfoMutation,
  useDeleteProgramPartsMutation,
  useGetClientByIdQuery, useGetFilesQuery,
  useUpdateAddressMutation,
  useUpdateApprovalsMutation,
  useUpdateContactMutation,
  useUpdateProgramsMutation,
  useUpdateStatusMutation,
} from "../services/client";
import Toolbar from "../components/toolbar";
import Badge from "../components/badge";
import Table from "../components/table";
import Divider from "../components/divider";
import Loading from "./loading";
import AddContactForm from "../forms/addContactForm";
import AddAddressForm from "../forms/addAddressForm";
import AddProgramForm from "../forms/addProgramForm";
import { useFieldArray, useForm } from "react-hook-form";
import { types } from "../constants/dropdownValues";
import { toast } from "../components/toast";
import { Linking, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import Menu from "../components/menu";
import { useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import EditClientForm from "../forms/editClientForm";
import { setIsLocked } from "../features/client/clientSlice";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IconButton from "../components/iconButton";
import DocumentPicker from "@react-native-documents/picker";
import FormData from "form-data";

const statusColors = {
  Potential: "bg-slate-600",
  Queued: "bg-yellow-500",
  Declined: "bg-red-600",
  Approved: "bg-green-500",
  Pushed: "bg-blue-950",
};

const tableColumns = {
  addresses: ["Type", "Address 1", "Address 2", "City", "State", "Zip"],
  contacts: ["Name", "Title", "Email", "Phone"],
  approvals: ["Name", "Value"],
  programs: ["Selection"],
  files: ["Name", "Size", "Created By", "Created Time"]
}

/* TODO:  - Adjust tables for screen size
          - Fix portait orientation
 */
export default function ClientProfile({ navigation, route }) {
  const clientId = route.params?.clientId
  const dispatch = useDispatch();
  const isLocked = useSelector(state => state.client.isLocked);
  const { data, isLoading } = useGetClientByIdQuery(clientId);
  const [openPushClientModal, setOpenPushClientModal] = React.useState(false);
  const [updateStatus, result] = useUpdateStatusMutation();
  const [updateApprovals, result1] = useUpdateApprovalsMutation();
  const open = useSharedValue(false);
  const width = useSharedValue(0);
  const progress = useDerivedValue(() =>
    withTiming(open.value ? 0 : 1, { duration: 500 })
  );

  React.useEffect(() => {
    if (data) {
      if (["Queued", "Approved", "Pushed"].includes(data.status.current)) {
        dispatch(setIsLocked({ isLocked: true }));
      } else {
        dispatch(setIsLocked({ isLocked: false }));
      }
    }
  }, [data]);

  if (data === undefined || isLoading) {
    return <Loading navigation={navigation} />;
  }

  const AddressTable = ({ data, clientId }) => {
    const { control, register, setValue, handleSubmit, reset } = useForm({
      defaultValues: {
        addresses: data.addresses
      }
    });
    const { fields } = useFieldArray({
      control,
      name: "addresses",
      keyName: "addressId"
    });
    const [updateAddress, result] = useUpdateAddressMutation();
    const [deleteAddress, result3] = useDeleteAddressMutation();
    const [loading, setLoading] = React.useState(false);

    const onDelete = values => {
      values.forEach((item, index) => {
        deleteAddress({ clientId: item.clientId, id: item.id })
          .unwrap()
          .then(res => {
            console.log(res);
            toast.success({
              title: "Success!",
              message: "Address Successfully Deleted",
            });
          });
      });
    }

    const onEdit = values => {
      values.addresses.forEach((item, index) => {
        updateAddress({ clientId: item.clientId, id: item.id, body: item })
          .unwrap()
          .then(res => {
            console.log(res);
            toast.success({
              title: "Success!",
              message: "Address Successfully Updated",
            });
          });
      });
    }

    return (
      <Table
        title={"Addresses"}
        data={fields}
        columns={tableColumns.addresses}
        columnStyle={["w-2/12", "w-3/12", "w-2/12", "w-2/12", "w-1/12", "w-2/12"]}
        control={control}
        Form={<AddAddressForm clientId={clientId} selections={data.addresses} />}
        fieldTypes={[
          {type: "picker", choices: types, cellAction: null},
          {type: "input", cellAction: null},
          {type: "input", cellAction: null},
          {type: "input", cellAction: null},
          {type: "input", cellAction: null},
          {type: "input", cellAction: null}
        ]}
        isLocked={!isLocked}
        onEdit={handleSubmit(onEdit)}
        onDelete={onDelete}
        onCancel={() => console.log(data.addresses)}
      />
    )
  }

  const ContactTable = ({ data, clientId }) => {
    const { control, register, setValue, handleSubmit } = useForm({
      defaultValues: {
        contacts: data.contacts
      }
    });
    const { fields } = useFieldArray({
      control,
      name: "contacts",
      keyName: "contactId"
    });
    const [updateContact, result] = useUpdateContactMutation();
    const [deleteContact, result4] = useDeleteContactMutation();

    const onDelete = values => {
      values.forEach((item, index) => {
        deleteContact({ clientId: item.clientId, id: item.id })
          .unwrap()
          .then(res => {
            console.log(res);
            toast.success({
              title: "Success!",
              message: "Contact Successfully Deleted",
            });
          });
      });
    }

    const onEdit = values => {
      values.contacts.forEach((item, index) => {
        updateContact({ clientId: item.clientId, id: item.id, body: item })
          .unwrap()
          .then(res => {
            console.log(res);
            toast.success({
              title: "Success!",
              message: "Contact Successfully Updated",
            });
          });
      });
    }

    const mailTo = cell => {
      const mailToUrl = `mailto:${cell.address}`;

      Linking.canOpenURL(mailToUrl).then(supported => {
        if (supported) {
          return Linking.openURL(mailToUrl);
        } else {
          toast.danger({
            title: "Whoops!",
            message: "Couldn't open your email app"
          })
        }
      })
    }

    return (
      <Table
        title={"Contacts"}
        data={data.contacts}
        columns={tableColumns.contacts}
        columnStyle={["w-3/12", "w-2/12", "w-4/12", "w-3/12"]}
        Form={<AddContactForm clientId={clientId} />}
        fieldTypes={[{type: "input"}, {type: "input"}, {type: "input"}, {type: "input"}]}
        isLocked={!isLocked}
        control={control}
        onEdit={handleSubmit(onEdit)}
        onDelete={onDelete}
        onCancel={() => console.log(data.contacts)}
      />
    );
  }

  const ApprovalsTable = ({ data }) => {
    const formatApprovalsArr = arr => {
      if (arr === undefined) {
        return [];
      }

      return Object.keys(arr).map(x => ({
        name: x,
        key: x,
        value:
          data.approvals[x] === 1
            ? "Approved"
            : data.approvals[x] === 0
              ? "Declined"
              : "No Response",
      }));
    };

    return (
      <Table
        title={"Approvals"}
        data={formatApprovalsArr(data.approvals)}
        columns={tableColumns.approvals}
        columnStyle={["w-1/2", "w-1/2"]}
      />
    );
  }

  const ProgramTable = ({ data, clientId }) => {
    const { control, register, setValue } = useForm({
      defaultValues: {
        programs: data.programs
      }
    });
    const { fields } = useFieldArray({
      control,
      name: "programs",
      keyName: "programId"
    });
    const [updatePrograms, result2] = useUpdateProgramsMutation();
    const [deleteParts, result6] = useDeleteProgramPartsMutation();
    const [deleteProgram, result5] = useDeleteProgramInfoMutation();

    const formatPrograms = arr => {
      return Object.keys(arr)
        .filter(x => arr[x] === 1)
        .map((x, index) => ({ id: index, selection: x, key: x }));
    };

    const onDelete = values => {
      values.forEach((item, index) => {
        let tableName = item.selection;

        if (item.selection.charAt(item.selection.length-1) === "s") {
          tableName = item.selection.slice(0, -1);
        }

        updatePrograms({
          id: clientId,
          body: {[item.selection.toLowerCase()]: 0 },
        })
          .unwrap()
          .then(res1 => {
            deleteProgram({
              program: tableName.toLowerCase(),
              id: clientId,
            })
              .unwrap()
              .then(res2 => {
                deleteParts({
                  program: item.selection,
                  id: clientId,
                })
                  .unwrap()
                  .then(res3 => {
                    toast.success({
                      title: "Success!",
                      message: "Program Successfully Deleted",
                    });
                  });
              });
          });
      });
    }

    return (
      <Table
        title={"Programs"}
        data={formatPrograms(data.programs)}
        columns={tableColumns.programs}
        columnStyle={["w-full"]}
        Form={<AddProgramForm clientId={clientId} selections={formatPrograms(data.programs)} />}
        isLocked={!isLocked}
        control={control}
        onDelete={onDelete}
        scrollEnabled={true}
      />
    )
  }

  const FileTable = ({ client, clientId }) => {
    const [id, setId] = React.useState(client.folder.sharepointId);
    const [files, setFiles] = React.useState([]);
    const [filePath, setFilePath] = React.useState([]);
    const [textFilePath, setTextFilePath] = React.useState([]);
    const [fileInput, setFileInput] = React.useState("");
    const [showInput, setShowInput] = React.useState(false);
    const { data, isLoading } = useGetFilesQuery(id);
    const [createFolder, result] = useCreateFolderMutation();
    const [createFile, result2] = useCreateFileMutation();

    React.useEffect(() => {
      if (filePath.length === 0) {
        setFilePath([...filePath, client.folder.sharepointId]);
      }
    }, [client, setFilePath, filePath]);

    React.useEffect(() => {
      if (textFilePath.length === 0) {
        setTextFilePath([...textFilePath, client.basicInfo.name]);
      }
    }, [client, setTextFilePath, textFilePath]);

    React.useEffect(() => {
      if (data) {
        setFiles(data.map((file) => ({
          ...file,
          size: `${(file["size"]/(1024 * 1024)).toFixed(2)} MBs`,
          createdtime: new Date(file["createdDateTime"]).toLocaleString(),
          createdby: file["createdBy"].user.displayName,
          viewFile: file.hasOwnProperty("file") ? webURL => viewFile(webURL) : null,
          navigateToFolder: file.hasOwnProperty("folder") ? (destID, parentId, fileName) => navigateToFolder(destID, parentId, fileName) : null,
        })));
      }
    }, [data, setFiles]);

    const onDelete = values => {
      console.log(values);
      // Delete if folder (recursive)
      // Delete if file
    }

    const uploadFolder = () => {
      createFolder({ parentId: filePath[filePath.length - 1], folder: fileInput })
        .unwrap()
        .then(res => {
          console.log(res);
          toast.success({
            title: "Success!",
            message: "Folder Successfully Created",
          });
        })
    }

    const uploadFile = async () => {
      const formData = new FormData();
      let file = await pickFile();
      formData.append("file", file);

      createFile({ parentId: filePath[filePath.length - 1], body: formData })
        .unwrap()
        .then(res => {
          toast.success({
            title: "Success!",
            message: "File Successfully Uploaded",
          });
        });
    }

    const pickFile = async() => {
      try {
        const res = await DocumentPicker.pick({
          type: DocumentPicker.types.allFiles,
        });

        return res;
      } catch (error) {
        if (DocumentPicker.isCancel(error)) {
          return "Cancelled";
        } else {
          console.log(error);
        }
      }
    }

    const navigateToFolder = (destID, parentId, fileName) => {
      if (filePath.includes(destID)) {
        setFilePath(filePath.filter(x => x === destID));
        setTextFilePath(textFilePath.filter(x => x === fileName));
        setId(filePath[filePath.length - 2]);
      } else {
        setFilePath(prevFilePath => [...prevFilePath, destID]);
        setTextFilePath(prevFilePath => [...prevFilePath, fileName]);
        setId(destID);
      }
    }

    const viewFile = async(webURL) => {
      const supported = await Linking.canOpenURL(webURL);

      if (supported) {
        await Linking.openURL(webURL);
      } else {
        toast.info({ title: "Failed to Open", message: "Looks like this URL isn't supported.", duration: 5000 });
      }
    }

    const ActionBar = () => (
      <View className={`flex-row bg-gray-100 items-center justify-between py-2`}>
        <View className={"flex-row items-center"}>
          <IconButton
            icon={
              <FontAwesome5
                name={"arrow-left"}
                size={20}
                color={"#172554"}
                className={"m-2"}
              />
            }
            onPress={() => {
              navigateToFolder(filePath[filePath.length - 2], textFilePath[textFilePath.length - 2]);
            }}
            disabled={filePath.length === 1}
            className={"border border-gray-800 rounded-lg  mx-1 h-10 w-10 mr-2"}
          />
          {textFilePath.map((fileName, index) => (
            <React.Fragment key={fileName}>
              <Text className={"font-quicksand ml-1"}>{fileName}</Text>
              <Text className={"font-quicksand ml-1"}>/</Text>
            </React.Fragment>
          ))}
        </View>

        <View className={"flex-row items-center justify-end"}>
          {showInput &&
            <React.Fragment>
              <TextInput
                className={`w-1/2 rounded-l-lg border-gray-400 border-r-orange-500 border h-10 p-2 font-quicksand focus:border-orange-500`}
                placeholder={"Folder Name"}
                cursorColor={"#F97316"}
                value={fileInput}
                onChangeText={setFileInput}
              />
              <IconButton
                icon={
                  <FontAwesome5
                    name={"save"}
                    size={20}
                    color={"#FFFFFF"}
                  />
                }
                onPress={() => uploadFolder()}
                className={"bg-orange-500 h-10 w-10 p-2 rounded-r-lg"}
              />
            </React.Fragment>
          }

          <IconButton
            icon={
              <FontAwesome5
                name={showInput ? "window-close" : "folder-plus"}
                size={20}
                color={"#172554"}
                className={"m-2"}
              />
            }
            onPress={() => setShowInput(!showInput)}
            className={"border border-gray-800 rounded-lg mx-1 ml-2 h-10 w-10"}
          />
          <IconButton
            icon={
              <FontAwesome5
                name={"file-upload"}
                size={20}
                color={"#172554"}
                className={"m-2"}
              />
            }
            onPress={() => {
              uploadFile();
            }}
            className={"border border-gray-800 rounded-lg  mx-1 h-10 w-10"}
          />
        </View>
      </View>
    );

    return (
      <Table
        title={"Files"}
        data={files}
        columns={tableColumns.files}
        columnStyle={["w-4/12", "w-2/12", "w-2/12", "w-4/12"]}
        isLocked={!isLocked}
        onDelete={onDelete}
        // onCancel={() => console.log(data.contacts)}
        scrollEnabled={client.folder ? true : false}
        ActionBar={ActionBar}
        fileTable={true}
        isLoading={isLoading}
      />
    );
  }

  const NonExistingFileTable = ({ data, clientId }) => {
    const [createFolder, result] = useCreateFolderMutation();
    const [createInternalFolder, result2] = useCreateInternalFolderMutation();

    const uploadFolder = () => {
      let parentId = null;

      if (!data.basicInfo.territory) {
        toast.danger({
          title: "Whoops, no territory specified!",
          message: "To create a folder in SharePoint, you'll need to enter a territory for this client.",
        });

        return;
      }

      if (data.basicInfo.territory === "Austin") {
        parentId = "01XZCDNO6TTXM6UZXBFBC33WJWWDN3EEBJ";
      } else if (data.basicInfo.territory === "Dallas") {
        parentId = "01XZCDNO4JKCYSEARSCZDJYLUGIHQ2SKQP";
      } else if (data.basicInfo.territory === "Houston") {
        parentId = "01XZCDNO4WAPZ5LVJ33JG2JGIWKKSM6Z2B";
      } else if (data.basicInfo.territory === "San Antonio") {
        parentId = "01XZCDNOZKISHGJNG4DRCY7AVLE5VUPAJQ";
      }

      createFolder({ parentId: parentId, folder: data.basicInfo.name })
        .unwrap()
        .then(res => {
          createInternalFolder({
            body: {
              clientId: clientId,
              sharepointId: res.id,
              sharepointParentId: parentId,
            }
          });

          // Create subfolders
          createFolder({ parentId: res.id, folder: "Jobs" });
          createFolder({ parentId: res.id, folder: "Programs" });
          createFolder({ parentId: res.id, folder: "Purchase Orders" });

          toast.success({
            title: "Success!",
            message: "Folder Successfully Created",
          });
        });
    }

    const emptyComponent = () => (
      <View className={"flex-row items-center p-2 w-11/12"}>
        <FontAwesome5 name={"exclamation-triangle"} size={26} color={"#F97315"} />
        <Text className={"font-quicksand font-bold text-gray-800 text-wrap ml-2"}>
          Whoops, there's no folder in SharePoint for this client. Would you like to
          <Text> </Text>
          <Text
            className={"font-quicksand font-bold text-gray-800 underline"}
            onPress={() => uploadFolder()}>
            create one
          </Text>
          ?
        </Text>
      </View>
    );

    return (
      <Table
        title={"Files"}
        data={[]}
        columns={tableColumns.files}
        columnStyle={["w-4/12", "w-2/12", "w-2/12", "w-4/12"]}
        isLocked={!isLocked}
        emptyComponent={emptyComponent}
        // onCancel={() => console.log(data.contacts)}
        scrollEnabled={false}
        fileTable={true}
      />
    );
  }

  return (
    <SafeAreaView>
      <View className={"flex-row h-full"}>
        <Toolbar navigation={navigation} />

        <ScrollView className={"flex-1"}>
          <View className={"mx-1"}>
            <View className={"flex-row items-center justify-between my-2"}>
              <Text className={"font-quicksand text-4xl text-gray-800 ml-2"}>
                {data.basicInfo.name}
              </Text>

              <View className={"flex-row flex-1 justify-end items-center z-50"}>
                <Badge label={data.basicInfo.territory} className={"bg-gray-800 w-1/4"}/>
                <Badge label={data.status.current} className={`${statusColors[data.status.current]} w-1/4`}/>

                <Menu>
                  <Menu.Title title={"Client Actions"} />
                  <Menu.Item
                    title={"Edit Name & Territory"}
                    disabled={isLocked}
                    onPress={() => {
                      open.value = !open.value;
                    }}
                  />
                  <Divider />
                  <Menu.Title title={"Client Pages"} />
                  <Menu.Item
                    title={"Client Details"}
                    onPress={() =>
                      navigation.push("ClientDetails", { clientId: clientId })
                    }
                  />
                  <Menu.Item
                    title={"Program Details"}
                    onPress={() =>
                      navigation.push("ProgramDetails", {
                        programs: data.programs,
                        clientId: clientId
                      })
                    }
                  />
                  <Menu.Item
                    title={"Program Pricing"}
                    onPress={() =>
                      navigation.push("ProgramPricing", {
                        programs: data.programs,
                        clientId: clientId
                      })
                    }
                  />
                  <Divider />
                  <Menu.Title title={"Edit Status"} />
                  <Menu.Item
                    title={"Submit Client"}
                    onPress={() => {
                      updateStatus({
                        id: clientId,
                        body: { current: "Queued" }
                      })
                        .unwrap()
                        .then(res => {
                          updateApprovals({
                            id: clientId,
                            body: {
                              edythc: null,
                              lisak: null,
                              kimn: null,
                            },
                          });

                          toast.success({ title: "Success!", message: "Client Status successfully updated" });
                        });
                    }}
                    disabled={isLocked}
                  />
                  <Menu.Item
                    title={"Remove from Queue"}
                    disabled={data.status.current !== "Queued"}
                    onPress={() => {
                      updateStatus({
                        id: clientId,
                        body: { current: "Potential" }
                      })
                        .unwrap()
                        .then(res => {
                          updateApprovals({
                            id: clientId,
                            body: {
                              edythc: null,
                              lisak: null,
                              kimn: null,
                            },
                          });

                          toast.success({ title: "Success!", message: "Client Status successfully updated" });
                        });
                    }}
                  />
                  <Menu.Item
                    title={"Push Client"}
                    onPress={() => {
                      setOpenPushClientModal(!openPushClientModal);
                      // updateStatus({ id: clientId, body: { status: "Pushed" } });
                    }}
                    disabled={true}
                  />
                </Menu>
              </View>
            </View>
          </View>

          <Divider bg={"coolGray.800"} mb={5} />

          <View className={"w-full"}>
            <View className={"z-40"}>
              <AddressTable clientId={clientId} data={data} />
            </View>
            <View className={"z-30"}>
              <ContactTable clientId={clientId} data={data} />
            </View>

            <View className={"flex-row z-20"}>
              { data.approvals &&
                <View className={"w-1/2"}>
                  <ApprovalsTable clientId={clientId} data={data} />
                </View>
              }
              <View className={"w-1/2 flex-1"}>
                <ProgramTable clientId={clientId} data={data} />
              </View>
            </View>
          </View>

          <View className={"w-full z-10"}>
            {data.folder ?
              <FileTable clientId={clientId} client={data} />
              :
              <NonExistingFileTable clientId={clientId} data={data} />
            }
          </View>
        </ScrollView>
        <View className={"items-center justify-center h-full"}>
          <EditClientForm
            data={data}
            clientId={clientId}
            width={width}
            progress={progress}
            isOpen={open}
          />
        </View>
      </View>

    </SafeAreaView>
  );
}
