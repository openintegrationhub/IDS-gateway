/* eslint no-param-reassign: "off" */
/* eslint array-callback-return: "off" */
/* eslint no-unused-expressions: "off" */

/**
 * Copyright 2021 X-INTEGRATE Software & Consulting GmbH

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

const { transform } = require('@openintegrationhub/ferryman');
const axios = require('axios');


/**
 * This method will be called from elastic.io platform providing following data
 *
 * @param msg incoming message object that contains ``body`` with payload
 * @param cfg configuration that is account information and configuration field values
 */

async function processAction(msg, cfg) {
    console.dir(msg)
    console.dir(cfg)
    try {
        axios
            .post(cfg.uri, msg.data)
            .then(res => {
                console.log("INFO: msg.data=" + msg.data.toString())
                console.log("INFO: res=" + res.toString())
            })
            .catch(error => {
                console.log(error)
            })

    /*const webhookIDS = cfg.uri
    try {
        const options = {
            method:'POST',
            uri:webhookIDS,
            json: true,
            body: msg.data
        };

        let response = await request.post(options)
        console.log("INFO: Message=" + msg)
        console.log("INFO: Response=" + response)
    } catch (e) {
        console.log(e)
      }*/
    


    console.log('Finished execution')
    this.emit('end')
  } catch (e) {
    console.log(`ERROR: ${e}`)
    this.emit('error', e)
  }
}

module.exports = {
  process: processAction,
};