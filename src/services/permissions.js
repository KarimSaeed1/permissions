// Features
const AppError = require("./appError")
const catchAsync = require("./catchAsync")

// Classess
const API = require("./apiHandler")

// Libraries
const mongoose = require("mongoose");

// Objects
const apiHandler = new API()


// Permission model
const PermissionSchema = new mongoose.Schema(
  {
    userId: {
      type : mongoose.Schema.ObjectId,
      required : [true,"User is required *#* المستخدم مطللوب"]
    },

    accountAdmin : {
      type : mongoose.Schema.ObjectId,
    },

    ex : [{
      type : String,
      enum : ["GET","POST","PUT","DELETE"],
      default : [],
    }],

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);
const Permission = mongoose.model("Permission", PermissionSchema);



//GET
exports.getPermissionByID = catchAsync(async (req, res, next) => {

apiHandler.getOne(Permission,{_id : req.params.id});

});

exports.getUserPermissions = catchAsync(async (req, res, next) => {

apiHandler.getOne(Permission,{userId : req.user.id});

});

exports.getAccountAdminPermissions = catchAsync(async (req, res, next) => {

apiHandler.getAll(Permission,{accountAdmin : req.user.id})

});

//POST
exports.addPermission = catchAsync(async (req, res, next) => {

const user = await Permission.findOne({userId:req.body.userId , accountAdmin : req.user.accountAdmin});
if(user) {
    return next(new AppError("User already have permission *#* يمتلك المستخدم بالفعل صفحة صلاحيات",400))
}

apiHandler.create(Permission,
{
userId : req.body.userId,
accountAdmin : req.user.accountAdmin,
}
);

});

//PATCH
exports.updatePermission = catchAsync(async (req, res, next) => {

apiHandler.update(Permission,req.body);

});

//DELETE
exports.deletePermission = catchAsync(async (req, res, next) => {

apiHandler.delete(Permission);
  
});

module.exports = Permission