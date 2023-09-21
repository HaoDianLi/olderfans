import dataFansMethods from '../data/fans.js';
import dataPostsMethods from '../data/posts.js';
import { closeConnection } from '../config/mongoConnection.js'; 

(async () => {

    try {

        // test creating a fan
        const createdFan = await dataFansMethods.createFan(
        "Cidolfus",
        "Telamon",
        "ram.uh",
        "cid@ffxvi.com",
        "2000-01-01",
        "testpassword"
        );
        console.log("Test Fan Created:", createdFan);

        // test getting a fan by ID
        const getFan = await dataFansMethods.get(createdFan._id);
        console.log("Fan information:\n", getFan);

        // test getting a fan info by ID
        const getFanByID = await dataFansMethods.getFanInfo(createdFan._id);
        console.log("Fan information by ID:\n", getFanByID);
        // test getting a fan info by username
        const getFanByUsername = await dataFansMethods.getFanInfo(getFan.username);
        console.log("Fan information by username:\n", getFanByUsername);

        // test creating a post
        const createdPost = await dataPostsMethods.createPost("Cidolfus Telamon", "ram.uh", "back", "waking up", "literally got out of bed and pulled my back", null, []);
        console.log("Test Post created:", createdPost);

        // test getting a post1
        const getPost1 = await dataPostsMethods.get(createdPost._id);
        console.log("Post information before:\n", getPost1);

        // // test adding comment to a post
        const addedComment = await dataPostsMethods.addComment(createdFan._id, createdPost._id, "boi how");
        console.log("Test Comment added:", addedComment);

        // test getting a post2
        const getPost2 = await dataPostsMethods.get(createdPost._id);
        console.log("Post information after:\n", getPost2);


        // more test functions ---------------

        // const deleteFan = await dataFansMethods.deleteFan(createdFan._id);
        // console.log("Fan: ", deleteFan);

        // const deletePost = await dataPostsMethods.deletePost(createdPost._id);
        // console.log("Post: ", deletePost);

        // const deleteComment = await dataPostsMethods.deleteComment(createdFan._id, createdPost._id, addedComment._id);
        // console.log("Deleted comment: ", deleteComment);

    }

    catch (error) {

        console.error("Error:", error);

    } 

    finally {

        // Close the database connections
        await closeConnection();
        console.log('Database connections closed.');

    }
})();
