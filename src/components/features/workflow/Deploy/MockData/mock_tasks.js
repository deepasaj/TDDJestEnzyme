var tasks = {
  // activeStep: 0,
  rows: [
    {
      id: 1,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "Email",
      action_id: 1, //email end user
      timestamp: 1792898398,
      userinput_required: false,
      job_object: {
        device_id: 1,
        hostname: "ASAHOU100"
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
        device_id: 1,
        hostname: "ASAHOU100",
        action_name: "Complete Form",
        schema: {
          title: "asa_31108",
          type: "object",
          properties: {
            snmp_password: {
              title: "snmp_password",
              type: "string"
            },
            neighbor_RR: {
              title: "neighbor_RR",
              type: "string",
              pattern: "[0-9]{3}.[0-9]{2}"
            },
            vlan111_sub: {
              title: "vlan111_sub",
              type: "string",
              pattern:
                "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/([3][0-1])"
            },
            bgp_as: {
              title: "bgp_as",
              type: "string",
              pattern: "[0-9]{5}"
            },
            hostname: {
              title: "hostname",
              type: "string",
              maxLength: 10,
              minLength: 8,
              pattern: "^ART[A-Z]{3}([A-Z][0-9]|[0-9]{4})"
            },
            neighbor_name: {
              title: "neighbor_name",
              type: "string",
              maxLength: 10,
              minLength: 8,
              pattern: "^ART[A-Z]{3}([A-Z][0-9]|[0-9]{4})"
            },
            vlan111_ip: {
              title: "vlan111_ip",
              type: "string",
              pattern:
                "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/([3][0-1])"
            },
            loopback0: {
              title: "loopback0",
              type: "string",
              pattern:
                "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])"
            },
            neighbor_ip: {
              title: "neighbor_ip",
              type: "string",
              pattern:
                "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])"
            },
            mgmt_ip: {
              title: "mgmt_ip",
              type: "string",
              pattern:
                "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/([1-2][0-9])"
            },
            mgmt_description: {
              title: "mgmt_description",
              type: "string",
              pattern: "[aA-zZ]|[0-9]"
            },
            stp_priority: {
              title: "stp_priority",
              type: "string",
              enum: ["24576", "28672", "32768"]
            }
          },
          required: [
            "snmp_password",
            "neighbor_RR",
            "vlan111_sub",
            "bgp_as",
            "hostname",
            "neighbor_name",
            "vlan111_ip",
            "loopback0",
            "neighbor_ip",
            "mgmt_ip",
            "mgmt_description",
            "stp_priority"
          ]
        },
        formData: {
         },
        uiSchema: {
          // "ui:FieldTemplate": "CustomFieldTemplate"
        }
      }
    },
    {
      id: 3,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "Proteus",
      action_id: 3, //Update Tasks Status Details
      timestamp: 1792898398,
      userinput_required: false,
      job_object: {
        device_id: 1,
        hostname: "ASAHOU100"
      }
    },
    {
      id: 4,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "Email",
      action_id: 1, //Email user
      timestamp: 1792898398,
      userinput_required: false,
      job_object: {
        device_id: 1,
        hostname: "ASAHOU100"
      }
    },
    {
      id: 5,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "Email",
      action_id: 1, //email end user
      timestamp: 1792898398,
      userinput_required: false,
      job_object: {
        device_id: 1,
        hostname: "ASAHOU102"
      }
    },
    {
      id: 6,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "Email",
      action_id: 1, //email end user
      timestamp: 1792898398,
      userinput_required: false,
      job_object: {
        device_id: 1,
        hostname: "ASAHOU102"
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
        device_id: 2,
        hostname: "ASAHOU102",
        action_name: "Complete Form",
        schema: {
          title: "a10_4430_Standard_Deployment",
          type: "object",
          properties: {
            ha_id: {
              title: "ha_id",
              type: "string"
            },
            uplink_vlan_ip: {
              title: "uplink_vlan_ip",
              type: "string"
            },
            snmp_password: {
              title: "snmp_password",
              type: "string"
            },
            eth13_uplink_int: {
              title: "eth13_uplink_int",
              type: "string"
            },
            floating_ip: {
              title: "floating_ip",
              type: "string"
            },
            eth15_uplink_int: {
              title: "eth15_uplink_int",
              type: "string"
            },
            uplink_vlan_gateway: {
              title: "uplink_vlan_gateway",
              type: "string"
            },
            eth14_uplink_int: {
              title: "eth14_uplink_int",
              type: "string"
            },
            peer_hostname: {
              title: "peer_hostname",
              type: "string"
            },
            uplink_rr: {
              title: "uplink_rr",
              type: "string"
            },
            int_4094_ip: {
              title: "int_4094_ip",
              type: "string"
            },
            uplink_vlan_subnet: {
              title: "uplink_vlan_subnet",
              type: "string"
            },
            uplink_vlan_number: {
              title: "uplink_vlan_number",
              type: "string"
            },
            uplink_hostname: {
              title: "uplink_hostname",
              type: "string"
            },
            gw1b_ip: {
              title: "gw1b_ip",
              type: "string"
            },
            mgmt_mask: {
              title: "mgmt_mask",
              type: "string"
            },
            hostname: {
              title: "hostname",
              type: "string"
            },
            gw1a_ip: {
              title: "gw1a_ip",
              type: "string"
            },
            ha_check_gate: {
              title: "ha_check_gate",
              type: "string"
            },
            eth16_uplink_int: {
              title: "eth16_uplink_int",
              type: "string"
            },
            mgmt_ip: {
              title: "mgmt_ip",
              type: "string"
            },
            local_rr_location: {
              title: "local_rr_location",
              type: "string"
            }
          },
          required: [
            "ha_id",
            "uplink_vlan_ip",
            "snmp_password",
            "eth13_uplink_int",
            "floating_ip",
            "eth15_uplink_int",
            "uplink_vlan_gateway",
            "eth14_uplink_int",
            "peer_hostname",
            "uplink_rr",
            "int_4094_ip",
            "uplink_vlan_subnet",
            "uplink_vlan_number",
            "uplink_hostname",
            "gw1b_ip",
            "mgmt_mask",
            "hostname",
            "gw1a_ip",
            "ha_check_gate",
            "eth16_uplink_int",
            "mgmt_ip",
            "local_rr_location"
          ]
        },
        formData: {},
        uiSchema: {
          // "ui:FieldTemplate": "CustomFieldTemplate"
        }
      }
    },
    {
      id: 8,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "Proteus",
      action_id: 3, //Update Tasks Status Details
      timestamp: 1792898398,
      userinput_required: false,
      job_object: {
        device_id: 1,
        hostname: "ASAHOU102"
      }
    },
    {
      id: 9,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "Email",
      action_id: 1, //Email user
      timestamp: 1792898398,
      userinput_required: false,
      job_object: {
        device_id: 1,
        hostname: "ASAHOU102"
      }
    },
    {
      id: 10,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "Email",
      action_id: 1, //email end user
      timestamp: 1792898398,
      userinput_required: false,
      job_object: {
        device_id: 3,
        hostname: "ARTHOU100"
      }
    },
    {
      id: 11,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "BCG",
      action_id: 2, //Get base config
      timestamp: 1792898398,
      userinput_required: true,
      job_object: {
        device_id: 3,
        hostname: "ARTHOU100",
        action_name: "Complete Form",
        schema: {
          title: "art_31108",
          type: "object",
          properties: {
            snmp_password: {
              title: "snmp_password",
              type: "string"
            },
            neighbor_RR: {
              title: "neighbor_RR",
              type: "string",
              pattern: "[0-9]{3}.[0-9]{2}"
            },
            vlan111_sub: {
              title: "vlan111_sub",
              type: "string",
              pattern:
                "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/([3][0-1])"
            },
            bgp_as: {
              title: "bgp_as",
              type: "string",
              pattern: "[0-9]{5}"
            },
            hostname: {
              title: "hostname",
              type: "string",
              maxLength: 10,
              minLength: 8,
              pattern: "^ART[A-Z]{3}([A-Z][0-9]|[0-9]{4})"
            },
            neighbor_name: {
              title: "neighbor_name",
              type: "string",
              maxLength: 10,
              minLength: 8,
              pattern: "^ART[A-Z]{3}([A-Z][0-9]|[0-9]{4})"
            },
            vlan111_ip: {
              title: "vlan111_ip",
              type: "string",
              pattern:
                "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/([3][0-1])"
            },
            loopback0: {
              title: "loopback0",
              type: "string",
              pattern:
                "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])"
            },
            neighbor_ip: {
              title: "neighbor_ip",
              type: "string",
              pattern:
                "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])"
            },
            mgmt_ip: {
              title: "mgmt_ip",
              type: "string",
              pattern:
                "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/([1-2][0-9])"
            },
            mgmt_description: {
              title: "mgmt_description",
              type: "string",
              pattern: "[aA-zZ]|[0-9]"
            },
            stp_priority: {
              title: "stp_priority",
              type: "string",
              enum: ["24576", "28672", "32768"]
            }
          },
          required: [
            "snmp_password",
            "neighbor_RR",
            "vlan111_sub",
            "bgp_as",
            "hostname",
            "neighbor_name",
            "vlan111_ip",
            "loopback0",
            "neighbor_ip",
            "mgmt_ip",
            "mgmt_description",
            "stp_priority"
          ]
        },
        formData: {},
        uiSchema: {
          // "ui:FieldTemplate": "CustomFieldTemplate"
        }
      }
    },
    {
      id: 12,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "Proteus",
      action_id: 3, //Update Tasks Status Details
      timestamp: 1792898398,
      userinput_required: false,
      job_object: {
        device_id: 3,
        hostname: "ARTHOU100"
      }
    },
    {
      id: 13,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "Email",
      action_id: 1, //Email user
      timestamp: 1792898398,
      userinput_required: false,
      job_object: {
        device_id: 3,
        hostname: "ARTHOU100"
      }
    },
    {
      id: 14,
      job_id: 1,
      workflow_type_id: 1,
      external_tool: "Email",
      action_id: 1, //email end user
      timestamp: 1792898398,
      userinput_required: false,
      job_object: {
        device_id: 3,
        hostname: "ARTHOU102"
      }
    }
  ]
};

export { tasks };
