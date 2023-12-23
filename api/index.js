const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");
app.listen(port, () => {
  console.log("Server is running on port 8000");
});

mongoose.connect("mongodb+srv://minhch130802:Minh0392452682@cluster0.tyo4lbn.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to Mongodb");
}).catch((err) => {
    console.log("Error connecting to MongoDB ", err);
});

const User = require("./models/user");
const Order = require("./models/order");

const sendVerificationEmail = async (email, verificationToken) => {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      // Configure the email service or SMTP details here
      service: "gmail",
      auth: {
        user: "minhch130802@gmail.com",
        pass: "jfhlcpvmfxwhtpaz",
      },
    });
  
    // Compose the email message
    const mailOptions = {
      from: "AppGiaoDoAnNhanh.com",
      to: email,
      subject: "Kích hoạt tài khoản",
      text: `Hãy nhấn vào đường dẫn bên dưới để kích hoạt tài khoản: http://localhost:8000/verify/${verificationToken}`,
    };
  
    // Send the email
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email kích hoạt tài khoản đã được gửi thành công");
    } catch (error) {
      console.error("Lỗi khi gửi email kích hoạt tài khoản:", error);
    }
};

app.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // kiểm tra xem Email đã được đăng kí chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("Email đã được đăng ký", email); // Debugging statement
        return res.status(400).json({ message: "Email đã được đăng ký" });
      }
  
      // Tạo người dùng mới
      const newUser = new User({ name, email, password });
  
      // Khởi tạo và gửi token kích hoạt tài khoản
      newUser.verificationToken = crypto.randomBytes(20).toString("hex");
  
      // lưu đữ liệu vào database
      await newUser.save();
  
      // kiểm tra trạng thái của dữ liệu  
      console.log("Người dùng mới đã được đăng ký:", newUser);
  
      // Gửi email kích hoạt cho người dùng
      sendVerificationEmail(newUser.email, newUser.verificationToken);
  
      res.status(201).json({
        message:
          "Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.",
      });
    } catch (error) {
      console.log("Lỗi trong quá trình đăng ký tài khoản:", error); // Debugging statement
      res.status(500).json({ message: "Đăng ký tài khoản thất bại" });
    }
});

//Xác minh email
app.get("/verify/:token", async (req, res) => {
    try {
      const token = req.params.token;
  
      //Find the user witht the given verification token
      const user = await User.findOne({ verificationToken: token });
      if (!user) {
        return res.status(404).json({ message: "Mã thông báo xác minh không hợp lệ" });
      }
  
      //Mark the user as verified
      user.verified = true;
      user.verificationToken = undefined;
  
      await user.save();
  
      res.status(200).json({ message: "Email đã được xác minh thành công" });
    } catch (error) {
      res.status(500).json({ message: "Xác minh email không thành công" });
    }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecretKey();

//xác thực đăng nhập
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //kiểm tra email có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Tài khoản Email không tồn tại" });
    }

    //kiểm tra mật khẩu
    if (user.password !== password) {
      return res.status(401).json({ message: "Mật khẩu không chính xác" });
    }

    //tạo token
    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Đăng nhập thất bại" });
  }
});

//gửi xác thực email rest tài khoản
const restVerificationEmail = async (email, message) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    // Configure the email service or SMTP details here
    service: "gmail",
    auth: {
      user: "minhch130802@gmail.com",
      pass: "jfhlcpvmfxwhtpaz",
    },
  });

  // Compose the email message
  const mailOptions = {
    from: "AppGiaoDoAnNhanh.com",
    to: email,
    subject: "Mã token thay đổi mật khẩu",
    text: `${message}`,
    html: `<b>${message}<b/>`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email thây đổi mật khẩu tài khoản đã được gửi thành công");
  } catch (error) {
    console.error("Lỗi khi gửi email kích hoạt tài khoản:", error);
  }
};

async function generaCode (length){
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
  const charactersLength = characters.length;
  let couter = 0;
  while (couter < length){
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    couter+=1;
  }
}

//xác thực quên mật khẩu
app.post("/forgotpass", async (req, res) =>{
  try {
    const {email} = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Tài khoản Email không tồn tại" });
    }

    user.resettoken = await generaCode(5);
    user.verificationTokenResetExpiration = Date.now() + 3600000;

    await user.save();

    await restVerificationEmail(user.email, `Mã để bạn có thể thay đổi mật khẩu: ${resettoken}`)

    return res.status(200).json({ message: 'Link quên mật khẩu đã được gửi vào email của bạn' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

//Xác thực đổi mật khẩu
app.post("/restpasswordcomfirm", async (req, res) => {
  
});

//endpoint to store a new address to the backend
app.post("/addresses", async (req, res) => {
  try {
    const { userId, address } = req.body;

    //find the user by the Userid
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //add the new address to the user's addresses array
    user.addresses.push(address);

    //save the updated user in te backend
    await user.save();

    res.status(200).json({ message: "Address created Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error addding address" });
  }
});

//endpoint to get all the addresses of a particular user
app.get("/addresses/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addresses = user.addresses;
    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ message: "Error retrieveing the addresses" });
  }
});

//endpoint to store all the orders
app.post("/orders", async (req, res) => {
  try {
    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //create an array of product objects from the cart Items
    const products = cartItems.map((item) => ({
      name: item?.title,
      quantity: item.quantity,
      price: item.price,
      image: item?.image,
    }));

    //create a new Order
    const order = new Order({
      user: userId,
      products: products,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
    });

    await order.save();

    res.status(200).json({ message: "Order created successfully!" });
  } catch (error) {
    console.log("error creating orders", error);
    res.status(500).json({ message: "Error creating orders" });
  }
});

//get the user profile
app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the user profile" });
  }
});

app.get("/orders/:userId",async(req,res) => {
  try{
    const userId = req.params.userId;

    const orders = await Order.find({user:userId}).populate("user");

    if(!orders || orders.length === 0){
      return res.status(404).json({message:"No orders found for this user"})
    }

    res.status(200).json({ orders });
  } catch(error){
    res.status(500).json({ message: "Error"});
  }
})

