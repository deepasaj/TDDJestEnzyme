var tasks = {
  // activeStep: 0,
  rows: [
    {
      id: 1,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "BCG",
      action_id: 2, //Get base config
      timestamp: 1792898398,
      userinput_required: true,
      job_object: {
        device_id: 1,
        hostname: "ASAHOU100",
        action_name: "Complete Form",
        schema: {
          title: "asa_31108",
          type: "object",
          properties: {
            neighbor_RR: {
              title: "neighbor_RR",
              type: "string",
              pattern: "[0-9]{3}.[0-9]{2}"
            },
            stp_priority: {
              title: "stp_priority",
              type: "string",
              enum: ["24576", "28672", "32768"]
            }
          },
          required: ["neighbor_RR", "stp_priority"]
        },
        formData: {},
        uiSchema: {
          // "ui:FieldTemplate": "CustomFieldTemplate"
        }
      }
    },
    {
      id: 2,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "BCG",
      action_id: 2, //Get base config
      timestamp: 1792898398,
      userinput_required: true,
      job_object: {
        device_id: 2,
        hostname: "ASAHOU102",
        action_name: "Complete Form",
        schema: {
          title: "a10_4430_Standard_Deployment",
          type: "object",
          properties: {
            ha_id: {
              title: "ha_id",
              type: "string",
              pattern: "[0-9]{1}"
            },
            uplink_vlan_ip: {
              title: "uplink_vlan_ip",
              type: "string"
            }
          },
          required: ["ha_id", "uplink_vlan_ip"]
        },
        formData: {},
        uiSchema: {
          // "ui:FieldTemplate": "CustomFieldTemplate"
        }
      }
    },
    {
      id: 3,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "BCG",
      action_id: 2, //Get base config
      timestamp: 1792898398,
      userinput_required: true,
      job_object: {
        device_id: 3,
        hostname: "ARTHOU103",
        action_name: "Complete Form",
        schema: {
          title: "art_31108",
          type: "object",
          properties: {
            snmp_password: {
              title: "snmp_password",
              type: "string",
              pattern: "[0-9]{1}"
            },
            stp_priority: {
              title: "stp_priority",
              type: "string",
              enum: ["24576", "28672", "32768"]
            }
          },
          required: ["snmp_password", "stp_priority"]
        },
        formData: {},
        uiSchema: {
          // "ui:FieldTemplate": "CustomFieldTemplate"
        }
      }
    },
    {
      id: 4,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "BCG",
      action_id: 2, //Get base config
      timestamp: 1792898398,
      userinput_required: true,
      job_object: {
        device_id: 3,
        hostname: "ARTHOU104",
        action_name: "Complete Form",
        schema: {
          title: "art_31108",
          type: "object",
          properties: {
            snmp_password: {
              title: "snmp_password",
              type: "string",
              pattern: "[0-9]{1}"
            },
            stp_priority: {
              title: "stp_priority",
              type: "string",
              enum: ["24576", "28672", "32768"]
            }
          },
          required: ["snmp_password", "stp_priority"]
        },
        formData: {},
        uiSchema: {
          // "ui:FieldTemplate": "CustomFieldTemplate"
        }
      }
    },
    {
      id: 5,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "BCG",
      action_id: 2, //Get base config
      timestamp: 1792898398,
      userinput_required: true,
      job_object: {
        device_id: 3,
        hostname: "ARTHOU105",
        action_name: "Complete Form",
        schema: {
          title: "art_31108",
          type: "object",
          properties: {
            snmp_password: {
              title: "snmp_password",
              type: "string",
              pattern: "[0-9]{1}"
            },
            stp_priority: {
              title: "stp_priority",
              type: "string",
              enum: ["24576", "28672", "32768"]
            }
          },
          required: ["snmp_password", "stp_priority"]
        },
        formData: {},
        uiSchema: {
          // "ui:FieldTemplate": "CustomFieldTemplate"
        }
      }
    },
    {
      id: 6,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "BCG",
      action_id: 2, //Get base config
      timestamp: 1792898398,
      userinput_required: true,
      job_object: {
        device_id: 3,
        hostname: "ARTHOU106",
        action_name: "Complete Form",
        schema: {
          title: "art_31108",
          type: "object",
          properties: {
            snmp_password: {
              title: "snmp_password",
              type: "string",
              pattern: "[0-9]{1}"
            },
            stp_priority: {
              title: "stp_priority",
              type: "string",
              enum: ["24576", "28672", "32768"]
            }
          },
          required: ["snmp_password", "stp_priority"]
        },
        formData: {},
        uiSchema: {
          // "ui:FieldTemplate": "CustomFieldTemplate"
        }
      }
    },
    {
      id: 7,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "BCG",
      action_id: 2, //Get base config
      timestamp: 1792898398,
      userinput_required: true,
      job_object: {
        device_id: 3,
        hostname: "ARTHOU1070",
        action_name: "Complete Form",
        schema: {
          title: "art_31108",
          type: "object",
          properties: {
            snmp_password: {
              title: "snmp_password",
              type: "string",
              pattern: "[0-9]{1}"
            },
            stp_priority: {
              title: "stp_priority",
              type: "string",
              enum: ["24576", "28672", "32768"]
            }
          },
          required: ["snmp_password", "stp_priority"]
        },
        formData: {},
        uiSchema: {
          // "ui:FieldTemplate": "CustomFieldTemplate"
        }
      }
    }
  ]
};

export { tasks };
