/* eslint no-param-reassign: "off" */

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
const { getresID} = require('./../helpers');
const request = require('request-promise').defaults({ simple: false, resolveWithFullResponse: true });


/**
 * This method will be called from OIH platform upon receiving data
 *
 * @param {Object} msg - incoming message object that contains keys `data` and `metadata`
 * @param {Object} cfg - configuration that contains login information and configuration field values
 */
async function processAction(msg, cfg) {
  try {

    const { urlDataSpaceConnector, urlBroker, user, password, body} = cfg

    /*
       This function performs a POST request to the Dataspace Connector and returns
       an ID for the registered Ressource.
    */
    async function registerRessource(config,data){

      //Get options from configuration parameter in real case.
      let ids_body = config.body
      console.log("data:",data)
      ids_body.representations[0]['source']['url']=ids_body.representations[0]['source']['url'].replace('{uidIDS}',data.data)


       const options={
            uri: config.urlDataSpaceConnector,
            auth: {
                user: config.user,
                pass: config.password
              },
            //agentOptions: {
            //    ca: fs.readFileSync(cert),
            //    rejectUnauthorized: false
            //},
            rejectUnauthorized: false,
            json:true,
            body:ids_body
        }

        const post_response = await getresID(options) 
        console.log("post_response:",post_response)
        return post_response
    }


    const resID = await registerRessource(cfg,msg);
    console.log("resID",resID)
    if (!resID){
      console.log(`Couldnt register:${msg.data}`);}


    const broker_options={
        uri: urlBroker,
        auth: {
            user: user,
            pass: password
          },
        rejectUnauthorized: false
      } 

    try {
        console.log("POST response Broker:")
        console.log(await request.post(broker_options))
      } catch (err) {
        console.log('Couldnt register Ressources on Broker')
        console.log(err)
        return err;
    }

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
