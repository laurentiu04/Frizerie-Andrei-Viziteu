const express = require("express");
const router = express.Router();
const workInfoSchema = require('../models/workInfo.js')

router.get('/', async (req, res) => {
    try {
        const data = await workInfoSchema.findOne({});

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ 
            message: "Error retrieving work data!", 
            error: error.message 
        });
    }

})

router.post('/', async (req, res) => {
    try {
        const updateData = req.body;

        // findOneAndUpdate(filter, update, options)
        const workInfo = await workInfoSchema.findOneAndUpdate(
            {}, // Empty filter: finds the first (and only) document
            updateData, 
            { 
                new: true,      // Return the updated document
                upsert: true,   // Create it if it doesn't exist
                runValidators: true, 
                setDefaultsOnInsert: true 
            }
        );

        console.log(workInfo);

        res.status(200).json({
            message: "Work information synced successfully",
            data: workInfo
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error updating work info", 
            error: error.message 
        });
    }
});

module.exports = router;