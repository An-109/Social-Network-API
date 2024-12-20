import mongoose, { Schema, Document, model, Types } from "mongoose";

interface IThought extends Document {
  thoughtText: string;
  createdAt: Date;
  username: string;
  userId: mongoose.Types.ObjectId;
  reactions: IReaction[];
}

interface IReaction extends Document {
  reactionId: Types.ObjectId;
  reactionBody: string;
  username: string;
  createdAt: Date;
}
const reactionSchema = new Schema<IReaction>(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    id: false,
    toJSON: {
      getters: true,
    },
  }
);

const thought = new Schema<IThought>(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reactions: {
      type: [reactionSchema],
      default: [],
    },
  },
  {
    timestamps: false,
    toJSON: {
      getters: true,
    },
  }
);
// Create a virtual called reactionCount that retrieves the length of the thought's reactions array field on query.
thought.virtual("reactionCount").get(function () {
  // Ensure `this.reactions` is an array before accessing `.length`
  return Array.isArray(this.reactions) ? this.reactions.length : 0;
});
reactionSchema.virtual("formattedCreatedAt").get(function () {
  return this.createdAt.toLocaleString(); // Adjust the format as needed
});

const Thought = model<IThought>("Thought", thought);

export { IReaction, reactionSchema, Thought, IThought };