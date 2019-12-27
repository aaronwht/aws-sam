'use strict'
const AWS = require('aws-sdk')

const s3bucket = new AWS.S3({
    apiVersion: '2006-03-01',
    signatureVersion: 'v4',
    Bucket: process.env.UploadPictureBucket,
    region: process.env.UploadPictureBucketRegion
})

module.exports.handler = async (event) => {
    try {
        const body = JSON.parse(JSON.stringify(event.body))
        let { fileName } = JSON.parse(body)
        fileName = updateFileName(fileName)
        
        
        let s3Params = {
            Bucket: process.env.UploadPictureBucket,
            Key: fileName,
            Expires: 60,
            ACL: 'public-read',
            ContentType: '*/*',
        }

        try {
            const data = await s3bucket.getSignedUrl('putObject', s3Params)
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({ signedUrl: data, picture: fileName })
            }
        } catch (err) {
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'message': err.message })
            }
        }
    } catch (err) {
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            status: 'error',
            message: err.message
        }
    }   
}

function updateFileName(fileName) {
    if (!fileName) return

    fileName = fileName.toLowerCase()
    // strip out non-alpha numeric, dots, hyphens, underscores
    fileName = fileName.replace(/[^a-z-0-9.-_]+/gi, '')
    if (fileName === '') return
    if (fileName.indexOf('.') === -1) return

    // assign a random five digit number
    let min = Math.ceil(10000)
    let max = Math.floor(99999)
    const randomNumber = (Math.floor(Math.random() * (max - min + 1)) + min).toString()

    const existingFileName = fileName.split('.')
    let newFileName = ''
    for (let i = 0; i < existingFileName.length-1; i++) {
        newFileName = newFileName + existingFileName[i] + '.'
    }

    newFileName = newFileName.substr(0, newFileName.length - 1)
    const fileExtension = fileName.split('.').pop()
    return newFileName + '-' + randomNumber + '.' + fileExtension
}