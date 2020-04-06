export const task_obj = {
  output: [
    {
      ASAPOL88: [
        {
          SevOne: {
            status: "Success",
            result: [
              {
                name: "ASAPOL88",
                snmpTestOid: ".1.3.6.1.2.1.1.1.0",
                numElements: 56,
                snmpVersion: "2",
                snmpPort: "161",
                ipAddress: "10.253.38.18"
              }
            ]
          }
        },
        {
          NEST: {
            status: "Success",
            result: [
              {
                "b:ModifiedDate": "2016-06-02T19:15:36.82",
                "b:ToStateDescription": "InService",
                "b:SystemName": "All Systems",
                "b:Notes":
                  "CR#2535786 - ASAPOL88 - Accepted into Production by Tier 2 IP Deployment Projects",
                "b:NextStateDescription": null,
                "b:TechnologyDescription": "Other",
                "b:StateChangeStatusDescription": "Completed"
              }
            ]
          }
        },
        {
          CIAO: {
            status: "Error",
            result: [{}],
            error:
              "('Could not reach, or authenticate with CIAO API. 500 Server Error: Internal Server Error for url: https://core.saas.api.t-mobile.com/ciao/monitoring/v1/validate', 424)"
          }
        },
        {
          DNS: {
            status: "Success",
            result: [
              {
                ip_address: "10.253.38.18",
                names: ["asapol88_mgmt.nmnet"],
                network_view: "NMNET"
              }
            ]
          }
        },
        {
          EAI: {
            status: "Success",
            result: [
              {
                status: "In Service",
                vendor: "CISCO",
                shelf: "42",
                clli: "EWNCWADT",
                model: "NEXUS 3064-X",
                rack: "08",
                row: "117"
              }
            ]
          }
        },
        {
          "EAI Paths": {
            status: "Success",
            result: [
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-31\\WSGPOL63_IO-R-ILO",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "10GbE",
                path: "ASAPOL88_E1-10\\NPAPOL31_IOR-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "10GbE",
                path: "ASAPOL88_E1-11\\NPAPOL32_IOR-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-47\\NPAPOL15_NIC2",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "10GbE",
                path: "ASAPOL88_E1-7\\NPAPOL16_IOR-1-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "10GbE",
                path: "ASAPOL88_E1-8\\NPAPOL17_IOR-1-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "10GbE",
                path: "ASAPOL88_E1-5\\NPAPOL11_IOR-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "10GbE",
                path: "ASAPOL88_E1-9\\NPAPOL30_IOR-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-45\\NPAPOL31_ILO",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "10GbE",
                path: "ASAPOL88_E1-5\\NPAPOL11_LOM1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-37\\WSGPOL58_IO-R-NIC-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-42\\WSGPOL57_IO-R-ILO",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-36\\WSGPOL57_IO-R-NIC-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-48\\NPAPOL11_ILO",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-28\\WSGPOL70_IO-R-NIC-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-32\\WSGPOL65_IO-R-ILO",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-21\\WSGPOL63_IO-R-NIC-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-22\\WSGPOL64_IO-R-NIC-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-23\\WSGPOL65_IO-R-NIC-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-34\\WSGPOL69_IO-R-ILO",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-27\\WSGPOL69_IO-R-NIC-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-30\\WSGPOL72_IO-R-NIC-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-26\\WSGPOL68_IO-R-NIC-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-35\\WSGPOL71_IO-R-ILO",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-29\\WSGPOL71_IO-R-NIC-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-24\\WSGPOL66_IO-R-NIC-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-33\\WSGPOL67_IO-R-ILO",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-25\\WSGPOL67_IO-R-NIC-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "10GbE",
                path: "ASAPOL88_E1-6\\NPAPOL12_IOR-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-39\\WSGPOL60_IO-R-NIC-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-40\\WSGPOL61_IO-R-NIC-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-41\\WSGPOL62_IO-R-NIC-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-46\\NPAPOL17_ILO",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "10GbE",
                path: "ASAPOL88_E1-12\\NPAPOL15_PCI1-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-44\\WSGPOL61_IO-R-ILO",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-43\\WSGPOL59_IO-R-ILO",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              },
              {
                status: "In Service",
                aSideSite: "POLARIS DATACENTER",
                host: "ASAPOL88",
                bandWidth: "GbE",
                path: "ASAPOL88_E1-38\\WSGPOL59_IO-R-NIC-1",
                zSideSite: "POLARIS DATACENTER",
                type: "IP DATA SERVICE"
              }
            ]
          }
        },
        {
          "Software Standards": {
            status: "Error",
            result: [{}],
            error: "Dependency failed, no device vendor was acquired."
          }
        },
        {
          Splunk: {
            status: "Success",
            result: [
              {
                "Number of Entries(within the last 48 hrs)": 1
              }
            ]
          }
        }
      ]
    },
    {
      LBZPOL57: [
        {
          SevOne: {
            status: "Success",
            result: [
              {
                name: "lbzpol57",
                snmpTestOid: ".1.3.6.1.2.1.1.1.0",
                numElements: 99,
                snmpVersion: "2",
                snmpPort: "161",
                ipAddress: "10.251.237.195"
              }
            ]
          }
        },
        {
          NEST: {
            status: "Success",
            result: []
          }
        },
        {
          CIAO: {
            status: "Error",
            result: [{}],
            error:
              "('Could not reach, or authenticate with CIAO API. 500 Server Error: Internal Server Error for url: https://core.saas.api.t-mobile.com/ciao/monitoring/v1/validate', 424)"
          }
        },
        {
          DNS: {
            status: "Success",
            result: [
              {
                ip_address: "10.251.237.195",
                names: ["lbzpol57.nmnet"],
                network_view: "NMNET"
              }
            ]
          }
        },
        {
          EAI: {
            status: "Success",
            result: [
              {
                status: "In Service",
                vendor: "A10",
                shelf: "23",
                clli: "No Data",
                model: "THUNDER 5440 ADC LB",
                rack: "011",
                row: "0215"
              }
            ]
          }
        },
        {
          "EAI Paths": {
            status: "Success",
            result: ["No Data"]
          }
        },
        {
          "Software Standards": {
            status: "Error",
            result: [{}],
            error: "Dependency failed, no device vendor was acquired."
          }
        },
        {
          Splunk: {
            status: "Success",
            result: [
              {
                "Number of Entries(within the last 48 hrs)": 419
              }
            ]
          }
        }
      ]
    }
  ]
};