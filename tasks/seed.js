import dataFansMethods from '../data/fans.js';
import dataPostsMethods from '../data/posts.js';
import { closeConnection } from '../config/mongoConnection.js'; 

(async () => {

    try {

    // test creating a fan
        const createdFan1 = await dataFansMethods.createFan(
        "Cidolfus",
        "Telamon",
        "ramuh",
        "cid@ffxvi.com",
        "1975-01-01",
        "zappy"
        );
        console.log("Test Fan 1 Created:", createdFan1);
        const createdFan2 = await dataFansMethods.createFan(
        "Midadol",
        "Telamon",
        "mid",
        "mid@ffxvi.com",
        "2000-01-01",
        "thisisapassword"
        );
        console.log("Test Fan 2 Created:", createdFan2);

    // test getting a fan by ID
        const getFan = await dataFansMethods.get(createdFan1._id);
        console.log("Fan information:\n", getFan);

    // test getting a fan info by ID
        const getFanByID = await dataFansMethods.getFanInfo(createdFan1._id);
        console.log("Fan information by ID:\n", getFanByID);
    // test getting a fan info by username
        const getFanByUsername = await dataFansMethods.getFanInfo(getFan.username);
        console.log("Fan information by username:\n", getFanByUsername);

    // test creating a post
        const createdPost = await dataPostsMethods.createPost("Cidolfus Telamon", "ramuh", "back", "waking up", "literally got out of bed and pulled my back", null, []);
        console.log("Test Post created:", createdPost);

    // test getting a post1
        const getPost1 = await dataPostsMethods.get(createdPost._id);
        console.log("Post information before:\n", getPost1);

    // // test adding comment to a post
        const addedComment = await dataPostsMethods.addComment(createdFan2._id, createdPost._id, "dad how did this happen");
        console.log("Test Comment added:", addedComment);

    // test getting a post2
        const getPost2 = await dataPostsMethods.get(createdPost._id);
        console.log("Post information after:\n", getPost2);


        // more test functions ---------------

        // const deleteFan = await dataFansMethods.deleteFan(createdFan1._id);
        // console.log("Fan: ", deleteFan);

        // const deletePost = await dataPostsMethods.deletePost(createdPost._id);
        // console.log("Post: ", deletePost);

        // const deleteComment = await dataPostsMethods.deleteComment(createdFan1._id, createdPost._id, addedComment._id);
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