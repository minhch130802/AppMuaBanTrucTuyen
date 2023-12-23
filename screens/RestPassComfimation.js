import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
  } from "react-native";
  import React, { useState,useEffect } from "react";
  import { MaterialIcons } from "@expo/vector-icons";
  import { useNavigation } from "@react-navigation/native";
  import { AntDesign } from "@expo/vector-icons";
  import axios from "axios";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { Alert } from "react-native";
  import { Entypo } from '@expo/vector-icons';

const ForgotPasswordScreen = () => {
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");

    const navigation = useNavigation();
    const handleRestPasswordCom = () => {
        const user = {
              token: token,
              password: password,
              repassword: repassword,
        };

    axios
        .post("http://10.0.2.2:8000/restpasswordcomfirm", user)
        .then((response) => {
            console.log(response);
            Alert.alert(
                "Gửi email thành công",
                "Vui vòng kiểm tra email của bạn"
            );
            navigation.navigate("Login");
        })
        .catch((error) => {
            Alert.alert(
                "Đã xảy ra lỗi thay đổi mật khẩu",
                "Vui lòng kiểm tra lại thông tin"
            );
        console.log("Quên mật khẩu thất bại", error);
        });
    }   
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center",marginTop:50 }}
    >
      <View>
        <Image
          style={{ width: 150, height: 100 }}
          source={{
            uri: "https://assets.stickpng.com/thumbs/6160562276000b00045a7d97.png",
          }}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 12,
              color: "#041E42",
            }}
          >
            Đổi mật mật khẩu
          </Text>
        </View>

        <View style={{ marginTop: 70 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
              marginTop: 30,
            }}
          >
            <Entypo 
                name="key" 
                size={24} 
                color="black" 
            />

            <TextInput
              value={token}
              onChangeText={(text) => setToken(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: token ? 16 : 16,
              }}
              placeholder="Hãy nhập mã"
            />
          </View>
        </View>

        <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#D0D0D0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <AntDesign
                name="lock1"
                size={24}
                color="gray"
                style={{ marginLeft: 8 }}
              />
  
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: password ? 16 : 16,
                }}
                placeholder="Hãy nhập mật khẩu"
              />
            </View>
        </View>

        <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#D0D0D0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <AntDesign
                name="lock1"
                size={24}
                color="gray"
                style={{ marginLeft: 8 }}
              />
  
              <TextInput
                value={repassword}
                onChangeText={(text) => setRepassword(text)}
                secureTextEntry={true}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: repassword ? 16 : 16,
                }}
                placeholder="Hãy nhập lại mật khẩu"
              />
            </View>
        </View>

        <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>Giữ cho tôi đăng nhập</Text>
            <Pressable
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={{ color: "#007FFF", fontWeight: "500" }}>
                Đăng nhập
              </Text>
            </Pressable>
        </View>

        <View style={{ marginTop: 80 }} />

        <Pressable
          onPress={handleRestPasswordCom}
          style={{
            width: 200,
            backgroundColor: "#FEBE10",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Xác nhận đổi mật khẩu
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Bạn chưa có tài khoản? Đăng ký
          </Text>
        </Pressable>

       </KeyboardAvoidingView> 
    </SafeAreaView>
  )
}

export default ForgotPasswordScreen

const styles = StyleSheet.create({})