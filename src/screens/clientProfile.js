import React from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  HamburgerIcon,
  Heading,
  HStack,
  Menu,
  Pressable,
  Text,
  VStack,
} from "native-base";
import {
  useDeleteAddressMutation,
  useDeleteContactMutation,
  useDeleteProgramInfoMutation,
  useDeleteProgramPartsMutation,
  useGetClientByIdQuery, useUpdateAddressMutation,
  useUpdateApprovalsMutation, useUpdateClientMutation, useUpdateContactMutation,
  useUpdateProgramsMutation,
  useUpdateStatusMutation,
} from "../services/client";
import S3 from "../utils/S3";
import Toolbar from "../components/toolbar";
import Table from "../components/table";
import Loading from "./loading";
import AddContactForm from "../forms/addContactForm";
import AddAddressForm from "../forms/addAddressForm";
import AddProgramForm from "../forms/addProgramForm";
import { useSelector } from "react-redux";
import Picker from "../components/picker";
import { useFieldArray, useForm } from "react-hook-form";
import { states, territories, types } from "../constants/dropdownValues";
import Popup from "../components/popup";
import TextInput from "../components/textInput";
import { showNotification } from "../components/notification";

const statusColors = {
  Potential: "primary.900",
  Queued: "warning.500",
  Declined: "error.600",
  Approved: "success.400",
  Pushed: "darkBlue.500",
};

export default function ClientProfile({ navigation, route }) {
  const clientId = route.params?.clientId;
  const user = useSelector(state => state.auth.user);
  const { data, error, isLoading } = useGetClientByIdQuery(clientId);
  const [openModal, setOpenModal] = React.useState(false);
  const [openAddressModal, setOpenAddressModal] = React.useState(false);
  const [openContactModal, setOpenContactModal] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const [updateStatus, result] = useUpdateStatusMutation();
  const [updateApprovals, result1] = useUpdateApprovalsMutation();
  const [updatePrograms, result2] = useUpdateProgramsMutation();
  const [deleteAddress, result3] = useDeleteAddressMutation();
  const [deleteContact, result4] = useDeleteContactMutation();
  const [deleteProgram, result5] = useDeleteProgramInfoMutation();
  const [deleteParts, result6] = useDeleteProgramPartsMutation();
  const [updateIndex, setUpdateIndex] = React.useState(null);

  React.useEffect(() => {
    const getFiles = async () => {
      setFiles(await S3.getFiles(user, data.basicInfo.name));
    };

  if (data) {
      getFiles();
    }
  }, [data, user]);

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
    const { control, handleSubmit, errors, setValue, reset } = useForm();
    const [updateInfo, result7] = useUpdateClientMutation();
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
          showNotification({
            text: "Client Name & Territory Successfully Updated",
          });
        })
    }

    return (
      <Popup open={open} setOpen={setOpen} header={"Edit Client Name & Territory"}>
        <TextInput
          control={control}
          title={"Client Name"}
          field={"client.name"}
        />
        <Picker
          control={control}
          title={"Territory"}
          field={"client.territory"}
          choices={territories}
        />

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

  const EditAddress = ({ open, setOpen, index }) => {
    const { control, handleSubmit, errors, setValue, reset } = useForm();
    const [updateAddress, result] = useUpdateAddressMutation();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
      setValue("addresses", data.addresses);
    }, [setValue, data])

    const onSubmit = values => {
      setLoading(!loading);
      updateAddress({
        id: data.addresses[index].id,
        clientId: clientId,
        body: {
          id: values.addresses[index].id,
          clientId: values.addresses[index].clientId,
          type: values.addresses[index].type,
          address1: values.addresses[index].address1,
          city: values.addresses[index].city,
          state: values.addresses[index].state,
          zip: values.addresses[index].zip,
        }
      })
        .unwrap()
        .then(res => {
          setUpdateIndex(null)
          setOpenAddressModal(false);
          setLoading(!loading);
          showNotification({
            text: "Address Successfully Updated",
          });
        })
    }

    return (
      <Popup open={open} setOpen={setOpen} header={"Edit Client Address"}>
        <Picker
          control={control}
          title={"Type"}
          field={`addresses[${index}].type`}
          choices={types}
        />
        <TextInput
          control={control}
          title={"Street"}
          field={`addresses[${index}].address`}
        />
        <TextInput
          control={control}
          title={"City"}
          field={`addresses[${index}].city`}
        />
        <Picker
          control={control}
          title={"State"}
          field={`addresses[${index}].state`}
          choices={states}
        />
        <TextInput
          control={control}
          title={"Zip"}
          field={`addresses[${index}].zip`}
        />

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

  const EditContact = ({ open, setOpen, index }) => {
    const { control, handleSubmit, errors, setValue, reset } = useForm();
    const [updateContact, result] = useUpdateContactMutation();
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
      setValue("contacts", data.contacts);
    }, [setValue, data])

    const onSubmit = values => {
      setLoading(!loading);
      updateContact({
        id: data.contacts[index].id,
        clientId: clientId,
        body: {
          id: values.contacts[index].id,
          clientId: values.contacts[index].clientId,
          name: values.contacts[index].name,
          title: values.contacts[index].title,
          phone: values.contacts[index].phone,
          email: values.contacts[index].email,
        }
      })
        .unwrap()
        .then(res => {
          setUpdateIndex(null)
          setOpenContactModal(false);
          setLoading(!loading);
          showNotification({
            text: "Contact Successfully Updated",
          });
        })
    }

    return (
      <Popup open={open} setOpen={setOpen} header={"Edit Client Contact"}>
        <TextInput
          control={control}
          title={"Name"}
          field={`contacts[${index}].name`}
        />
        <TextInput
          control={control}
          title={"Title"}
          field={`contacts[${index}].title`}
        />
        <TextInput
          control={control}
          title={"Phone"}
          field={`contacts[${index}].phone`}
        />
        <TextInput
          control={control}
          title={"Email"}
          field={`contacts[${index}].email`}
        />

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

  return (
    <HStack flex={1} justifyContent={"flex-start"} pt={5}>
      <Toolbar navigation={navigation} />

      <EditInfo open={openModal} setOpen={setOpenModal} index={updateIndex} />

      <EditAddress open={openAddressModal} setOpen={setOpenAddressModal} index={updateIndex} />

      <EditContact open={openContactModal} setOpen={setOpenContactModal} index={updateIndex} />

      <VStack flex={1}>
        <VStack mx={2}>
          <HStack
            alignItems={"center"}
            justifyContent={"space-between"}
            my={2}
            width={"100%"}>
            <HStack flex={1} justifyContent={"flex-start"} alignItems={"center"} h={"100%"}>
              <Heading color={"coolGray.800"} p={1}>
                {data.basicInfo.name}
              </Heading>
            </HStack>

            <HStack flex={1} justifyContent={"flex-end"} alignItems={"center"}>
              <Box
                alignItems={"center"}
                borderColor={"coolGray.500"}
                borderRadius={"lg"}
                borderWidth={1}
                bg={"coolGray.500"}
                colorScheme={"info"}
                mx={2}
                p={2}
                w={"25%"}>
                <Text color={"white"}>{data.basicInfo.territory || "None Selected"}</Text>
              </Box>

              <Box
                alignItems={"center"}
                borderColor={statusColors[data.status.current]}
                borderRadius={"lg"}
                borderWidth={1}
                bg={statusColors[data.status.current]}
                mx={2}
                p={2}
                w={"25%"}>
                <Text color={"white"}>{data.status.current}</Text>
              </Box>

              <Box ml={2}>
                <Menu
                  offset={10}
                  placement={"bottom right"}
                  trigger={triggerProps => (
                    <Pressable {...triggerProps}>
                      <HamburgerIcon size={8} color={"black"} />
                    </Pressable>
                  )}
                  w={200}>
                  <Menu.Group title={"Client Actions"}>
                    <Divider bg={"coolGray.400"} />

                    <Menu.Group title={"Edit"}>
                      <Menu.Item
                        isDisabled={
                          data.status.current !== "Potential" &&
                          data.status.current !== "Declined" &&
                          data.status.current !== "Updating"
                        }
                        onPress={() => setOpenModal(!openModal)}>
                        Edit Name & Territory
                      </Menu.Item>
                    </Menu.Group>

                    <Divider bg={"coolGray.400"} />

                    <Menu.Group title={"Client Pages"}>
                      <Menu.Item
                        onPress={() =>
                          navigation.push("ClientDetails", { clientId: clientId })
                        }
                        isDisabled={
                          data.status.current !== "Potential" &&
                          data.status.current !== "Declined" &&
                          data.status.current !== "Updating"
                        }>
                        Client Details
                      </Menu.Item>
                      <Menu.Item
                        isDisabled={!Object.values(data.programs).includes(1) || (data.status.current !== "Potential" && data.status.current !== "Updating" && data.status.current !== "Declined")}
                        onPress={() =>
                          navigation.push("ProgramDetails", {
                            programs: data.programs,
                            clientId: clientId,
                          })
                        }>
                        Program Details
                      </Menu.Item>
                      <Menu.Item
                        isDisabled={!Object.values(data.programs).includes(1) || (data.status.current !== "Potential" && data.status.current !== "Updating" && data.status.current !== "Updating")}
                        onPress={() =>
                          navigation.push("ProgramPricing", {
                            programs: data.programs,
                            clientId: clientId,
                          })
                        }>
                        Program Pricing
                      </Menu.Item>
                    </Menu.Group>

                    <Divider bg={"coolGray.400"} />

                    <Menu.Group title={"Edit Status"}>
                      <Menu.Item
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
                        }}
                        isDisabled={
                          data.status.current !== "Potential" &&
                          data.status.current !== "Declined"
                        }>
                        Submit Client
                      </Menu.Item>
                      <Menu.Item
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
                          showNotification({
                            text: "Client Status Successfully Updated"
                          })
                        }
                      }>
                        Remove from Queue
                      </Menu.Item>
                      <Menu.Item
                        onPress={() => {
                          updateStatus({ id: clientId, body: { status: "Pushed" } });
                        }}
                        isDisabled={data.status.current !== "Approved"}>
                        Push Client
                      </Menu.Item>
                      {/*<Menu.Item isDisabled={data.status.current === "Potential"}>*/}
                      {/*  Update Client*/}
                      {/*</Menu.Item>*/}
                    </Menu.Group>
                  </Menu.Group>
                </Menu>
              </Box>
            </HStack>
          </HStack>

          <Divider bg={"coolGray.800"} mb={5} />
        </VStack>

        <Table
          columnNames={["Type", "Street", "City", "State", "Zip"]}
          fields={["type", "address", "city", "state", "zip"]}
          data={data.addresses}
          title={"Addresses"}
          addIcon={data.status.current === "Potential" || data.status.current === "Updating" && true}
          form={
            data.addresses.length !== 3 ? (
              <AddAddressForm
                clientId={clientId}
                selectedAddresses={data.addresses}
              />
            ) : null
          }
          position={"left"}
          alertHeader={"Delete Address"}
          alertBody={
            "Are you sure you would like to delete this record? Once deleted, this record can not be retrieved."
          }
          rowAction={row => {
            deleteAddress({ clientId: row.clientId, id: row.id });
            showNotification({
              text: "Address Successfully Deleted."
            });
          }}
          edit={{
            func: setOpenAddressModal,
            variable: openAddressModal,
          }}
          setIndex={setUpdateIndex}
        />

        <Table
          columnNames={["Name", "Title", "Phone", "Email"]}
          fields={["name", "title", "phone", "email"]}
          data={data.contacts.map(item => ({
            name: item.name,
            title: item.title,
            phone: item.phone,
            email: item.email
          }))}
          title={"Contacts"}
          addIcon={data.status.current === "Potential" || data.status.current === "Updating" && true}
          editIcon={true}
          form={<AddContactForm clientId={clientId} />}
          position={"left"}
          alertHeader={"Delete Contact"}
          alertBody={
            "Are you sure you would like to delete this record? Once deleted, this record can not be retrieved."
          }
          rowAction={row => {
            deleteContact({ clientId: row.clientId, id: row.id });
            showNotification({
              text: "Contact Successfully Deleted."
            });
          }}
          editRow={true}
          edit={{
            func: setOpenContactModal,
            variable: openContactModal,
          }}
          setIndex={setUpdateIndex}
        />

        <HStack flex={1}>
          <VStack flex={1}>
            <Table
              columnNames={["Selected"]}
              data={formatPrograms(data.programs)}
              fields={["selection"]}
              title={"Programs"}
              addIcon={data.status.current === "Potential" || data.status.current === "Updating" && true}
              editIcon={true}
              form={
                <AddProgramForm
                  clientId={clientId}
                  selectedPrograms={formatPrograms(data.programs)}
                />
              }
              alertHeader={"Delete Program"}
              alertBody={
                "Are you sure you would like to delete this record? Once deleted, this record can not be retrieved and all related information (pricing and details) will be deleted."
              }
              rowAction={row => {
                updatePrograms({
                  id: clientId,
                  body: { [row.selection.toLowerCase()]: 0 },
                });
                deleteProgram({
                  program: row.selection.toLowerCase(),
                  id: clientId,
                });
                deleteParts({
                  program: row.selection,
                  id: clientId,
                });
                showNotification({
                  text: "Program Successfully Deleted."
                });
              }}
            />
          </VStack>
          <VStack flex={2}>
            <Table
              columnNames={["Name", "Type", "Size"]}
              data={formatFileArray(files)}
              fields={["name", "type", "size"]}
              title={"Files"}
              addIcon={data.status.current === "Potential" || data.status.current === "Updating" && true}
              editIcon={true}
              action={async () => await S3.putObject(user, data.basicInfo.name)}
              link={true}
              rowAction={S3.viewObject}
            />
          </VStack>
          <VStack flex={1}>
            <Table
              columnNames={["Manager", "Decision"]}
              data={formatApprovalsArr(data.approvals)}
              fields={["name", "value"]}
              title={"Approvals"}
              editIcon={false}
            />
          </VStack>
        </HStack>
      </VStack>
    </HStack>
  );
}
