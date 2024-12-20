import { Request, Response } from "express";
import  User  from "../model/User.js";
import { Thought } from "../model/thought.js";
import mongoose from "mongoose";



  export const getUsers = async (_req: Request, res: Response) => {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (err) {
      return res.status(500).json(err)
    }
  }
  export const getSingleUser = async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      } else {
        return res.json(user);
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  // create a new user
  export const createUser = async (req: Request, res: Response) => {
    try {
      const dbUserData = await User.create(req.body);
      return res.json(dbUserData);
    } catch (err) {
      return res.status(500).json(err);
    }
  }


// Update a user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId,{$set: req.body}, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    };
    return res.json(user);
  } catch (err) {
    return res.status(400).json(err);
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.userId });

    if (!user) {
      return res.status(404).json({ message: 'No user with that ID' });
    }

    await Thought.deleteMany({ _id: { $in: user.thoughts } });
    res.json({ message: 'User and associated apps deleted!' })
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
}
export const addFriend = async (req: Request, res: Response) => {
  try {
    const { userId, friendsId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert friendsId to ObjectId
    const friendsObjectId = new mongoose.Types.ObjectId(friendsId);

    // Check if the friend is already added
    if (user.friends.includes(friendsObjectId)) {
      return res.status(400).json({ message: "Friend already added" });
    }

    // Add friend to the user's friends array
    user.friends.push(friendsObjectId);
    await user.save();

    return res.json({ message: "Friend added successfully", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to add friend", error: err });
  }
};

export const deleteFriend = async (req: Request, res: Response) => {
  try {
    const { userId, friendsId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert friendsId to ObjectId
    const friendsObjectId = new mongoose.Types.ObjectId(friendsId);

    // Check if the friend is in the user's friends list
    if (!user.friends.some((id) => id.equals(friendsObjectId))) {
      return res.status(404).json({ message: "Friend not found in user's friends list" });
    }

    // Remove the friend from the friends array
    user.friends = user.friends.filter((id) => !id.equals(friendsObjectId));
    await user.save();

    return res.json({ message: "Friend removed successfully", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to remove friend", error: err });
  }
};