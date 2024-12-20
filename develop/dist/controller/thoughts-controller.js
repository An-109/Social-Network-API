import { Thought } from "../model/thought.js";
import User from "../model/User.js";
export const getThoughts = async (_req, res) => {
    try {
        const result = await Thought.find({});
        return res.status(200).json(result);
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Failed to retrieve thought", error: err });
    }
};
export const getThoughtById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Thought.findById(id).select("-__v");
        if (!result) {
            return res.status(400).json({ message: "no thought with that id" });
        }
        return res.status(200).json(result);
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Failed to retrieve thought", error: err });
    }
};
export const createThought = async (req, res) => {
    try {
        const { thoughtText, username, userId } = req.body;
        // Validate the required fields
        if (!thoughtText || !username || !userId) {
            return res
                .status(400)
                .json({ message: "thoughtText, username, and userId are required" });
        }
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Create the thought
        const newThought = await Thought.create({ thoughtText, username, userId });
        // Add the thought to the user's thoughts array
        user.thoughts.push(newThought._id);
        await user.save();
        return res.status(201).json(newThought);
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Failed to create thought", error: err });
    }
};
export const deleteThought = async (req, res) => {
    try {
        const { id } = req.params;
        // Find and delete the thought
        const thought = await Thought.findByIdAndDelete(id);
        if (!thought) {
            return res.status(404).json({ message: "Thought not found" });
        }
        // Remove the thought from the user's thoughts array
        await User.updateOne({ _id: thought.userId }, { $pull: { thoughts: id } });
        return res.status(200).json({ message: "Thought deleted successfully" });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Failed to delete thought", error: err });
    }
};
export const updateThought = async (req, res) => {
    try {
        const { id } = req.params;
        // Find and update the thought
        const thought = await Thought.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!thought) {
            return res.status(400).json({ message: "Thought not found" });
        }
        // Update related user, if needed
        if (thought.userId) {
            const user = await User.findById(thought.userId);
            if (user) {
                // You can perform specific updates to the related user here
                await user.save();
            }
        }
        return res
            .status(200)
            .json({ message: "Thought updated successfully", thought });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Failed to update thought", error: err });
    }
};
// Add a reaction to a thought
export const addReaction = async (req, res) => {
    try {
        const { id } = req.params;
        const thought = await Thought.findByIdAndUpdate(id, { $addToSet: { reactions: req.body } }, { runValidators: true, new: true });
        if (!thought) {
            return res.status(400).json({ message: "Thought not found" });
        }
        return res
            .status(200)
            .json({ message: "Reaction added successfully", thought });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Failed to add reaction", error: err });
    }
};
// Delete a reaction from a thought
export const deleteReaction = async (req, res) => {
    try {
        const { id, reactionId } = req.params;
        // Use the $pull operator to remove a reaction by reactionId
        const thought = await Thought.findByIdAndUpdate(id, { $pull: { reactions: { _id: reactionId } } }, { runValidators: true, new: true });
        if (!thought) {
            return res.status(400).json({ message: "Thought not found" });
        }
        return res
            .status(200)
            .json({ message: "Reaction deleted successfully", thought });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Failed to delete reaction", error: err });
    }
};
