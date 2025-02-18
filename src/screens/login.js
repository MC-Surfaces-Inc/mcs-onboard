import React, { useState } from "react";
import Button from "../components/button";
import Config from "react-native-config";
import { useDispatch } from "react-redux";
import { saveToken, setUser } from "../features/auth/authSlice";
import { Linking, StyleSheet, Text, View } from "react-native";
import { useForm } from "react-hook-form";
import TextInput from "../components/input";
import Divider from "../components/divider";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import {
  AuthFlowType,
  CognitoIdentityProviderClient, ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { useGetUserInfoQuery } from "../services/user";
import IconButton from "../components/iconButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1"
});

export default function Login() {
  const [email, setEmail] = useState(null);
  const [token, setToken] = useState(null);
  const { data } = useGetUserInfoQuery(email);
  const openSignIn = useSharedValue(true);
  const openSignUp = useSharedValue(false);
  const openForgotPassword = useSharedValue(false);
  const openConfirmationCode = useSharedValue(false);
  const openConfirmPasswordReset = useSharedValue(false);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (data?.user) {
      dispatch(setUser(data.user));
      dispatch(saveToken(token));
    }
  }, [data, token, setUser, saveToken, dispatch]);

  const onPressSignUp = () => {
    openSignUp.value = true;
    openSignIn.value = false;
    openForgotPassword.value = false;
    openConfirmationCode.value = false;
    openConfirmPasswordReset.value = false;
  }

  const onPressSignIn = () => {
    openSignUp.value = false;
    openSignIn.value = true;
    openForgotPassword.value = false;
    openConfirmationCode.value = false;
    openConfirmPasswordReset.value = false;
  }

  const onPressConfirmSignUp = () => {
    openSignUp.value = false;
    openSignIn.value = false;
    openForgotPassword.value = false;
    openConfirmationCode.value = true;
    openConfirmPasswordReset.value = false;
  }

  const onPressResetPassword = () => {
    openSignUp.value = false;
    openSignIn.value = false;
    openForgotPassword.value = true;
    openConfirmationCode.value = false;
    openConfirmPasswordReset.value = false;
  }

  const onPressConfirmResetPassword = () => {
    openSignUp.value = false;
    openSignIn.value = false;
    openForgotPassword.value = false;
    openConfirmationCode.value = false;
    openConfirmPasswordReset.value = true;
  }

  const SignIn = ({ isExpanded, duration=150 }) => {
    const [error, setError] = useState(null);
    const [secureEntry, setSecureEntry] = useState(true);
    const height = useSharedValue(0);
    const { control, handleSubmit, formState: {errors} } = useForm({
      initialValues: {
        email: "",
        password: "",
      },
      resolver: yupResolver(yup.object().shape({
        email: yup.string().email("Invalid Email").required("Email is required"),
        password: yup.string().required("Password is required"),
      }))
    });

    const derivedHeight = useDerivedValue(() =>
      withTiming(height.value * Number(isExpanded.value), {
        duration,
      })
    );

    const bodyStyle = useAnimatedStyle(() => ({
      height: derivedHeight.value,
    }));

    const signIn = async(values) => {
      const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: Config.COGNITO_CLIENT_ID,
        AuthParameters: {
          USERNAME: values.email,
          PASSWORD: values.password
        },
      });

      try {
        const response = await cognitoClient.send(command);

        if (response?.$metadata.httpStatusCode === 200) {
          // store token and redirect
          setEmail(values.email);
          setToken(response.AuthenticationResult.AccessToken);

          // // save user to auth slice
          // if (data.user) {
          //   dispatch(setUser(data.user));
          //   dispatch(saveToken(response.AuthenticationResult.AccessToken));
          // }
        } else {
          // throw error notification
        }
      } catch (error) {
        console.log("Error: " + error);
        setError("Whoops! Looks like your email or password is incorrect.");
        throw error;
      }
    }

    const microsoftSignIn = async() => {
      const url = `${Config.COGNITO_OAUTH_URI}/authorize?identity_provider=${Config.COGNITO_MICROSOFT_IDP}&client_id=${Config.COGNITO_CLIENT_ID}&response_type=code&redirect_uri=mcsurfacesinc.onboard://`;
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      }
    }

    Linking.addEventListener('url', async ({ url }) => {
      const formattedUrl = new URL(url).searchParams;
      const code = formattedUrl.get("code");

      if (code) {
        // post code to retrieve token
        await axios.post(`${Config.COGNITO_OAUTH_URI}/token`, {
          grant_type: "authorization_code",
          client_id: Config.COGNITO_CLIENT_ID,
          code: code,
          redirect_uri: "mcsurfacesinc.onboard://"
        }, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        }).then(async (res) => {
          let token = res.data.access_token;

          await axios.get(`${Config.COGNITO_OAUTH_URI}/userInfo`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            }
          }).then(async (res) => {
            // store token and redirect
            setEmail(res.data.email);
            setToken(token);
          }).catch((err) => {
            console.log(err);
          });
        }).catch(err =>
          console.log(err)
        );
      }
    });

    return (
      <Animated.View style={[styles.animatedView, bodyStyle]}>
        <View
          onLayout={e => {
            height.value = e.nativeEvent.layout.height;
          }}
          className={`rounded-b-lg bg-white z-10 -mt-2`}
        >
          <View className={"flex-col items-center mt-10 my-6 z-10"}>
            <TextInput
              control={control}
              title={"Email"}
              field={"email"}
              containerStyle={"w-3/4"}
              autoCapitalize={"none"}
              errors={errors}
            />
            <TextInput
              control={control}
              title={"Password"}
              field={"password"}
              secureTextEntry={secureEntry}
              containerStyle={"w-3/4"}
              rightIcon={
                <IconButton
                  icon={<FontAwesome5 name={secureEntry ? "eye" : "eye-slash"} color={"#374151"}/>}
                  onPress={() => setSecureEntry(!secureEntry)}
                />
              }
              errors={errors}
              autoCapitalize={"none"}
            />

            {error && <Text className={"font-quicksand color-red-700 text-center w-3/4 mt-2"}>{error}</Text>}

            <Button
              title={"Forgot Password?"}
              type={"text"}
              size={"xl"}
              color={"default"}
              fontClass={"underline"}
              onPress={() => onPressResetPassword()}
            />
            <Button
              title={"Login"}
              type={"contained"}
              size={"xl"}
              color={"action"}
              className={"bg-orange-500 w-1/2 h-10 rounded-md items-center"}
              onPress={handleSubmit(signIn)}
            />

            <View className={"flex-row w-1/4 justify-center items-center"}>
              <Divider className={"w-20"} />
              <Text className={"font-quicksand mx-2"}>or</Text>
              <Divider className={"w-20"} />
            </View>

            <Button
              title={"Sign Up"}
              type={"contained"}
              size={"xl"}
              color={"default"}
              className={"w-1/2 h-10 rounded-md items-center"}
              fontClass={"text-white"}
              onPress={() => onPressSignUp()}
            />
          </View>

          <View className={"items-center h-16 justify-center rounded-lg z-20"}>
            <Button
              title={"Login with Microsoft"}
              type={"contained"}
              size={"xl"}
              color={"default"}
              className={"w-full h-16 rounded-lg items-center -mb-1"}
              fontClass={"text-white"}
              textIcon={
                <FontAwesome5 name={"windows"} color={"white"} className={"mx-2"} size={20}/>
              }
              onPress={() => microsoftSignIn()}
            />
          </View>
        </View>
      </Animated.View>
    );
  }

  const SignUp = ({ isExpanded, duration=150 }) => {
    const height = useSharedValue(0);
    const { control, handleSubmit, formState: {errors} } = useForm({
      initialValues: {
        email: "",
        password: "",
        confirmPassword: "",
      },
      resolver: yupResolver(yup.object().shape({
        email: yup.string().email("Invalid Email").required("Email is required"),
        password: yup.string().required("Password is required").oneOf([yup.ref("confirmPassword")], "Passwords do not match"),
        confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords do not match"),
      }))
    });

    const derivedHeight = useDerivedValue(() =>
      withTiming(height.value * Number(isExpanded.value), {
        duration,
      })
    );

    const bodyStyle = useAnimatedStyle(() => ({
      height: derivedHeight.value,
    }));

    const signUp = async(values) => {
      const command = new SignUpCommand({
        ClientId: Config.COGNITO_CLIENT_ID,
        Username: values.email,
        Password: values.password,
        UserAttributes: [{ Name: "email", Value: values.email }],
      });

      try {
        const response = await cognitoClient.send(command);

        if (response?.$metadata.httpStatusCode === 200) {
          onPressConfirmSignUp();
        } else {
          // throw error notification
        }
      } catch (error) {
        throw error;
      }
    }

    return (
      <Animated.View style={[styles.animatedView, bodyStyle]}>
        <View
          onLayout={e => {
            height.value = e.nativeEvent.layout.height;
          }}
          className={`rounded-b-lg bg-white z-10 -mt-2`}
        >
          <View className={"items-center -mt-0.5 mb-4 z-10 pt-12 pb-6 border-b border-x border-gray-400 rounded-b-xl"}>
            <Text className={"font-quicksand text-2xl"}>Sign Up</Text>
          </View>

          <View className={"flex-col items-center mb-4 z-10"}>
            <TextInput
              control={control}
              title={"Email"}
              field={"email"}
              containerStyle={"w-3/4"}
              autoCapitalize={"none"}
              errors={errors}
            />
            <TextInput
              control={control}
              title={"Password"}
              field={"password"}
              containerStyle={"w-3/4"}
              autoCapitalize={"none"}
              errors={errors}
            />
            <TextInput
              control={control}
              title={"Confirm Password"}
              field={"confirmPassword"}
              containerStyle={"w-3/4"}
              autoCapitalize={"none"}
              errors={errors}
            />

            <View className={"flex-row items-center my-4"}>
              <Button
                title={"Cancel"}
                type={"outlined"}
                size={"md"}
                color={"error"}
                className={"h-10 m-2 rounded-md items-center"}
                // fontClass={"text-white"}
                onPress={() => onPressSignIn()}
              />
              <Button
                title={"Sign Up"}
                type={"contained"}
                size={"md"}
                color={"default"}
                className={"h-10 m-2 rounded-md items-center"}
                fontClass={"text-white"}
                onPress={handleSubmit(signUp)}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }

  const ConfirmSignUp = ({ isExpanded, duration=150 }) => {
    const height = useSharedValue(0);
    const { control, handleSubmit, formState: {errors} } = useForm({
      initialValues: {
        email: "",
        code: "",
      },
      resolver: yupResolver(yup.object().shape({
        email: yup.string().email("Invalid Email").required("Email is required"),
        code: yup.string().required("Code is required"),
      })),
    });

    const derivedHeight = useDerivedValue(() =>
      withTiming(height.value * Number(isExpanded.value), {
        duration,
      })
    );

    const bodyStyle = useAnimatedStyle(() => ({
      height: derivedHeight.value,
    }));

    const confirmSignUp = async(values) => {
      const command = new ConfirmSignUpCommand({
        ClientId: Config.COGNITO_CLIENT_ID,
        Username: values.email,
        ConfirmationCode: values.code,
      });

      try {
        const response = await cognitoClient.send(command);
        console.log(response)
        if (response?.$metadata.httpStatusCode === 200) {
          // show notification
          onPressSignIn();
        }

        return response;
      } catch (error) {
        throw error;
      }
    }

    return (
      <Animated.View style={[styles.animatedView, bodyStyle]}>
        <View
          onLayout={e => {
            height.value = e.nativeEvent.layout.height;
          }}
          className={`rounded-b-lg bg-white z-10 -mt-2`}
        >
          <View className={"items-center -mt-0.5 mb-4 z-10 pt-12 pb-6 border-b border-x border-gray-400 rounded-b-xl"}>
            <Text className={"font-quicksand text-2xl"}>Verify Identity</Text>

            <Divider className={"mt-4"} />
          </View>

          <View className={"flex-col items-center mb-4 z-10"}>
            <TextInput
              control={control}
              title={"Email"}
              field={"email"}
              containerStyle={"w-3/4"}
              autoCapitalize={"none"}
              errors={errors}
            />
            <TextInput
              control={control}
              title={"Confirmation Code"}
              field={"code"}
              containerStyle={"w-3/4"}
              autoCapitalize={"none"}
              errors={errors}
            />

            <View className={"flex-row items-center my-4"}>
              <Button
                title={"Cancel"}
                type={"outlined"}
                size={"md"}
                color={"error"}
                className={"h-10 m-2 rounded-md items-center"}
                // fontClass={"text-white"}
                onPress={() => onPressSignIn()}
              />
              <Button
                title={"Sign Up"}
                type={"contained"}
                size={"md"}
                color={"default"}
                className={"h-10 m-2 rounded-md items-center"}
                fontClass={"text-white"}
                onPress={handleSubmit(confirmSignUp)}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }

  const ForgotPassword = ({ isExpanded, duration=150 }) => {
    const height = useSharedValue(0);
    const { control, handleSubmit, formState: {errors} } = useForm({
      initialValues: {
        email: "",
      },
      resolver: yupResolver(yup.object().shape({
        email: yup.string().email("Invalid Email").required("Email is required"),
      }))
    });

    const derivedHeight = useDerivedValue(() =>
      withTiming(height.value * Number(isExpanded.value), {
        duration,
      })
    );

    const bodyStyle = useAnimatedStyle(() => ({
      height: derivedHeight.value,
    }));

    const resetPassword = async(values) => {
      const command = new ForgotPasswordCommand({
        ClientId: Config.COGNITO_CLIENT_ID,
        Username: values.email,
      });

      try {
        const response = await cognitoClient.send(command);

        if (response?.$metadata.httpStatusCode === 200) {
          onPressConfirmResetPassword();
        } else {
          // throw error notification
        }
      } catch (error) {
        throw error;
      }
    }

    return (
      <Animated.View style={[styles.animatedView, bodyStyle]}>
        <View
          onLayout={e => {
            height.value = e.nativeEvent.layout.height;
          }}
          className={`rounded-b-lg bg-white z-10 -mt-2`}
        >
          <View className={"items-center -mt-0.5 mb-4 z-10 pt-12 pb-6 border-b border-x border-gray-400 rounded-b-xl"}>
            <Text className={"font-quicksand text-2xl"}>Reset Password</Text>
          </View>

          <View className={"flex-col items-center mb-4 z-10"}>
            <TextInput
              control={control}
              title={"Email"}
              field={"email"}
              containerStyle={"w-3/4"}
              autoCapitalize={"none"}
              errors={errors}
            />

            <View className={"flex-row items-center my-4"}>
              <Button
                title={"Cancel"}
                type={"outlined"}
                size={"md"}
                color={"error"}
                className={"h-10 m-2 rounded-md items-center"}
                // fontClass={"text-white"}
                onPress={() => onPressSignIn()}
              />
              <Button
                title={"Reset Password"}
                type={"contained"}
                size={"md"}
                color={"default"}
                className={"h-10 m-2 rounded-md items-center"}
                fontClass={"text-white"}
                onPress={handleSubmit(resetPassword)}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }

  const ConfirmPasswordReset = ({ isExpanded, duration=150 }) => {
    const height = useSharedValue(0);
    const { control, handleSubmit, formState: {errors} } = useForm({
      initialValues: {
        email: "",
        password: "",
        confirmPassword: "",
        code: ""
      },
      resolver: yupResolver(yup.object().shape({
        email: yup.string().email("Invalid Email").required("Email is required"),
        password: yup.string().required("Password is required").oneOf([yup.ref("confirmPassword")], "Passwords do not match"),
        confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords do not match"),
        code: yup.string().required("Code is required"),
      }))
    });

    const derivedHeight = useDerivedValue(() =>
      withTiming(height.value * Number(isExpanded.value), {
        duration,
      })
    );

    const bodyStyle = useAnimatedStyle(() => ({
      height: derivedHeight.value,
    }));

    const resetPassword = async(values) => {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: Config.COGNITO_CLIENT_ID,
        Username: values.email,
        Password: values.password,
        ConfirmationCode: values.code
      });

      try {
        const response = await cognitoClient.send(command);

        if (response?.$metadata.httpStatusCode === 200) {
          onPressSignIn();
        } else {
          // throw error notification
        }
      } catch (error) {
        throw error;
      }
    }

    return (
      <Animated.View style={[styles.animatedView, bodyStyle]}>
        <View
          onLayout={e => {
            height.value = e.nativeEvent.layout.height;
          }}
          className={`rounded-b-lg bg-white z-10 -mt-2`}
        >
          <View className={"items-center -mt-0.5 mb-4 z-10 pt-12 pb-6 border-b border-x border-gray-400 rounded-b-xl"}>
            <Text className={"font-quicksand text-2xl"}>Setup New Password</Text>
          </View>

          <View className={"flex-col items-center mb-4 z-10"}>
            <TextInput
              control={control}
              title={"Email"}
              field={"email"}
              containerStyle={"w-3/4"}
              autoCapitalize={"none"}
              errors={errors}
            />
            <TextInput
              control={control}
              title={"Password"}
              field={"password"}
              containerStyle={"w-3/4"}
              autoCapitalize={"none"}
              errors={errors}
            />
            <TextInput
              control={control}
              title={"Confirm Password"}
              field={"confirmPassword"}
              containerStyle={"w-3/4"}
              autoCapitalize={"none"}
              errors={errors}
            />
            <TextInput
              control={control}
              title={"Confirmation Code"}
              field={"code"}
              containerStyle={"w-3/4"}
              autoCapitalize={"none"}
              errors={errors}
            />

            <View className={"flex-row items-center my-4"}>
              <Button
                title={"Cancel"}
                type={"outlined"}
                size={"md"}
                color={"error"}
                className={"h-10 m-2 rounded-md items-center"}
                // fontClass={"text-white"}
                onPress={() => onPressSignIn()}
              />
              <Button
                title={"Sign Up"}
                type={"contained"}
                size={"md"}
                color={"default"}
                className={"h-10 m-2 rounded-md items-center"}
                fontClass={"text-white"}
                onPress={handleSubmit(resetPassword)}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <View className={"min-w-full min-h-full justify-center items-center bg-gray-700 z-100"} style={{ zIndex: 100 }}>
      <View className={"w-1/3 h-24 items-center justify-center rounded-lg bg-gray-500 z-20"}>
        <Text className={"font-quicksand font-bold text-3xl my-5 text-white"}>
          OnBoard by MCS
        </Text>
      </View>

      <View className={"w-1/3 -mt-2"}>
        <SignIn isExpanded={openSignIn} />
      </View>

      <View className={"w-1/3 -mt-1"}>
        <SignUp isExpanded={openSignUp} />
      </View>

      <View className={"w-1/3 -mt-1"}>
        <ConfirmSignUp isExpanded={openConfirmationCode} />
      </View>

      <View className={"w-1/3 -mt-1"}>
        <ForgotPassword isExpanded={openForgotPassword} />
      </View>

      <View className={"w-1/3 -mt-1"}>
        <ConfirmPasswordReset isExpanded={openConfirmPasswordReset} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  animatedView: {
    overflow: "hidden"
  }
})
