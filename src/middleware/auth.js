// Models
const Permission = require("../services/permissions")

// Features
const catchAsync = require("../services/catchAsync");
const AppError = require("../services/appError");

// Env
const dotenv = require("dotenv");
dotenv.config({ path: "../config/config.env" });


// Permission
exports.hasPermission = catchAsync(async (req, res, next) => {

const match = req.originalUrl.match(/^(?:\/[^\/]+){4}(\/[^?/]+)/);
const model = match[1].slice(1);
const method = req.method;

if(req.user.isAccountAdmin) {

  next();

} else {
  const user = await Permission.findOne({userId : req.user.id , accountAdmin : req.user.accountAdmin}).select(`${model}`)
 
  if(user) {
    if(user[model].includes(method)) {

      next();
  
    } else {
      return next(new AppError("You don't have permission to do this opertion *#* انتا لا تمتلك الصلاحيات للقيام بهذه العملية",400))
    }
  } else {
    return next(new AppError("You don't have permission to do this opertion *#* انتا لا تمتلك الصلاحيات للقيام بهذه العملية",400))
  }

}
});