import Joi from "joi";

export const registerValidator = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName : Joi.string().min(2).max(100).required(),
  userName : Joi.string().required(),
  password : Joi.string().min(6).required(),
  role : Joi.string().valid("user", "admin").required(),

  classId: Joi.number().when("role", {
is: "user",
then: Joi.required(),
otherwise: Joi.optional().allow(null)
  }),
});

export const loginValidator = Joi.object({
userName: Joi.string().required(),
password: Joi.string().required(),
}).unknown(false);

export const updateUserPasswordValidator = Joi.object({
newPassword: Joi.string().min(6).required(),
confirmPassword: Joi.string()
.valid(Joi.ref("newPassword"))
.required()
.messages({ "any.only": "Confirm password must match new password" }),

 })