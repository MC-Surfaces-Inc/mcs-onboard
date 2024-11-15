import React from "react";
import {
  Button,
  Center,
  FormControl,
  Heading,
  HStack,
} from "native-base";
import {
  useDeleteAddressMutation,
  useDeleteContactMutation,
  useDeleteProgramInfoMutation,
  useDeleteProgramPartsMutation,
  useGetClientByIdQuery, useGetSageDataQuery,
  useUpdateAddressMutation,
  useUpdateApprovalsMutation,
  useUpdateClientMutation,
  useUpdateContactMutation,
  useUpdateProgramsMutation,
  useUpdateStatusMutation,
} from "../services/client";
import S3 from "../utils/S3";
import Toolbar from "../components/toolbar";
import Badge from "../components/badge";
import Table from "../components/table";
import Divider from "../components/divider";
import Loading from "./loading";
import AddContactForm from "../forms/addContactForm";
import AddAddressForm from "../forms/addAddressForm";
import AddProgramForm from "../forms/addProgramForm";
import { useDispatch, useSelector } from "react-redux";
import Picker from "../components/picker";
import { useFieldArray, useForm } from "react-hook-form";
import { states, territories, types } from "../constants/dropdownValues";
import Popup from "../components/popup";
import TextInput from "../components/input";
import { toast } from "../components/toast";
import { ErrorMessage } from "@hookform/error-message";
import _ from "lodash";
import { setStatus } from "../features/client/clientSlice";
import { useCreateSageClientMutation, useGetSagePartClassesQuery } from "../services/sage";
import { SafeAreaView, Text, View } from "react-native";
import IconButton from "../components/iconButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Menu from "../components/menu";
import { useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";

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
  programs: ["Selection"]
}

/* TODO:  - Fix notification/toast system for tables
          - Add in form functionality for Addresses, Contacts and Programs
          - Add complete File functionality
          - Adjust tables for screen size
          - Fix portait orientation
 */
export default function ClientProfile({ navigation, route }) {
  const clientId = route.params?.clientId
  // const user = useSelector(state => state.auth.user);
  const { data, isLoading } = useGetClientByIdQuery(clientId);
  // const dispatch = useDispatch();
  // const client = useSelector(state => state.client);
  const openMenu = useSharedValue(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [editInfo, setEditInfo] = React.useState(false);
  const [deleteInfo, setDeleteInfo] = React.useState(false);
  const [openAddressModal, setOpenAddressModal] = React.useState(false);
  const [openContactModal, setOpenContactModal] = React.useState(false);
  const [openPushClientModal, setOpenPushClientModal] = React.useState(false);

  // const [files, setFiles] = React.useState([]);
  const [updateStatus, result] = useUpdateStatusMutation();
  const [updateApprovals, result1] = useUpdateApprovalsMutation();
  // const [updatePrograms, result2] = useUpdateProgramsMutation();
  // const [deleteContact, result4] = useDeleteContactMutation();
  // const [deleteProgram, result5] = useDeleteProgramInfoMutation();
  // const [deleteParts, result6] = useDeleteProgramPartsMutation();
  // const [updateIndex, setUpdateIndex] = React.useState(null);

  const menuLinks = [
    {
      title: "Edit Name & Territory",
      action: () => setOpenModal(!openModal),
      disabled: false,
    },
    {
      title: "Client Details",
      action: () => navigation.push("ClientDetails", { clientId: clientId }),
      disabled: false,
    },
    {
      title: "Program Details",
      action: () => navigation.push("Program Details", { clientId: clientId, programs }),
      disabled: false,
    },
    {
      title: "Program Pricing",
      action: null,
      disabled: false,
    },
  ]

  // React.useEffect(() => {
  //   const getFiles = async () => {
  //     setFiles(await S3.getFiles(user, data.basicInfo.name));
  //   };
  //
  //   if (data) {
  //     dispatch(setStatus(data.status.current));
  //     getFiles();
  //   }
  // }, [data, user]);

  React.useEffect(() => {
    if (data) {
      if (!["Queued", "Approved", "Pushed"].includes(data.status.current)) {
        setEditInfo(true);
        setDeleteInfo(true);
      }
    }
  }, [data, setEditInfo]);

  if (data === undefined || isLoading) {
    return <Loading navigation={navigation} />;
  }

  const formatFileArray = arr => {
    if (arr === undefined) {
      return [];
    }

    let newArr = arr.map((file, index) => ({
      name: file.Name,
      type: file.Name.split(".")[file.Name.split(".").length - 1],
      size: (file.Size / 1024).toFixed(2) + " KBs",
      Bucket: file.Bucket,
      Key: file.Key,
    }));

    return newArr;
  };

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

  const formatPrograms = arr => {
    return Object.keys(arr)
      .filter(x => arr[x] === 1)
      .map((x, index) => ({ selection: x, key: x }));
  };

  const EditInfo = ({open, setOpen }) => {
    const { control, handleSubmit, setValue, formState: { errors } } = useForm();
    const [updateInfo, result] = useUpdateClientMutation();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
      setValue("client", {
        name: data.basicInfo.name,
        territory: data.basicInfo.territory,
      });
    }, [setValue, data])

    const onSubmit = values => {
      setLoading(!loading);
      updateInfo({
        id: clientId,
        body: {
          ...values.client
        }
      })
        .unwrap()
        .then(res => {
          setOpen(false);
          setLoading(!loading);
          toast.success({
            title: "Success!",
            message: "Client Name & Territory Successfully Updated",
          });
        })
    }

    if (errors.client === undefined) {
      errors.client = {};
    }

    return (
      <Popup open={open} setOpen={setOpen} header={"Edit Client Name & Territory"}>
        <FormControl isRequired isInvalid={'name' in errors.client}>
          <TextInput
            control={control}
            title={"Client Name"}
            field={"client.name"}
            rules={{
              required: "Required Field"
            }}
            error={<ErrorMessage errors={errors} name={"client.name"} />}
          />
        </FormControl>
        <FormControl isRequired isInvalid={'territory' in errors.client}>
          <Picker
            control={control}
            title={"Territory"}
            field={"client.territory"}
            choices={territories}
            rules={{
              required: "Required Field"
            }}
            error={<ErrorMessage errors={errors} name={"client.territory"}  />}
          />
        </FormControl>

        <Center>
          <Button
            _loading={{
              bg: "success.400",
            }}
            bg={"success.400"}
            isLoading={loading}
            isLoadingText={"Submitting"}
            m={5}
            onPress={handleSubmit(onSubmit)}
            width={"35%"}>
            Save
          </Button>
        </Center>
      </Popup>
    );
  }

  const PushClient = ({ open, setOpen }) => {
    const partClasses = useGetSagePartClassesQuery();
    const { data, isLoading } = useGetSageDataQuery(clientId);
    const [createSageClient, result] = useCreateSageClientMutation();
    const [firstStatus, setFirstStatus] = React.useState(false);
    const [secondStatus, setSecondStatus] = React.useState(false);

    const createClient = async (loading, setLoading, status, setStatus) => {
      setLoading(!loading);
      createSageClient({ body: data })
        .unwrap()
        .then((result) => {
          setStatus(!status);
          showNotification({
            text: "Client successfully created in Sage."
          });
        })
        .catch((error) => {
          console.error(error);
        });
      setLoading(!loading);
    }

    const createPartClasses = () => {
      const territoryPartClasses = {
        "Austin": ["10000", "20000"],
        "Dallas": ["20000", "30000"],
        "Houston": ["30000", "40000"],
        "San Antonio": ["40000", "50000"]
      }
    }

    // const onSubmit = values => {
    //   setLoading(!loading);
    //   updateContact({
    //     id: data.contacts[index].id,
    //     clientId: clientId,
    //     body: {
    //       id: values.contacts[index].id,
    //       clientId: values.contacts[index].clientId,
    //       name: values.contact.name,
    //       title: values.contact.title,
    //       phone: values.contact.phone,
    //       email: values.contact.email,
    //     }
    //   })
    //     .unwrap()
    //     .then(res => {
    //       setUpdateIndex(null)
    //       setOpenContactModal(false);
    //       setLoading(!loading);
    //       showNotification({
    //         text: "Contact Successfully Updated",
    //       });
    //     })
    // }

    return (
      <Popup open={open} setOpen={setOpen} header={"Push Client"}>
        <HStack justifyContent={"space-between"} alignItems={"center"} mx={2} my={2}>
          <Heading size={"md"}>Create Client</Heading>
          <Button bg={"success.400"} isDisabled={firstStatus} onPress={() => createClient(firstStatus, setFirstStatus)} w={"30%"}>Submit</Button>
        </HStack>
        <Divider/>
        <HStack justifyContent={"space-between"} alignItems={"center"} mx={2} my={2}>
          <Heading size={"md"}>Create Part Classes</Heading>
          <Button bg={"success.400"} w={"30%"} isDisabled={!firstStatus} onPress={() => createPartClasses()}>Submit</Button>
        </HStack>
        <Divider/>
        <HStack justifyContent={"space-between"} alignItems={"center"} mx={2} my={2}>
          <Heading size={"md"}>Export Parts to Excel</Heading>
          <Button bg={"success.400"} w={"30%"} isDisabled={!secondStatus}>Submit</Button>
        </HStack>
      </Popup>
    );
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
              message: "Address Successfully Added",
            });
          });
      });
    }

    const onEdit = values => {
      console.log(values);
    }

    return (
      <Table
        title={"Addresses"}
        data={fields}
        columns={tableColumns.addresses}
        columnStyle={["w-2/12", "w-3/12", "w-2/12", "w-2/12", "w-1/12", "w-2/12"]}
        Form={<AddAddressForm clientId={clientId} selections={data.addresses} />}
        editInfo={editInfo}
        control={control}
        onEdit={() => handleSubmit(onEdit)}
        onDelete={onDelete}
        onCancel={() => reset(data.addresses)}
      />
    )
  }

  const ContactTable = ({ data, clientId }) => {
    const { control, register, setValue } = useForm({
      defaultValues: {
        contacts: data.contacts
      }
    });
    const { fields } = useFieldArray({
      control,
      name: "contacts"
    });
    const [updateContact, result] = useUpdateContactMutation();
    const [loading, setLoading] = React.useState(false);

    const onSubmit = values => {
      // setLoading(!loading);
      // updateContact({
      //   id: data.contacts[index].id,
      //   clientId: clientId,
      //   body: {
      //     id: values.contacts[index].id,
      //     clientId: values.contacts[index].clientId,
      //     name: values.contact.name,
      //     title: values.contact.title,
      //     phone: values.contact.phone,
      //     email: values.contact.email,
      //   }
      // })
      //   .unwrap()
      //   .then(res => {
      //     setUpdateIndex(null)
      //     setOpenContactModal(false);
      //     setLoading(!loading);
      //     showNotification({
      //       text: "Contact Successfully Updated",
      //     });
      //   })
    }

    return (
      <Table
        title={"Contacts"}
        data={data.contacts}
        columns={tableColumns.contacts}
        columnStyle={["w-3/12", "w-2/12", "w-4/12", "w-2/12"]}
        Form={<AddContactForm />}
        editInfo={editInfo}
        control={control}
        onSubmit={onSubmit}
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
      name: "programs"
    });

    return (
      <Table
        title={"Programs"}
        data={formatPrograms(data.programs)}
        columns={tableColumns.programs}
        columnStyle={["w-full"]}
        Form={<AddProgramForm clientId={clientId} selections={formatPrograms(data.programs)} />}
        // edit={editInfo}
        control={control}
        deleteInfo={deleteInfo}
      />
    )
  }

  return (
    <SafeAreaView>
      <View className={"flex-row h-full"}>
        <Toolbar navigation={navigation} />

        {/*<EditInfo open={openModal} setOpen={setOpenModal} index={updateIndex} />*/}

        {/*<EditAddress open={openAddressModal} setOpen={setOpenAddressModal} index={updateIndex} />*/}

        {/*<EditContact open={openContactModal} setOpen={setOpenContactModal} index={updateIndex} />*/}

        {/*<PushClient open={openPushClientModal} setOpen={setOpenPushClientModal} />*/}

        <View className={"flex-1"}>
          <View className={"z-30 mx-1"}>
            <View className={"flex-row items-center justify-between my-2"}>
              <Text className={"font-quicksand text-4xl text-gray-800 ml-2"}>
                {data.basicInfo.name}
              </Text>

              <View className={"flex-row flex-1 justify-end items-center"}>
                <Badge label={data.basicInfo.territory} className={"bg-gray-800 w-1/4"}/>
                <Badge label={data.status.current} className={`${statusColors[data.status.current]} w-1/4`}/>

                <Menu options={menuLinks}>
                  <Menu.Title title={"Client Actions"} />
                  <Menu.Item
                    title={"Edit Name & Territory"}
                    // isDisabled={!client.permissions.name.edit && !client.permissions.territory.edit}
                    onPress={() => console.log("1")}
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
                        clientId: clientId,
                      })
                    }
                  />
                  <Menu.Item
                    title={"Program Pricing"}
                    onPress={() =>
                      navigation.push("Program Pricing", {
                        programs: data.programs,
                        clientId: clientId,
                      })
                    }
                  />
                  <Divider />
                  <Menu.Title title={"Edit Status"} />
                  <Menu.Item
                    title={"Submit Client"}
                    onPress={() => {
                      updateStatus({ id: clientId, body: { status: "Queued" } });
                      updateApprovals({
                        id: clientId,
                        body: {
                          edythc: null,
                          lisak: null,
                          kimn: null,
                        },
                      });
                      // showNotification({
                      //   text: "Client Status Successfully Updated"
                      // });
                    }}
                    isDisabled={
                      data.status.current !== "Potential" &&
                      data.status.current !== "Declined"
                    }
                  />
                  <Menu.Item
                    title={"Remove from Queue"}
                    isDisabled={data.status.current !== "Queued"}
                    onPress={() => {
                      updateStatus({ id: clientId, body: { status: "Potential" } });
                      updateApprovals({
                        id: clientId,
                        body: {
                          edythc: null,
                          lisak: null,
                          kimn: null,
                        },
                      });
                      // showNotification({
                      //   text: "Client Status Successfully Updated"
                      // });
                    }}
                  />
                  <Menu.Item
                    title={"Push Client"}
                    onPress={() => {
                      setOpenPushClientModal(!openPushClientModal);
                      // updateStatus({ id: clientId, body: { status: "Pushed" } });
                    }}
                    isDisabled={data.status.current !== "Approved"}
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

            <View className={"flex-row"}>
              <View className={"w-1/4"}>
                <Table
                  title={"Approvals"}
                  data={formatApprovalsArr(data.approvals)}
                  columns={tableColumns.approvals}
                  columnStyle={["w-1/2", "w-1/2"]}
                />
              </View>
              <View className={"w-1/4"}>
                <ProgramTable clientId={clientId} data={data} />
                {/*<Table*/}
                {/*  data={formatPrograms(data.programs)}*/}
                {/*  fields={["selection"]}*/}
                {/*  title={"Programs"}*/}
                {/*  addIcon={data.status.current === "Potential" || data.status.current === "Updating" && true}*/}
                {/*  editIcon={true}*/}
                {/*  form={*/}
                {/*    <AddProgramForm*/}
                {/*      clientId={clientId}*/}
                {/*      selectedPrograms={formatPrograms(data.programs)}*/}
                {/*    />*/}
                {/*  }*/}
                {/*  alertHeader={"Delete Program"}*/}
                {/*  alertBody={*/}
                {/*    "Are you sure you would like to delete this record? Once deleted, this record can not be retrieved and all related information (pricing and details) will be deleted."*/}
                {/*  }*/}
                {/*  rowAction={row => {*/}
                {/*    updatePrograms({*/}
                {/*      id: clientId,*/}
                {/*      body: {[row.selection.toLowerCase()]: 0 },*/}
                {/*    });*/}
                {/*    deleteProgram({*/}
                {/*      program: row.selection.toLowerCase(),*/}
                {/*      id: clientId,*/}
                {/*    });*/}
                {/*    deleteParts({*/}
                {/*      program: row.selection,*/}
                {/*      id: clientId,*/}
                {/*    });*/}
                {/*    showNotification({*/}
                {/*      text: "Program Successfully Deleted."*/}
                {/*    });*/}
                {/*  }}*/}
                {/*  deleteRow={true}*/}
                {/*/>*/}
              </View>
              </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
