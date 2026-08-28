const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-token');

const app = express();

 const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

 console.log('APP_ID loaded:', APP_ID ? 'Yes' : 'No');
console.log('APP_CERTIFICATE loaded:', APP_CERTIFICATE ? 'Yes' : 'No');

app.get('/api/token', (req, res) => {
    try {
         if (!APP_ID || !APP_CERTIFICATE) {
            return res.status(500).json({ 
                error: 'Missing Agora credentials. Please set AGORA_APP_ID and AGORA_APP_CERTIFICATE in environment variables.' 
            });
        }

         const channelName = req.query.channelName;
        const uid = req.query.uid || 0;

        if (!channelName) {
            return res.status(400).json({ error: 'channelName is required' });
        }

        console.log(Generating token for channel: ${channelName}, uid: ${uid});

         const token = RtcTokenBuilder.buildTokenWithUid(
            APP_ID,
            APP_CERTIFICATE,
            channelName,
            uid,
            RtcRole.PUBLISHER,
            Math.floor(Date.now() / 1000) + 3600
        );

         res.json({ token: token });

    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ 
            error: 'Token generation failed',
            details: error.message 
        });
    }
});

module.exports = app;
