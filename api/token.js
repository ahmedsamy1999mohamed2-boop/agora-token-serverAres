const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
const PORT = process.env.PORT || 3000;

// ضع بياناتك من Agora Console
const APP_ID = process.env.AGORA_APP_ID || '66c56f0f72784e1b93c4b8e3ddf36603';
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || '2c25831eb4f549aea066c34c227841a0';

app.get('/api/token', (req, res) => {
    const channelName = req.query.channelName;
    const uid = req.query.uid || 0;
    if (!channelName) {
        return res.status(400).json({ error: 'channelName is required' });
    }

    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600; // ساعة واحدة
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpiredTs);

    return res.json({ token });
});

app.listen(PORT, () => {
    console.log(Token server running on port ${PORT});
});

module.exports = app;
