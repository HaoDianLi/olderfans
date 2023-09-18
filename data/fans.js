import { ObjectId } from "mongodb";
import { fans, posts } from "../config/mongoCollections.js";
import bcrypt from 'bcrypt'
const saltRounds = 12;
import fanData from "./fans.js";

const exportedMethods = {

    async create(
        firstName,
        lastName,
        username,
        email,
        birthDate,
        password
    ){
        if (!firstName || !lastName || !username || !email || !birthDate || !password) {
            throw new Error("Error: All of the fields must be filled.");
        }
          
        if (typeof firstName !== "string") throw `Error: First name must be a string type value.`;
        if (typeof lastName !== "string") throw `Error: Last name must be a string type value.`;
        if (typeof username !== "string") throw `Error: Username name must be a string type value.`;

        firstName = firstName.trim();
        lastName = lastName.trim();
        username = username.trim();
        birthDate = birthDate.trim();

        const fansCollection = await fans();
        
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let newFan = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            birthDate: birthDate,
            password: hashedPassword,
            posts:[],
            fanComments: []
            };
    
            const insertInfo = await fansCollection.insertOne(newFan);
            if (insertInfo.insertedCount === 0) {
                throw `Error: Could not insert new band.`;
            }

            const newId = await insertInfo.insertedId.toString();
            const fan = await this.get(newId.toString());
            fan._id = fan._id.toString();
            return fan;
    },

    async get(id){
        if (!id) {
            throw `Error: The ID must be provided. `;
        }
        if (typeof id!=='string') {
            throw `Error: The ID must be a string.`;
        }
        id = id.trim();
        if (id.length==0 || id=="") {
            throw `Error: The ID must not be empty spaces.`;
        }
        if (!ObjectId.isValid(id)) {
            throw 'invalid object ID';
        }
        const fansCollection = await fans();
        const thisFan = await fansCollection.findOne({_id: new ObjectId(id)});
        if (thisFan === null) {
            throw 'Error: No fan with that ID';
        }
        thisFan._id = thisFan._id.toString();
    
        return thisFan;
    }

};

// const testFan = await exportedMethods.create(
//     "Cidolfus",
//     "Telamon",
//     "ramuh",
//     "cid@ffxvi.com",
//     "2000-01-01",
//     "testpassword"
// );

// console.log("Test Fan Created:", testFan);

export default exportedMethods;