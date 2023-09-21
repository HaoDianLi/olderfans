import { ObjectId } from "mongodb";
import { fans, posts } from "../config/mongoCollections.js";
import helpers from "../helpers/validation.js";
import dataFansMethods from "./fans.js";

const dataPostsMethods = {

    async createPost(author, username, bodyPart, task, description, photo, comments) {

        // check empty
        if (!author || !username || !bodyPart || !task || !description) {
            throw new Error("Error: All of the fields must be filled.");
        }

        // reference posts collection
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
        const post = await this.get(newID.toString());
        post._id = post._id.toString();
        return { _id: newID, ...post };

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
        if (!fan) throw new Error("Fan not found.");

        // reference posts collection and look for post
        const postsCollection = await posts();
        const post = await postsCollection.findOne({ _id: new ObjectId(postID) });
        if (!post) throw new Error("Post not found.");

        const username = fan.username;

        const newComment = { fan: { id: fanID, username: username }, comment, date: new Date().toString() };
        post.comments.push(newComment);
        const updatedPost = await postsCollection.updateOne({ _id: new ObjectId(postID) }, { $set: post });
        if (updatedPost.modifiedCount === 0) throw new Error("Could not add comment to post's array.");

        fan.fanComments.push({ postID, comment, date: new Date().toString() });
        const updatedFan = await fansCollection.updateOne({ _id: new ObjectId(fanID) }, { $set: fan });
        if (updatedFan.modifiedCount === 0) throw new Error("Could not add comment to fan's array.");

        return newComment;

    },

};

export default dataPostsMethods;