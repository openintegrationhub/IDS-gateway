/*let template = 'SELECT * FROM public.oih_ids_iot_test_data_sink WHERE uidids in ({filter})'
let data = { filter: [ 'e7a38961c5faf0b73bfd30db7d48f00a' ] }
data = data["filter"]
let formattedFilter = []
for (let i = 0; i < data.length; i++){
    formattedFilter.push("'" + data[i] + "'")
}
let filledTemplate = template.replace("{filter}", formattedFilter)

console.log("Template=" + template)
console.log("FormattedFilter=" + formattedFilter)
console.log("FilledTemplate=" + filledTemplate)*/

const axios = require('axios');
const request = require('request')

let msg = {
    attachments: {},
    data: {
        id: null,
        out_of_spec: null,
        m_kg1: '1006,59081705078',
        m_kg2: null,
        m_kg3: null,
        m_cels1: '218,169741536471',
        m_cels2: null,
        m_cels3: null,
        m_cels4: null,
        m_kw1: null,
        m_kw2: null,
        m_kw3: null,
        m_kw4: null,
        m_kwhkg: null,
        m_nmcm2: null,
        n_hz: null,
        n_hpa: null,
        uidids: 'e7a38961c5faf0b73bfd30db7d48f00a'
    },
    metadata: {},
    headers: {}
}
let cfg = {
    uri: 'https://webhook.site/7693fe59-265d-4626-9ba1-0a9c81d59855',
    nodeSettings: {}
}

processAction(msg, cfg)

async function processAction(msg, cfg){
    /*axios
        .post(cfg.uri, msg.data)
        .then(res => {
            console.log("INFO: msg.data=" + msg.data)
            console.log("INFO: res=" + res)
        })
        .catch(error => {
            console.log(error)
        })*/

    try {
        const options = {
            method:'POST',
            uri:cfg.uri,
            json: true,
            body: msg.data,
            charset: 'utf-8',
            accept: 'text/plain'
        };

        let response = await request.post(options)
        console.log("INFO: Message=" + msg)
        console.log("INFO: Response=" + response)
    } catch (e) {
        console.log(e)
    }
}

