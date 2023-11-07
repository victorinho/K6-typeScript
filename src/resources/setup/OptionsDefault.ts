export class OptionsDefaults {

    private static readonly CHECK_RATE: string = "rate==1"

    static OPTIONS_FUNCTIONAL: {} = {
        thresholds: {
            checks: [OptionsDefaults.CHECK_RATE],
        },
        scenarios: {
            contacts: {
                executor: 'shared-iterations',
                vus: 1,
                iterations: 1,
                maxDuration: "20m",
            },
        },
    };

    static OPTIONS_LOAD: {} = {
        stages: [
            {duration: "1m", target: 15}, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
            {duration: "2m", target: 15}, // stay at 100 users for 10 minutes
            {duration: "1m", target: 0}, // ramp-down to 0 users
        ],
        thresholds: {
            checks: [OptionsDefaults.CHECK_RATE],
            http_req_duration: ["p(99)<1500"], // 99% of requests must complete below 1.5s
        },
    }
}
