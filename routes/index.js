import fansRoutes from './fans.js';
import postsRoutes from './posts.js';

const construct = (app) => {
    app.use('/fans', fansRoutes);
    app.use('/posts', postsRoutes);
    app.use('*', (req, res) =>{
        res.status(404).json({error: 'Not found'});
    });
};

export default construct;