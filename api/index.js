const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

app.get('/api/token', (req, res) => {
    try {
        // التحقق من المتغيرات
        if (!APP_ID || !APP_CERTIFICATE) {
            return res.status(500).json({ 
                error: 'Missing Agora credentials' 
            });
        }

        const channelName = req.query.channelName;
        const uid = req.query.uid || 0;

        if (!channelName) {
            return res.status(400).json({ error: 'channelName is required' });
        }

        // بناء التوكن بالطريقة الصحيحة لـ agora-access-token
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
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Token generation failed',
            details: error.message 
        });
    }
});

module.exports = app;
