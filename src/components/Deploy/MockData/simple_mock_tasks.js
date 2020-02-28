var tasks = {
  // "activeStep": 0,
  "rows": [
    {
      "id": 1,
      "job_id": 1,
      "workflow_type_id": 1,
      "external_tool": "Email",
      "action_id": 1, //email end user
      "timestamp": 1792898398,
      "userinput_required": false,
      "job_object": {
        "device_id": 1,
        "hostname": "ASAHOU100"
      }
    },
    {
      "id": 2,
      "job_id": 1,
      "workflow_type_id": 1,
      "external_tool": "BCG",
      "action_id": 2, //Get base config
      "timestamp": 1792898398,
      "userinput_required": true,
      "job_object": {
        "device_id": 1,
        "hostname": "ASAHOU100",
        "action_name": "Complete Form",
        "schema": {
          "title": "asa_31108",
          "type": "object",
          "properties": {
            "neighbor_RR": {
              "title": "neighbor_RR",
              "type": "string",
              "pattern": "[0-9]{3}.[0-9]{2}"
            },
            "stp_priority": {
              "title": "stp_priority",
              "type": "string",
              "enum": ["24576", "28672", "32768"]
            }
          },
          "required": ["neighbor_RR", "stp_priority"]
        },
        "formData": {},
        "uiSchema": {
          // ""ui":FieldTemplate": "CustomFieldTemplate"
        }
      }
    },
    {
      "id": 3,
      "job_id": 1,
      "workflow_type_id": 1,
      "external_tool": "Proteus",
      "action_id": 3, //Update Tasks Status Details
      "timestamp": 1792898398,
      "userinput_required": false,
      "job_object": {
        "device_id": 1,
        "hostname": "ASAHOU100"
      }
    },
    {
      "id": 4,
      "job_id": 1,
      "workflow_type_id": 1,
      "external_tool": "Email",
      "action_id": 1, //Email user
      "timestamp": 1792898398,
      "userinput_required": false,
      "job_object": {
        "device_id": 1,
        "hostname": "ASAHOU100"
      }
    },
    {
      "id": 5,
      "job_id": 1,
      "workflow_type_id": 1,
      "external_tool": "Email",
      "action_id": 1, //email end user
      "timestamp": 1792898398,
      "userinput_required": false,
      "job_object": {
        "device_id": 1,
        "hostname": "ASAHOU102"
      }
    },
    {
      "id": 6,
      "job_id": 1,
      "workflow_type_id": 1,
      "external_tool": "Email",
      "action_id": 1, //email end user
      "timestamp": 1792898398,
      "userinput_required": false,
      "job_object": {
        "device_id": 1,
        "hostname": "ASAHOU102"
      }
    },
    {
      "id": 7,
      "job_id": 1,
      "workflow_type_id": 1,
      "external_tool": "BCG",
      "action_id": 2, //Get base config
      "timestamp": 1792898398,
      "userinput_required": true,
      "job_object": {
        "device_id": 2,
        "hostname": "ASAHOU102",
        "action_name": "Complete Form",
        "schema": {
          "title": "a10_4430_Standard_Deployment",
          "type": "object",
          "properties": {
            "ha_id": {
              "title": "ha_id",
              "type": "string",
              "pattern": "[0-9]{1}"
            },
            "uplink_vlan_ip": {
              "title": "uplink_vlan_ip",
              "type": "string"
            }
          },
          "required": ["ha_id", "uplink_vlan_ip"]
        },
        "formData": {},
        "uiSchema": {
          // ""ui":FieldTemplate": "CustomFieldTemplate"
        }
      }
    },
    {
      "id": 8,
      "job_id": 1,
      "workflow_type_id": 1,
      "external_tool": "Proteus",
      "action_id": 3, //Update Tasks Status Details
      "timestamp": 1792898398,
      "userinput_required": false,
      "job_object": {
        "device_id": 1,
        "hostname": "ASAHOU102"
      }
    },
    {
      "id": 9,
      "job_id": 1,
      "workflow_type_id": 1,
      "external_tool": "Email",
      "action_id": 1, //Email user
      "timestamp": 1792898398,
      "userinput_required": false,
      "job_object": {
        "device_id": 1,
        "hostname": "ASAHOU102"
      }
    },
    {
      "id": 10,
      "job_id": 1,
      "workflow_type_id": 1,
      "external_tool": "Email",
      "action_id": 1, //email end user
      "timestamp": 1792898398,
      "userinput_required": false,
      "job_object": {
        "device_id": 3,
        "hostname": "ARTHOU100"
      }
    },
    {
      "id": 11,
      "job_id": 1,
      "workflow_type_id": 1,
      "external_tool": "BCG",
      "action_id": 2, //Get base config
      "timestamp": 1792898398,
      "userinput_required": true,
      "job_object": {
        "device_id": 3,
        "hostname": "ARTHOU100",
        "action_name": "Complete Form",
        "schema": {
          "title": "art_31108",
          "type": "object",
          "properties": {
            "snmp_password": {
              "title": "snmp_password",
              "type": "string",
              "pattern": "[0-9]{1}"
            },
            "stp_priority": {
              "title": "stp_priority",
              "type": "string",
              "enum": ["24576", "28672", "32768"]
            }
          },
          "required": ["snmp_password", "stp_priority"]
        },
        "formData": {},
        "uiSchema": {
          // ""ui":FieldTemplate": "CustomFieldTemplate"
        }
      }
    },
    {
      "id": 12,
      "job_id": 1,
      "workflow_type_id": 1,
      "external_tool": "Proteus",
      "action_id": 3, //Update Tasks Status Details
      "timestamp": 1792898398,
      "userinput_required": false,
      "job_object": {
        "device_id": 3,
        "hostname": "ARTHOU100"
      }
    },
    {
      "id": 13,
      "job_id": 1,
      "workflow_type_id": 1,
      "external_tool": "Email",
      "action_id": 1, //Email user
      "timestamp": 1792898398,
      "userinput_required": false,
      "job_object": {
        "device_id": 3,
        "hostname": "ARTHOU100"
      }
    },
    {
      "id": 14,
      "job_id": 1,
      "workflow_type_id": 1,
      "external_tool": "Email",
      "action_id": 1, //email end user
      "timestamp": 1792898398,
      "userinput_required": false,
      "job_object": {
        "device_id": 3,
        "hostname": "ARTHOU102"
      }
    }
  ]
};

export { tasks };
