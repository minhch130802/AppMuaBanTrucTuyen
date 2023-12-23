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

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState("");
    const navigation = useNavigation();
    const handleForgotPassword = () => {
      const user = {
          email: email,
      };

      axios
        .post("http://10.0.2.2:8000/forgotpass", user)
        .then((response) => {
            console.log(response);
            Alert.alert(
                "Gửi email thành công",
                "Vui vòng kiểm tra email của bạn"
            );
            navigation.navigate("RestPassConfimation");
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
            Quên mật khẩu
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
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="gray"
            />

            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: "gray",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 16 : 16,
              }}
              placeholder="Hãy nhập email của bạn"
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
          onPress={handleForgotPassword}
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
            Xác nhận gửi
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("RestPassConfimation")}
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