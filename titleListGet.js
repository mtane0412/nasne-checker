'use strict'

require('dotenv').config();
const request = require('request-promise');
const moment = require('moment');

module.exports = function (Nasne) {
    Nasne.prototype.titleListGet = (callback) => {
        const options = {
            url: `http://${process.env.NASNE_IP}:64220/recorded/titleListGet`,
            qs: {
                searchCriteria: '0',
                filter: '0',
                startingIndex: '0',
                requestedCount: '0',
                sortCriteria: '0',
                withDescriptionLong: '0',
                withUserData: '0'
            },
            method: "GET",
            json: true
        }
        request(options, function (error, response, body) {
            if (error) { console.log(error); } 
            const result = {
                type: "nasne",
                token: process.env.TOKEN,
                newVideo: false,
                item: []
            };
            body.item.forEach(function (key) {
                if (moment().diff(moment(key.startDateTime), 'hours') < 2) result.newVideo = true;
                let program = {
                    id: key.id,
                    title: key.title // 特殊文字を置き換え
                        .replace(/\ue195/g, "[終]")
                        .replace(/\ue193/g, "[新]")
                        .replace(/\ue0fe/g, "[字]")
                        .replace(/\uE184/g, "[解]")
                        .replace(/\uE183/g, "[多]")
                        .replace(/\uE180/g, "[デ]"),
                    description: key.description,
                    startDateTime: key.startDateTime,
                    duration: key.duration
                }
                result.item.push(program);
            })
            if (callback) { callback(result); }
            return result;
        })
    }
}