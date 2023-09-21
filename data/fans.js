import { ObjectId } from "mongodb";
import { fans, posts } from "../config/mongoCollections.js";
import helpers from "../helpers/validation.js";
import bcrypt from 'bcrypt'
const saltRounds = 12;
import dataPostsMethods from "./posts.js";

const dataFansMethods = {

    async createFan(
        firstName,
        lastName,
        username,
        email,
        birthDate,
        password
    ) {

        // check empty
        if (!firstName || !lastName || !username || !email || !birthDate || !password) {
            throw new Error("Error: All of the fields must be filled.");
        }
        
        // check names type
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
            if (insertInfo.insertedCount === 0) throw new Error("Could not add new fan.");

            const newID = await insertInfo.insertedId.toString();
            const fan = await this.get(newID.toString());
            fan._id = fan._id.toString();
            return { _id: newID, ...fan };
    },

    async deleteFan(id) {

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
            throw new Error("No fan with that ID to delete.");
        }

        // find fan
        const fansCollection = await fans();
        const thisFan = await fansCollection.findOne({_id: new ObjectId(id)});
        if (thisFan === null) {
            throw new Error("No fan with that ID to delete.");
        }

        // delete fan
        const deleteResult = await fansCollection.deleteOne({ _id: new ObjectId(id) });

        if (deleteResult.deletedCount === 0) {
            throw new Error("Failed to delete fan.");
        }

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
            throw new Error("No fan with that ID to retrieve.");
        }

        // find fan
        const fansCollection = await fans();
        const thisFan = await fansCollection.findOne({_id: new ObjectId(id)});
        if (thisFan === null) {
            throw new Error("No fan with that ID to retrieve.");
        }

        // convert id to string
        thisFan._id = thisFan._id.toString();
    
        return thisFan;

    },

    async getFanInfo(idOrUsername) {

        const fansCollection = await fans();

        if (!idOrUsername) {
            throw new Error("ID or username must be provided.");
        }

        let fan;

        // Check if idOrUsername is a valid ObjectId
        if (ObjectId.isValid(idOrUsername)) {
            fan = await fansCollection.findOne({ _id: new ObjectId(idOrUsername) });

            if (!fan) {
                throw new Error("Fan not found.");
            }

            const {
                firstName,
                lastName,
                username,
                email,
                birthDate,
                posts,
                fanComments,
            } = fan;

            return {
                firstName,
                lastName,
                username,
                email,
                birthDate,
                posts,
                fanComments,
            };
        }

        // Assuming idOrUsername is a username
        else {
            fan = await fansCollection.findOne({ username: idOrUsername });

            if (!fan) {
                throw new Error("Fan not found.");
            }

            const {
                _id,
                firstName,
                lastName,
                email,
                birthDate,
                posts,
                fanComments,
            } = fan;

            return {
                _id: _id.toString(),
                firstName,
                lastName,
                email,
                birthDate,
                posts,
                fanComments,
            };
        }

    },




};

export default dataFansMethods;