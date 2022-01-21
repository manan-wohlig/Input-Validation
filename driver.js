const express = require('express')
const mongoose = require('mongoose')
require('dotenv/config')
const Input = require('./models/Input')

mongoose.connect(process.env.DATABASE_CONN, () => {
    console.log('Connected to database.')
})

class Database {
    store(input) {
        try{
            input.save()
            console.log('Saved to database')
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Database;