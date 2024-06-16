/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
import { Request, Response } from "express";
import cloudinary  from "cloudinary"
import "../utils/cloudinary.utils";

export const updateUserProfile = async (req: Request, res: Response) => {
  
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length > 1 ) {
      return res.status(400).json({
        message: "Please upload at least 1 image and not exceeding 1"})
      }

      let imageUrls=[] as string[]
    await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.v2.uploader.upload(file.path);
        imageUrls.push(result.secure_url);
        return result.secure_url
        
      })

    );
    const userId = req.user.id;
    const userProfile= {
      firstName : req.user.firstName,
      lastName : req.user.lastName,
      gender : req.body.gender,
      email : req.user.email,
      role : req.user.role,
      profileURL : req.user.profileURL,
      phone : req.user.phone,
      birthDate : req.user.birthDate,
      preferredLanguage : req.body.preferredLanguage,
      preferredCurrency : req.body.preferredCurrency,
      whereYouLive : req.body.whereYouLive,
      billingAddress : req.body.billingAddress,
      isActive : req.user.isActive,
      image:imageUrls[0]
    } 

    const userprofile = await UserProfile.findOne({ where: { userId } });

    if (!userprofile) {
      return res.status(404).json({
        status: "error",
        message: "User profile not found",
      });
    } else
      await userprofile.update({
        gender:userProfile.gender,
        preferredLanguage:userProfile.preferredLanguage,
        preferredCurrency:userProfile.preferredCurrency,
        whereYouLive:userProfile.whereYouLive,
        billingAddress:userProfile.billingAddress,
        image:userProfile.image,
      });

    return res.status(200).json({
      status: "success",
      message: "User profile updated successfully",
      data: userprofile,
    });
  } catch (error) {
    console.error("Error updating profile", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating the profile",
    });
  }
};
