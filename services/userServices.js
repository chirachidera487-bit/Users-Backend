import User from "../Model/userModel.js";

export const getUserProfile = async (userName)=> {
//return await User.findOne({ userName });

try {
    const user = await User.findOne({ userName: userName }).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    return user;
} catch (error) {
    throw new Error("Error fetching user Profile: " + error.message);
}

}



export const getAllUserProfile = async () => {

  try {
 const user = await  User.find({}).select("-password"); 
 return user;
  } catch(error){
    throw new Error("Error fetching user profile " + error.message);
  }
  
  };


export const registerUser = async (userData)=>{
 const{ userName, email, password, fullName, address, gender, profileImage, age } = userData;
 const user = new User({userName, email, password, fullName, address, gender, profileImage, age
});
return await user.save();
};

export const loginUser = async (credentials)=>{
    return await User.findOne(credentials);

};




export const updateUserProfile = async (userName, updateData) => {
return await User.findOneAndUpdate({ userName }, updateData,{new: true});
};

export const deleteUserProfile = async (userName) => {
return await User.findOneAndDelete({ userName });
};


export default{ getUserProfile, registerUser, loginUser, updateUserProfile, deleteUserProfile, getAllUserProfile };