import { Router } from 'express';
import { v4 as uuidV4 } from 'uuid';

export const mainRouter = Router();

mainRouter.get('/', (_, res) => {
    res.redirect(`${uuidV4()}`);
});

mainRouter.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
});
