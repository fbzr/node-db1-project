const express = require('express');
const db = require('../../../data/dbConfig.js');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const { limit, sortby, sortdir } = req.query;
        
        let products = await db('products')
        .modify(async queryBuilder => {
            if (sortby || sortdir) {
                await queryBuilder.orderBy(sortby ? sortby : 'product_id', sortdir && sortdir);
            }
        })
        .modify(async queryBuilder => {
            if(limit) {
                await queryBuilder.limit(limit);
            }
        });

        res.json(products);
    } catch(err) {
        next(err);
    }
});

// @desc    Create a new product
router.post('/', async (req, res, next) => {
    try {
        const product_id = await db('products').insert(req.body, 'product_id');
        res.status(201).json({
            product_id,
            ...req.body
        });
    } catch(err) {
        next(err);
    }
});

// @desc    Return a product specified by ID param
router.get('/:id', async (req, res, next) => {
    try {
        const product = await db('products').where({ product_id: req.params.id }).first();
        if(!product) {
            return res.status(400).json({ message: 'Invalid product' });
        }
        res.json(product);
    } catch(err) {
        next(err);
    }
});

// @desc    Delete a product specified by the ID param
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const delCount = await db('products').where({ product_id: id }).del();
        if(!delCount) {
            return res.status(404).json({ message: 'Invalid ID' });
        }
        res.json({ message: 'Product was deleted successfully' });
    } catch(err) {
        next(err);
    }
});

// @desc    Edit a product
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const count = await db('products').where({ product_id: id }).update(req.body);
        if(!count) {
            return res.status(404).json({ message: 'Invalid product' });
        }
        res.json((await db('products').where({ product_id: id })).first());
    } catch(err) {
        next(err);
    }
});

module.exports = router;