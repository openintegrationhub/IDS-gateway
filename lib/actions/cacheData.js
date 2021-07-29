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
const fs = require('fs');


/**
 * This method will be called from elastic.io platform providing following data
 *
 * @param msg incoming message object that contains ``body`` with payload
 * @param cfg configuration that is account information and configuration field values
 */

 async function processAction(msg, cfg) {
  try {


    const cachePath = cfg.cachePath
    //cachePath='.../OIH/Fraunhofer_IDS/cache/cache.json'



    // write JSON string to a file

    /*msg.forEach(function(obj){
      let objCachePath= path.resolve(path.dirname(cachePath), obj.metadata.uid)
      fs.writeFile(objCachePath, obj, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
      });
    })*/
    let objCachePath= path.resolve(path.dirname(cachePath), msg.data.id)
    fs.writeFile(objCachePath, msg.data, (err) => {
      if (err) {
          throw err;
      }
      console.log("JSON data is saved.");
    });



    console.log('Finished execution');
    this.emit('end');
  } catch (e) {
    console.log(`ERROR: ${e}`);
    this.emit('error', e);
  }
}

module.exports = {
  process: processAction,
};