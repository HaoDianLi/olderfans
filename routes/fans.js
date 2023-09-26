import { ObjectId } from 'mongodb';
import express from 'express';
const router = express.Router();
import axios from 'axios';

router.route('/').get(async (req, res) => {
    try {
        res.render('homepage');
    } catch (error) {
        res.render('error', { error });
    }
});

router.route('/about').get(async (req, res) => {
    try {
        res.render('about');
    } 
    catch (error) {
        res.render('error', { error });
    }
});

router.route('/contact').get(async (req, res) => {
    try {
        res.render('contact');
    } 
    catch (error) {
        res.render('error', { error });
    }
});

router.get('/signout', async (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

export default router;