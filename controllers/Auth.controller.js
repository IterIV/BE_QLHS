const createError = require("http-errors");
const UserModel = require("../models/User.model");
const { signAccessToken } = require("../helpers/jwt_helper");

class AuthController {
  async register(req, res, next) {
    try {
      const { username, password, fullName, shortName, avatar, role, isAdmin } =
        req.body;

      // ! check value request from client
      if (!username || !password || !fullName || !shortName || !role) {
        throw createError.BadRequest();
      }

      // ! check username is exist
      const existUser = await UserModel.findOne({ username: username });
      if (existUser) {
        throw createError.Conflict(`Tài khoản ${username} đã được đăng ký!`);
      }

      // TODO create user model and save to db
      const newUser = new UserModel({
        username,
        password,
        fullName,
        shortName,
        avatar,
        role,
        isAdmin: isAdmin ? isAdmin : false,
      });
      const savedUser = await newUser.save();
      if (savedUser) {
        const { shortName, avatar, role } = savedUser;
        res.json({
          message: "Đăng ký thành công!",
          data: {
            shortName,
            avatar,
            role,
          },
        });
      }
      // * Return res to client

      res.json({
        message: "Đăng ký thành công!",
        data: savedUser,
      });
    } catch (error) {
      // ! Catch error
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // ! Check value request from client
      if (!username || !password) {
        throw createError.BadRequest("username hoặc password không hợp lệ!");
      }

      // ! Check if user is not exist
      const user = await UserModel.findOne({ username: username });
      if (!user) {
        throw createError.NotFound(
          `Tài khoản "${username}" chưa được đăng ký!`
        );
      }

      // !Check if pass is not match
      const isMatch = await user.isValidPassword(password);
      if (!isMatch) {
        throw createError.Unauthorized("Mật khẩu không chính xác!");
      }

      // !Check if user is not enabled
      if (!user.isEnabled) {
        throw createError.Unauthorized("Tài khoản đã bị vô hiệu hóa!");
      }

      // TODO create token and return res to client
      const accessToken = await signAccessToken(user.id);
      const { shortName, avatar, role } = user;
      res.json({
        message: "Đăng nhập thành công!",
        user: { shortName, avatar, role },
        accessToken,
      });
    } catch (error) {
      // ! Catch error
      next(error);
    }
  }
}

module.exports = new AuthController();
