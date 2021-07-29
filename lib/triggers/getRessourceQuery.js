/* eslint no-param-reassign: "off" */
/* eslint no-inner-declarations: "off" */

/**
 * Copyright X-INTEGRATE Software & Consulting GmbH

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


/**
 * This method will be called from OIH platform providing following data
 *
 * @param msg - incoming message object that contains ``body`` with payload
 * @param cfg - configuration that is account information and configuration field values
 * @param snapshot - saves the current state of integration step for the future reference
 */
async function processTrigger(msg, cfg, snapshot = {}) {
  try {

    const query = cfg.query; // query = 'SELECT * FROM public.oih_ids_iot_test_data_sink WHERE uidids in ({filter})'
    const data = msg.data.data; // data = { filter: [ 'e7a38961c5faf0b73bfd30db7d48f00a' ] }

    console.dir(msg)
    console.dir(data)
    console.dir(cfg)

    // called with query & data
    function fillSQLQuery(template, data) {
      data = data["filter"]
      let formattedFilter = []
      for (i = 0; i < data.length; i++){
        formattedFilter.push("'" + data[i] + "'")
      }
      let filledTemplate = template.replace("{filter}", formattedFilter)
      /*console.log("fillSQLQuery template(query):" + template)
      const matches = Array.from(template.matchAll(/[{](.*?)[}]/gmu)); // eslint-disable-line no-useless-escape
      const matchesLength = matches.length;
      console.log("fillSQLQuery matches:" + matches.toString())

      let query = template;
      for (let i = 0; i < matchesLength; i += 1) {
        const key = matches[i][1].trim();
        if (key in data) {
          query = query.replace(matches[i][0], data[key]);
        } else {
          console.error('Key', key, 'not found!');
        }
      }*/
    
      console.log('Filled template:', filledTemplate);
      return filledTemplate;
    }
    const realQuery = fillSQLQuery(query,data);

    const emitData = {
          data:{
          query:realQuery}
      }

    console.log("INFO: emitData=" + emitData.data.query)
    // Emit the object with meta and data properties
    this.emit('data', emitData);
      
  


    console.log('Finished execution');
    this.emit('end');
  } catch (e) {
    console.log(`ERROR: ${e}`);
    this.emit('error', e);
  }
}

module.exports = {
  process: processTrigger,
};
