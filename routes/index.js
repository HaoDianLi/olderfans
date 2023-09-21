import fansRoutes from './fans.js';
import postsRoutes from './posts.js';
import homepageRoutes from './homepage.js';

const construct = (app) => {
    app.use('/fans', fansRoutes);
    app.use('/posts', postsRoutes);

    app.use('/', homepageRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

export default construct;
