const express = require('express');
const db = require('../../data/dbConfig.js');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const { limit, sortby, sortdir } = req.query;
        
        let accounts = await db('accounts')
        .modify(async queryBuilder => {
            if (sortby || sortdir) {
                await queryBuilder.orderBy(sortby ? sortby : 'id', sortdir && sortdir);
            }
        })
        .modify(async queryBuilder => {
            if(limit) {
                await queryBuilder.limit(limit);
            }
        });

        res.json(accounts);
    } catch(err) {
        next(err);
    }
});

// @desc    Create a new account
router.post('/', async (req, res, next) => {
    try {
        const { name, budget } = req.body;
        if (!name || !budget) {
            return res.status(400).json({ message: 'Missing required field' });
        }
        const id = await db('accounts').insert(req.body, 'id');
        const account = await db('accounts').where({ id: id[0] }).first();
        res.status(201).json(account);
    } catch(err) {
        next(err);
    }
});

// @desc    Return an account specified by ID param
router.get('/:id', async (req, res, next) => {
    try {
        const account = await db('accounts').where({ id: req.params.id }).first();
        if(!account) {
            return res.status(400).json({ message: 'Invalid account' });
        }
        res.json(account);
    } catch(err) {
        next(err);
    }
});

// @desc    Delete an account specified by the ID param
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const delCount = await db('accounts').where({ id }).del();
        if(!delCount) {
            return res.status(404).json({ message: 'Invalid ID' });
        }
        res.json({ message: 'Acount was deleted successfully' });
    } catch(err) {
        next(err);
    }
});

// @desc    Edit an account
router.put('/:id', async (req, res, next) => {
    try {
        const { name, budget } = req.body;
        const { id } = req.params;
        const count = await db('accounts').where({ id }).update({ name, budget });
        if(!count) {
            return res.status(404).json({ message: 'Invalid account' });
        }
        res.json((await db('accounts').where({ id })).first());
    } catch(err) {
        next(err);
    }
});

module.exports = router;