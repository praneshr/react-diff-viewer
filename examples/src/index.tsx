import * as React from 'react'
import * as ReactDOM from 'react-dom'

import ReactDiff from '../../lib/index'

class Example extends React.Component {
  render() {
    const a = {
      "stages": [{
        "displayName": "SQL Transform",
        "order": 1,
        "type": "com.indix.holonet.core.pipeline.transforms.SqlTransform",
        "parameters": {
          "sql": "select storeId,  storeName, sku, upcs, url, title, minSalePrice as salePrice, minListPrice as listPrice, imageUrl, description, specificationText, reviews, row_number() over (partition by storeId order by rand() desc) as rnk, hostname(url) as host from #tableName where brandId != 999999"
        },
        "group": "transformation"
      }, {
        "displayName": "SQL Transform",
        "order": 2,
        "type": "com.indix.holonet.core.pipeline.transforms.SqlTransform",
        "parameters": {
          "sql": "SELECT * from #tableName where rnk <= 100"
        },
        "group": "transformation"
      }],
      "name": "Site_DQ_Set",
      "editViaJson": false,
      "runner": {
        "parameters": {
          "namespaceRunnerConfig": ""
        }
      },
      "output": {
        "name": "output",
        "format": "tsv",
        "compression": "gzip",
        "connector": {
          "parameters": {
            "path": "s3://indix-users/anirudh/Site_DQ_Set_1/"
          },
          "type": "com.indix.holonet.core.connector.s3Connector",
          "displayName": "S3",
          "group": "general"
        }
      },
      "locator": {
        "namespace": "CS-RetailMeNot",
        "name": "Site_DQ_Set",
        "runCounter": 1,
        "runId": "82a983f9-3af8-40ad-a1e5-03ea88180d8f"
      },
      "input": {
        "dataset": {
          "name": "RMN_OUTPUT_Parquet",
          "namespace": "Indix-Adhoc",
          "version": "20180925_91"
        }
      },
      "namespace": "CS-RetailMeNot"
    }
    const b = {
      "stages": [{
        "displayName": "SQL Transform",
        "order": 1,
        "type": "com.indix.holonet.core.pipeline.transforms.SqlTransform",
        "parameters": {
          "sql": "(select storeId,  storeName, sku, upcs, url, title, imageUrl, description, specificationText, reviews, row_number() over (partition by storeId order by rand() desc) as rnk, hostname(url) as host, \"description\" as dataKey, \"Yes\" as dataValue from #tableName where length(description) > 0 and isNotEmpty(description)) union\n\n(select storeId,  storeName, sku, upcs, url, title, imageUrl, description, specificationText, reviews, row_number() over (partition by storeId order by rand() desc) as rnk, hostname(url) as host , \"specificationText\" as dataKey, \"Yes\" as dataValue from #tableName where length(specificationText) > 0 and isNotEmpty(specificationText)) union \n\n(select storeId,  storeName, sku, upcs, url, title, imageUrl, description, specificationText, reviews, row_number() over (partition by storeId order by rand() desc) as rnk, hostname(url) as host, \"reviews\" as dataKey, \"Yes\" as dataValue from #tableName where size(reviews) > 0)  union \n\n(select storeId,  storeName, sku, upcs, url, title, imageUrl, description, specificationText, reviews, row_number() over (partition by storeId order by rand() desc) as rnk, hostname(url) as host, \"upc\" as dataKey, \"Yes\" as dataValue from #tableName where length(upcs[0]) > 0) union \n\n(select storeId,  storeName, sku, upcs, url, title, imageUrl, description, specificationText, reviews, row_number() over (partition by storeId order by rand() desc) as rnk, hostname(url) as host, \"sku\" as dataKey, \"Yes\" as dataValue from #tableName where isNotEmpty(sku) and sku != \"\")"
        },
        "group": "transformation"
      }, {
        "displayName": "SQL Transform",
        "order": 2,
        "type": "com.indix.holonet.core.pipeline.transforms.SqlTransform",
        "parameters": {
          "sql": "SELECT * from #tableName where rnk <= 100"
        },
        "group": "transformation"
      }],
      "name": "Site_DQ_Set",
      "editViaJson": false,
      "runner": {
        "parameters": {
          "namespaceRunnerConfig": ""
        }
      },
      "output": {
        "name": "output",
        "format": "tsv",
        "compression": "gzip",
        "connector": {
          "parameters": {
            "path": "s3://indix-users/anirudh/Site_DQ_Set_2/"
          },
          "type": "com.indix.holonet.core.connector.s3Connector",
          "displayName": "S3",
          "group": "general"
        }
      },
      "locator": {
        "namespace": "CS-RetailMeNot",
        "name": "Site_DQ_Set",
        "runCounter": 2,
        "runId": "94fef1ed-8e7c-4c3d-9511-93d1f3eda6f0"
      },
      "input": {
        "dataset": {
          "name": "RMN_OUTPUT_Parquet",
          "namespace": "Indix-Adhoc",
          "version": "20180925_91"
        }
      },
      "namespace": "CS-RetailMeNot"
    }
    return (
      <div>
        <ReactDiff
          oldValue={JSON.stringify(a, null, 4).replace(/(?:\\n)/g, '\n \t\t\t')}
          splitView
          newValue={JSON.stringify(b, null, 4).replace(/(?:\\n)/g, '\n \t\t\t')}
        />
      </div>
    )
  }
}

ReactDOM.render(
  <Example/>,
  document.getElementById('app'),
)

