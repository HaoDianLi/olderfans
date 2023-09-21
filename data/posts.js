import { ObjectId } from "mongodb";
import { fans, posts } from "../config/mongoCollections.js";
import helpers from "../helpers/validation.js";
import dataFansMethods from "./fans.js";

const dataPostsMethods = {

    async createPost(author, username, bodyPart, task, description, photo, comments) {

        // Check empty
    if (!author || !username || !bodyPart || !task || !description) throw new Error("Error: All of the fields must be filled.");

    // Reference posts collection
    const postsCollection = await posts();

    const newPost = {
        author: author,
        username: username,
        date: new Date().toString(),
        bodyPart: bodyPart,
        task: task,
        description: description,
        photo: photo,
        comments: comments
    };

    const insertInfo = await postsCollection.insertOne(newPost);
    if (insertInfo.insertedCount === 0) throw new Error("Could not add new post.");

    const newID = await insertInfo.insertedId.toString();

    // Update the fan's posts array in the fansCollection
    const fansCollection = await fans();
    await fansCollection.updateOne(
        { username: username },
        { $push: { posts: newID } }
    );

    const post = await this.get(newID.toString());
    post._id = post._id.toString();
    
    return { fanID: author, postID: newID, ...post };

    },

    async deletePost(id) {

        // check empty param
        if (!id) {
            throw new Error("The ID must be provided.");
        }

        // check type
        if (typeof id !== 'string') {
            throw new Error("The ID must be a string.");
        }

        // check data
        id = id.trim();
        if (id.length === 0 || id === "") {
            throw new Error("The ID must not be empty spaces.");
        }

        // check valid
        if (!ObjectId.isValid(id)) throw new Error("No post with that ID to delete.");

        // find post
        const postsCollection = await posts();
        const thisPost = await postsCollection.findOne({_id: new ObjectId(id)});
        if (thisPost === null) throw new Error("No post with that ID to delete.");

        // delete post
        const deleteResult = await postsCollection.deleteOne({ _id: new ObjectId(id) });

        if (deleteResult.deletedCount === 0) throw new Error("Failed to delete post.");

        return { ID: id, deleted: true };

    },
    
    async get(id){

        // check empty param
        if (!id) {
            throw new Error("The ID must be provided.");
        }

        // check type
        if (typeof id !== 'string') {
            throw new Error("The ID must be a string.");
        }

        // check data
        id = id.trim();
        if (id.length === 0 || id === "") {
            throw new Error("The ID must not be empty spaces.");
        }

        // check valid
        if (!ObjectId.isValid(id)) {
            throw new Error("No post with that ID to retrieve.");
        }

        // find post
        const postsCollection = await posts();
        const thisPost = await postsCollection.findOne({_id: new ObjectId(id)});
        if (thisPost === null) {
            throw new Error("No post with that ID to retrieve.");
        }

        // convert id to string
        thisPost._id = thisPost._id.toString();
    
        return thisPost;

    },

    async addComment(fanID, postID, comment) {

        // check empty
        if (!fanID || !postID || !comment) {
            throw new Error("Error: All of the fields must be filled.");
        }

        // check comment length 1000
        if (comment.length > 1000) throw new Error("Comment cannot be more than 1000 characters.");

        // reference fans collection and look for fan
        const fansCollection = await fans();
        const fan = await fansCollection.findOne({ _id: new ObjectId(fanID) });
        if (!fan) {
            throw new Error("Fan not found.");
        }

        // reference posts collection and look for post
        const postsCollection = await posts();
        const post = await postsCollection.findOne({ _id: new ObjectId(postID) });
        if (!post) throw new Error("Post not found.");

        const username = fan.username;

        // Generate an ID for the comment
        const commentID = new ObjectId().toString();

        const newComment = {
            _id: commentID,
            fan: { id: fanID, username: username },
            comment,
            date: new Date().toString(),
        };

        post.comments.push(newComment);
        const updatedPost = await postsCollection.updateOne(
            { _id: new ObjectId(postID) },
            { $set: post }
        );
        if (updatedPost.modifiedCount === 0) throw new Error("Could not add comment to post's array.");

        fan.fanComments.push({ postID, commentID: commentID, comment, date: new Date().toString() });
        const updatedFan = await fansCollection.updateOne(
            { _id: new ObjectId(fanID) },
            { $set: fan }
        );
        if (updatedFan.modifiedCount === 0) throw new Error("Could not add comment to fan's array.");

        return { _id: commentID, ...newComment };

    },

    async deleteComment(fanID, postID, commentID) {

        // Check empty parameters
        if (!fanID || !postID || !commentID) {
          throw new Error("Error: All required fields must be provided.");
        }
      
        // Reference fans collection and look for fan
        const fansCollection = await fans();
        const fan = await fansCollection.findOne({ _id: new ObjectId(fanID) });
        if (!fan) {
          throw new Error("Fan not found.");
        }
      
        // Reference posts collection and look for post
        const postsCollection = await posts();
        const post = await postsCollection.findOne({ _id: new ObjectId(postID) });
        if (!post) {
          throw new Error("Post not found.");
        }
      
        // Find the comment to be deleted by its ID
        const commentIndex = post.comments.findIndex((comment) => comment._id.toString() === commentID);
      
        if (commentIndex === -1) {
          throw new Error("Comment not found.");
        }
      
        // Remove the comment from the post's comments array
        post.comments.splice(commentIndex, 1);
      
        // Update the post in the database
        const updatedPost = await postsCollection.updateOne({ _id: new ObjectId(postID) }, { $set: post });
        if (updatedPost.modifiedCount === 0) {
          throw new Error("Could not delete comment from post.");
        }
      
        // Remove the comment from the fan's fanComments array
        fan.fanComments = fan.fanComments.filter((fanComment) => fanComment.commentID !== commentID);
      
        // Update the fan in the database
        const updatedFan = await fansCollection.updateOne({ _id: new ObjectId(fanID) }, { $set: fan });
        if (updatedFan.modifiedCount === 0) {
          throw new Error("Could not delete comment from fan.");
        }
      
        return { success: true };

    },
      

};

export default dataPostsMethods;