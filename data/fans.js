import { ObjectId } from "mongodb";
import { fans, posts } from "../config/mongoCollections.js";
import helpers from "../helpers/validation.js";
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
    ) {

        // throw error if any field is empty
        if (!firstName || !lastName || !username || !email || !birthDate || !password) {
            throw new Error("Error: All of the fields must be filled.");
        }
        
        // throw error if names are not strings
        if (typeof firstName !== "string") throw new Error("First name must be a string type value.");
        if (typeof lastName !== "string") throw new Error("Last name must be a string type value.");
        if (typeof username !== "string") throw new Error("Username name must be a string type value.");

        // remove extra spaces
        firstName = firstName.trim();
        lastName = lastName.trim();
        username = username.trim();
        email = email.trim();

        // reference fans collection
        const fansCollection = await fans();

                                        // validate field inputs

        // convert names lowercase
        const firstNameLower = helpers.convertLowercase(firstName);
        const lastNameLower = helpers.convertLowercase(lastName);
        const usernameLower = helpers.convertLowercase(username);

        // check names chars
        if (!helpers.onlyLetters(firstNameLower)) throw new Error("Invalid first name character (only letters allowed).");
        if (!helpers.onlyLetters(lastNameLower)) throw new Error("Invalid last name character (only letters allowed).");
        if (!helpers.allowedChars(username)) throw new Error("Invalid username character (only letters, numbers, underscores, hyphens, and periods allowed).");

        // check names lengths 25
        if (helpers.countChars(firstName) > 25) throw new Error("First name too long (max: 25 characters).");
        if (helpers.countChars(lastName) > 25) throw new Error("Last name too long (max: 25 characters).");
        if (helpers.countChars(username) > 25) throw new Error("Username too long (max: 25 characters).");

        // check username dup
        const existingUsername = await fansCollection.findOne({ username: usernameLower });
        if (existingUsername) throw new Error("Username already exists.");
        
        // convert email lowercase
        const emailLower = helpers.convertLowercase(email);

        const emailParts = helpers.tokenizeEmailAt(email);
        // only one @ in email
        if (!emailParts) throw new Error("Error: Invalid email format.");

        // email domain vibe check
        if (!helpers.domainRestrictions(emailParts.domainPart)) throw "Error: Invalid email format.";
        
        // check email length 50
        if (helpers.countChars(email) > 50) throw new Error("First name too long (max: 50 characters).");
        
        // check email dup
        const existingEmail = await fansCollection.findOne({ email: emailLower });
        if (existingEmail) throw new Error("Email is already associated with another account.");

                                        // validate birthdate

        birthDate = birthDate.trim();       // TODO
        
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

const testFan = await exportedMethods.create(
    "Cidolfus",
    "Telamon",
    "ram.uh",
    "cid@ffxvi.com",
    "2000-01-01",
    "testpassword"
);

console.log("Test Fan Created:", testFan);

export default exportedMethods;