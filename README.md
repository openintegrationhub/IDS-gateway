![alpha](https://img.shields.io/badge/Status-Alpha-yellow.svg)

# OIH-IDS Gateway
Gateway component to enable data exchange between Open Integration Hub and International Data Space - https://github.com/International-Data-Spaces-Association.

## Actions and triggers
The OIH-IDS Gateway supports the following **actions** and **triggers**:

#### Triggers:
A trigger usually is the first component within a flow and is executed when the flow is triggered by a request to the flow webhook or a CRON job event.  

**Get Ressource Query** (`getRessourceQuery`)

Creates an SQL query and fetches the data matching the provided UIDs from database.
1. Expects an array of UIDs as `filter` in message payload. 
2. Combines the data in `filter` with the `query` specified in fields in order to create an SQL query that is then transferred to the next component in the flow.

```
fields: {
  query: 'SELECT * FROM public.oih_ids_iot_test_data WHERE uid in ({filter})'
}

input: { 
  "data": {
    "filter": [1123123,2341343,3134341,....]
    },
  "metadata": {}
}

output (emit data): {
  data:{
    query:createdQuery
  }
}
```

#### Actions:
An action is executed whenever it receives data from another component in the same flow. 

**Register Ressource** (`registerRessource.js`)

Registers incoming data with the DataSpaceConnector and IDS broker via POST requests.
1. Receives UID of data and registers it with the DataSpaceConnector via POST request (field `urlDataSpaceConnector`). The POST request body contains meta information like a title, description and an address (`"body"["representations"]["source"]["url"]`) that represents the registered data and can later be called by the IDS broker. The `endpoint` parameter in this request is the address of the flow 2 webhook that needs to be triggered in order to receive the data (i.e. `https://DataSpaceConnectorAddress?endpoint=OIH-Address/hook/60e7eec81eee16001b551637&uid={uidIDS}`). 
2. Registers the data with the Broker by sending a POST request (field `urlBroker`). Credentials for authorization can be entered in fields `user` and `password`.    

```
fields: {
          urlDataSpaceConnector: 'https://DataSpaceConnector-ADDRESS/admin/api/resources/resource',
          urlBroker: 'https://DataSpaceConnector-ADDRESS/admin/api/broker/register?broker=https://IDS-Broker-ADDRESS/infrastructure',
          user: '',
          password: '',
          body: {
            title: 'MachineX-Data',
            description: 'Aggregated sensor data',
            representations: [
              {
                type: 'JSON',
                name: 'MaschineX',
                source: {
                  type: 'http-get',
                  url: 'https://IDS-Wrapper-ADDRESS?endpoint=OIH-ADDRESS/hook/FLOW2-ID&uid={uidIDS}'
                }
              }
            ]
          }
}
```

**POST IDS** (```postIDS.js```)

Sends incoming data to an endpoint specified in field `uri` via POST request. 

```
fields: {
  uri: 'http://endpoint'
}
```

## Flows
This version of the IDS Gateway only works with an SQL database to store the resources that are then registered with the DataSpaceConnector and Broker. We recommend using the IDS-Gateway in combination with the [IDS-SQL Adapter](HIER SPÄTER LINK FÜR IDS-SQL-ADAPTER) which is a variation of the standard OIH-SQL Adapter [OIH-SQL Adapter](https://github.com/openintegrationhub/sql-adapter).

With the triggers and actions described above it is possible to describe each row of data from any source with an uid and save it in an SQL database. This uid is then registered with the IDS DataSpaceConnector and Broker by using the `registerRessource.js` function.
- Flow 1
The first flow is triggered by a webhook or CRON job event and registers the incoming data with the DataSpaceConnector and Broker. The POST request that registers the data contains the endpoint address of flow 2 combined with the UID of the data set (i.e. `OIH-Address/hook/60e7eec81eee16001b551637&filter="117fdf380c983d6acf80d63d96c504b1"`).

**Example of flow 1 config:**
```
{
  status: 'inactive',
  name: 'SQL to SQL to DSC (Flow 1)',
  description: 'This is an example flow to use the IDS Gateway in combination with the sql ids adapter',
  graph: {
    nodes: [
      {
        id: 'step_1',
        componentId: '',
        name: 'Connector X',
        function: 'getData',
        description: 'Data source component',
        fields: {
        }
      },
      {
        id: 'step_2',
        componentId: '',
        name: 'IDS-SQL Adapter',
        function: 'addData',
        description: 'Extracts predefined columns from incoming data row and stores it in database with an individually generated UID',
        fields: {
          databaseType: '',
          user: '',
          password: '',
          databaseUrl: '',
          port: '',
          databaseName: '',
          query: 'INSERT INTO oih_ids_iot_test_data_sink(uidIDS,Column2,Column3) VALUES (\'{uidIDS}\',\'{VALUE1}\',\'{VALUE2}\')'
        }
      },
      {
        id: 'step_3',
        componentId: '',
        name: 'OIH-IDS Gateway',
        function: 'registerRessource',
        description: 'Registers incoming data with the DataSpaceConnector and IDS Broker',
        fields: {
          urlDataSpaceConnector: 'https://DataSpaceConnector-ADDRESS/admin/api/resources/resource',
          urlBroker: 'https://DataSpaceConnector-ADDRESS/admin/api/broker/register?broker=https://IDS-Broker-ADDRESS/infrastructure',
          user: '',
          password: '',
          body: {
            title: 'MachineX-Data',
            description: 'Aggregated sensor data',
            representations: [
              {
                type: 'JSON',
                name: 'MaschineX',
                source: {
                  type: 'http-get',
                  url: 'https://IDS-Wrapper-ADDRESS?endpoint=OIH-ADDRESS/hook/FLOW2-ID&uid={uidIDS}'
                }
              }
            ]
          }
        }
      }
    ],
    edges: [
      {
        source: 'step_1',
        target: 'step_2'
      },
      {
        source: 'step_2',
        target: 'step_3'
      }
    ]
  },
  owners: [
    {
      id: '',
      type: 'user'
    },
    {
      id: '',
      type: 'user'
    }
  ],
  createdAt: '',
  updatedAt: '',
  id: ''
}
```
- Flow 2
The second flow is webhook-based and triggered by a GET request that contains the resource UIDs as filter parameter. It then creates an SQL query to fetch the data and sends it back to the DataSpaceConnector.

**Example of flow 2 config:**
```
{
  status: 'inactive',
  name: 'OIH-IDS Gateway (Flow 2)',
  description: 'This is a webhook-based flow and expects a filter with uids of the resources',
  graph: {
    nodes: [
      {
        id: 'step_1',
        componentId: '',
        name: 'OIH-IDS Gateway',
        function: 'getRessourceQuery',
        description: 'Creates a SQL query from incoming data',
        fields: {
          query: 'SELECT * FROM public.oih_ids_iot_test_data_sink WHERE uidids in ({filter})'
        }
      },
      {
        id: 'step_2',
        componentId: '',
        name: 'IDS-SQL Adapter',
        function: 'getDataPolling',
        description: 'Exemplary flow node',
        fields: {
          databaseType: 'postgresql',
          user: '',
          password: '',
          databaseUrl: '',
          port: '',
          databaseName: ''
        }
      },
      {
        id: 'step_3',
        componentId: '',
        name: 'OIH-IDS Adapter',
        function: 'postIDS',
        description: 'Sends incoming data to IDS-Wrapper',
        fields: {
          uri: 'http://IDS-Wrapper-ADDRESS/webhook'
        }
      }
    ],
    edges: [
      {
        source: 'step_1',
        target: 'step_2'
      },
      {
        source: 'step_2',
        target: 'step_3'
      }
    ]
  },
  owners: [
    {
      id: '',
      type: 'user'
    }
  ],
  createdAt: '',
  updatedAt: '',
  id: ''
}
```
**Overview of OIH-IDS communication and data transfer**
![Overview](OIH-Connector/ids-adapter/docs/overview.png)

## License

Apache-2.0 © [X-integrate](https://X-integrate.de/)
