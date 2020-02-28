export const task_obj = {
    output: [
        {
            "ARTTTN0101": [
                {
                    "SevOne": {
                        "error": "('Could not parse SevOne response body. (\"Top level key \\'content\\' not found.\", 424)', 424)",
                        "result": [
                            {}
                        ],
                        "status": "Error"
                    }
                },
                {
                    "NEST": {
                        "result": [
                            {
                                "b:Notes": "CR000051190",
                                "b:SystemName": "All Systems",
                                "b:ModifiedDate": "2018-02-09T18:48:17.98",
                                "b:ToStateDescription": "InService",
                                "b:NextStateDescription": null,
                                "b:TechnologyDescription": "Other",
                                "b:StateChangeStatusDescription": "Completed"
                            }
                        ],
                        "status": "Success"
                    }
                },
                {
                    "CIAO": {
                        "error": "Dependency failed, no device IP was acquired.",
                        "result": [
                            {}
                        ],
                        "status": "Error"
                    }
                },
                {
                    "OneConsole Alarms (CIAO)": {
                        "result": {
                            "preview": false,
                            "results": {},
                            "messages": {
                                "0": {
                                    "text": "Could not load lookup=LOOKUP-vmr_operation_result",
                                    "type": "ERROR"
                                },
                                "1": {
                                    "text": "Could not load lookup=LOOKUP-vmr_record_type",
                                    "type": "ERROR"
                                },
                                "2": {
                                    "text": "Your timerange was substituted based on your search string",
                                    "type": "INFO"
                                }
                            },
                            "init_offset": 0,
                            "post_process_count": 0
                        },
                        "status": "Success"
                    }
                },
                {
                    "DNS": {
                        "error": "Dependency failed, no device IP was acquired.",
                        "result": [
                            {}
                        ],
                        "status": "Error"
                    }
                },
                {
                    "EAI": {
                        "result": null,
                        "status": "Success"
                    }
                },
                {
                    "EAI Paths": {
                        "result": [
                            "No Data"
                        ],
                        "status": "Success"
                    }
                },
                {
                    "Software Standards": {
                        "error": "Dependency failed, no device vendor was acquired.",
                        "result": [
                            {}
                        ],
                        "status": "Error"
                    }
                },
                {
                    "Splunk": {
                        "result": [
                            {
                                "Number of Entries(within the last 48 hrs)": 41
                            }
                        ],
                        "status": "Success"
                    }
                }
            ]
        }
    ]
};